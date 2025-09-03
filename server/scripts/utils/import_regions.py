import asyncio
import json
import re
import time
import zipfile
from pathlib import Path
from typing import Any

import httpx
from app.base.models import Address
from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.geocoding.documents import Region
from app.geocoding.models import GeoJSONPoint, GeoJSONPolygon
from pydantic import ValidationError
from pydantic_extra_types.country import CountryAlpha2
from pymongo.errors import BulkWriteError

# WhoisOnFirst Import Script
# =========================
# This script imports geographic region data from WhoisOnFirst (WOF) data.
# WhoisOnFirst provides comprehensive, hierarchical geographic data as GeoJSON.
#
# Supported place types:
# - Countries
# - States/Provinces (regions)
# - Cities (localities)
# - Localities (smaller populated places)
# - Neighbourhoods
#
# Usage:
#   python import_regions.py           # Normal import (resumes automatically)
#   python import_regions.py --reset   # Reset progress and start fresh
#   python import_regions.py --level country  # Import only countries

# -------------------
# CONFIG
# -------------------
DATA_DIR = Path("./data/whoisonfirst")
BATCH_SIZE = 100
PROGRESS_FILE = DATA_DIR / "import_progress.json"
MAX_RETRIES = 3
RETRY_DELAY = 5


# Alternative: Use Natural Earth for countries/states and OSM for cities/neighborhoods
NATURAL_EARTH_URLS = {
    "countries": "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries.zip",
    "states": "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip",
}

# Reliable data sources replacing WhoisOnFirst
WOF_BUNDLES = {
    # Global data from Natural Earth
    "country": "https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_0_countries.zip",
    "region": "https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_1_states_provinces.zip",
    # India-specific data from GeoNames
    "locality": "http://download.geonames.org/export/dump/IN.zip",
    "neighbourhood": "http://download.geonames.org/export/dump/IN.zip",
}

# Map WOF place types to our region levels
WOF_LEVEL_MAPPING = {
    "country": "country",
    "dependency": "country",  # territories, dependencies
    "region": "state",
    "macroregion": "state",
    "locality": "city",
    "localadmin": "locality",
    "neighbourhood": "neighbourhood",
    "microhood": "neighbourhood",
}

# -------------------
# HELPERS
# -------------------


def safe_str(value: Any) -> str | None:
    """Return stripped string, or None if missing."""
    if value is None:
        return None
    if isinstance(value, (str, int, float)):
        s = str(value).strip()
        return s if s else None
    return None


def clean_country_code(code: str | None) -> CountryAlpha2 | None:
    """Return valid alpha2 code or None if invalid."""
    if not isinstance(code, str):
        return None
    code = code.strip().upper()
    if len(code) != 2 or not code.isalpha():
        return None
    try:
        from pydantic import TypeAdapter

        adapter = TypeAdapter(CountryAlpha2)
        return adapter.validate_python(code)
    except (ValidationError, Exception):
        return None


def is_english_text(text: str) -> bool:
    """Check if text contains only English/Latin characters."""
    if not text:
        return False
    # Allow Latin characters, spaces, hyphens, apostrophes, periods, commas
    pattern = r"^[a-zA-Z\s\-\'\.,&()]+$"
    return bool(re.match(pattern, text.strip()))


def filter_english_names(names: list[str]) -> list[str]:
    """Filter names to only include English/Latin script names."""
    if not names:
        return []

    english_names = []
    for name in names:
        if not name or len(name.strip()) < 2:
            continue
        # Skip if contains non-Latin characters
        if not is_english_text(name.strip()):
            continue
        # Skip if it's all uppercase and short (likely a code)
        if name.isupper() and len(name) < 5:
            continue
        english_names.append(name.strip())

    # Remove duplicates while preserving order
    seen = set()
    return [
        name
        for name in english_names
        if not (name.lower() in seen or seen.add(name.lower()))
    ]


def extract_wof_names(properties: dict) -> tuple[str | None, list[str]]:
    """Extract primary name and aliases from WOF properties."""
    # Primary name - prefer English names
    primary_name = None

    # Try different name fields in order of preference
    name_fields = [
        "wof:name",
        "name:eng_x_preferred",
        "name:eng_x_variant",
        "wof:shortcode",
        "wof:lang_x_spoken",
    ]

    for field in name_fields:
        if properties.get(field):
            if isinstance(properties[field], list) and properties[field]:
                primary_name = safe_str(properties[field][0])
            else:
                primary_name = safe_str(properties[field])
            if primary_name:
                break

    if not primary_name:
        return None, []

    # Collect aliases from various name fields
    aliases = []

    # Name variants and translations
    for key, value in properties.items():
        if key.startswith("name:") and key != "name:eng_x_preferred":
            if isinstance(value, list):
                aliases.extend([safe_str(v) for v in value if v])
            elif value:
                aliases.append(safe_str(value))

    # Add WOF label if different from primary name
    if "wof:label" in properties:
        label = safe_str(properties["wof:label"])
        if label and label != primary_name:
            aliases.append(label)

    # Filter to English names only and remove duplicates
    aliases = filter_english_names([a for a in aliases if a and a != primary_name])

    return primary_name, aliases


def extract_geometry_and_coordinates(geojson: dict) -> tuple[dict | None, dict | None]:
    """Extract geometry and coordinates from GeoJSON feature."""
    geometry = geojson.get("geometry")
    if not geometry:
        return None, None

    # Handle different geometry types
    geom_type = geometry.get("type")
    coordinates = geometry.get("coordinates")

    if not coordinates:
        return None, None

    # For polygons, use as-is but validate
    if geom_type in ["Polygon", "MultiPolygon"]:
        try:
            # For MultiPolygon, take the largest polygon
            if geom_type == "MultiPolygon":
                if not coordinates or not coordinates[0]:
                    return None, None
                # Find largest polygon by coordinate count
                largest = max(coordinates, key=lambda p: len(p[0]) if p and p[0] else 0)
                polygon_geom = {"type": "Polygon", "coordinates": largest}
            else:
                polygon_geom = geometry

            # Create point from polygon centroid (approximate)
            if polygon_geom["coordinates"] and polygon_geom["coordinates"][0]:
                exterior_ring = polygon_geom["coordinates"][0]
                if len(exterior_ring) >= 3:
                    # Calculate centroid
                    total_x = sum(coord[0] for coord in exterior_ring)
                    total_y = sum(coord[1] for coord in exterior_ring)
                    count = len(exterior_ring)
                    center_x = total_x / count
                    center_y = total_y / count

                    point_geom = {"type": "Point", "coordinates": [center_x, center_y]}
                    return polygon_geom, point_geom

        except (TypeError, IndexError, KeyError):
            pass

    # For points, use directly
    elif geom_type == "Point":
        if len(coordinates) >= 2:
            return None, geometry  # No polygon for points

    return None, None


def extract_address_info(properties: dict, level: str) -> Address:
    """Extract address information from WOF properties."""
    # Get country code
    country_code = None
    if "wof:country" in properties:
        country_code = clean_country_code(properties["wof:country"])
    elif "iso:country" in properties:
        country_code = clean_country_code(properties["iso:country"])

    # Get parent region names for address hierarchy
    address_locality = None
    address_region = None

    # Extract parent place names from hierarchy
    if properties.get("wof:hierarchy"):
        hierarchy = (
            properties["wof:hierarchy"][0]
            if isinstance(properties["wof:hierarchy"], list)
            else properties["wof:hierarchy"]
        )

        # For different levels, use appropriate hierarchy
        if level in ["neighbourhood", "locality"]:
            # For neighborhoods/localities, use locality as address_locality
            if "locality_id" in hierarchy and hierarchy["locality_id"] != -1:
                address_locality = safe_str(properties.get("wof:name"))

        if level != "country":
            # Use region for address_region (state/province)
            if "region_id" in hierarchy and hierarchy["region_id"] != -1:
                # We'll need to look this up, for now use placetype
                pass

    return Address(
        street_address=None,
        address_locality=address_locality,
        address_region=address_region,
        postal_code=None,  # WOF doesn't typically have postal codes
        country=country_code,
    )


class ProgressTracker:
    """Track import progress to enable resumption after interruptions."""

    def __init__(self, progress_file: Path) -> None:
        self.progress_file = progress_file
        self.progress = self._load_progress()

    def _load_progress(self) -> dict:
        """Load existing progress or create new."""
        if self.progress_file.exists():
            try:
                with open(self.progress_file) as f:
                    return json.load(f)
            except Exception as e:
                print(f"Warning: Could not load progress file: {e}")

        return {
            "countries_completed": False,
            "states_completed": False,
            "cities_completed": False,
            "localities_completed": False,
            "neighbourhoods_completed": False,
            "countries_count": 0,
            "states_count": 0,
            "cities_count": 0,
            "localities_count": 0,
            "neighbourhoods_count": 0,
            "last_update": None,
        }

    def save_progress(self) -> None:
        """Save current progress to file."""
        try:
            self.progress_file.parent.mkdir(parents=True, exist_ok=True)
            self.progress["last_update"] = time.time()
            with open(self.progress_file, "w") as f:
                json.dump(self.progress, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save progress: {e}")

    def mark_completed(self, step: str, count: int = 0) -> None:
        """Mark a step as completed."""
        self.progress[f"{step}_completed"] = True
        if count > 0:
            self.progress[f"{step}_count"] = count
        self.save_progress()

    def is_completed(self, step: str) -> bool:
        """Check if a step is completed."""
        return self.progress.get(f"{step}_completed", False)


async def download_and_extract_wof_bundle(wof_type: str, dest_dir: Path) -> Path:
    """Download and extract data bundle."""
    url = WOF_BUNDLES[wof_type]
    dest_dir.mkdir(parents=True, exist_ok=True)

    filename = url.split("/")[-1]
    archive_path = dest_dir / filename
    extract_dir = dest_dir / wof_type

    # Check if already extracted
    if extract_dir.exists() and any(extract_dir.iterdir()):
        print(f"📂 {wof_type} data already extracted, skipping download")
        return extract_dir

    # Download if not exists
    if not archive_path.exists():
        print(f"⬇️  Downloading {wof_type} data...")
        async with httpx.AsyncClient(timeout=300.0) as client:
            async with client.stream("GET", url) as response:
                response.raise_for_status()
                with open(archive_path, "wb") as f:
                    async for chunk in response.aiter_bytes():
                        f.write(chunk)
        print(f"✅ Downloaded {filename}")

    # Extract
    print(f"📦 Extracting {filename}...")
    if filename.endswith(".tar.bz2"):
        import tarfile

        with tarfile.open(archive_path, "r:bz2") as tar:
            tar.extractall(extract_dir)
    elif filename.endswith(".zip"):
        with zipfile.ZipFile(archive_path, "r") as zip_file:
            zip_file.extractall(extract_dir)

    print(f"✅ Extracted to {extract_dir}")
    return extract_dir


async def check_existing_documents(docs: list[Region]) -> list[Region]:
    """Filter out documents that already exist in the database."""
    if not docs:
        return []

    # Get existing region names by level
    existing_names_by_level = {}
    for level in ["country", "state", "city", "locality", "neighbourhood"]:
        existing_regions = await Region.find(Region.level == level).to_list()
        existing_names_by_level[level] = {
            region.name.lower() for region in existing_regions
        }

    # Filter out existing documents
    new_docs = []
    for doc in docs:
        level_existing = existing_names_by_level.get(doc.level, set())
        if doc.name.lower() not in level_existing:
            new_docs.append(doc)

    if len(new_docs) < len(docs):
        print(
            f"📋 Filtered {len(docs) - len(new_docs)} existing documents, {len(new_docs)} new"
        )

    return new_docs


async def insert_in_batches(docs: list[Region], step_name: str) -> int:
    """Insert documents in batches with error handling."""
    if not docs:
        return 0

    # Filter existing documents
    docs = await check_existing_documents(docs)
    if not docs:
        print("📋 No new documents to insert")
        return 0

    total_inserted = 0
    total_batches = (len(docs) + BATCH_SIZE - 1) // BATCH_SIZE

    for i in range(0, len(docs), BATCH_SIZE):
        batch_num = i // BATCH_SIZE + 1
        batch = docs[i : i + BATCH_SIZE]

        retry_count = 0
        while retry_count <= MAX_RETRIES:
            try:
                print(
                    f"🔄 Processing batch {batch_num}/{total_batches} ({len(batch)} docs)..."
                )

                result = await Region.insert_many(batch, ordered=False)
                inserted_count = len(result.inserted_ids)
                total_inserted += inserted_count

                print(f"✅ Batch {batch_num}: Inserted {inserted_count} documents")
                break

            except BulkWriteError as e:
                retry_count += 1
                details = e.details
                inserted_count = details.get("nInserted", 0)
                total_inserted += inserted_count

                # Handle duplicate key errors (expected during resume)
                write_errors = details.get("writeErrors", [])
                duplicate_errors = [
                    err for err in write_errors if err.get("code") == 11000
                ]

                if len(duplicate_errors) == len(write_errors):
                    print(f"📋 Batch {batch_num}: All duplicates (expected)")
                    break

                if retry_count <= MAX_RETRIES:
                    print(f"⏳ Retrying batch {batch_num}...")
                    await asyncio.sleep(RETRY_DELAY)
                else:
                    print(f"💥 Failed batch {batch_num} after retries")

            except Exception as e:
                retry_count += 1
                print(f"❌ Error in batch {batch_num}: {e}")
                if retry_count <= MAX_RETRIES:
                    await asyncio.sleep(RETRY_DELAY)
                else:
                    print(f"💥 Failed batch {batch_num} permanently")

    print(f"📊 {step_name}: Inserted {total_inserted}/{len(docs)} documents")
    return total_inserted


def find_geojson_files(data_dir: Path) -> list[Path]:
    """Find all GeoJSON files in the WOF data directory."""
    geojson_files = []

    # WOF data is typically organized in nested directories
    # Look for .geojson files recursively
    for file_path in data_dir.rglob("*.geojson"):
        geojson_files.append(file_path)

    return geojson_files


async def import_wof_data_type(
    wof_type: str, our_level: str, progress_tracker: ProgressTracker
) -> None:
    """Import a specific type of data."""

    step_name = our_level + "s"  # countries, states, etc.

    if progress_tracker.is_completed(
        step_name.rstrip("s")
    ):  # Remove 's' for progress key
        print(f"📋 {step_name.title()} already imported, skipping...")
        return

    print(f"🌍 Importing {step_name}...")

    # Download and extract data
    data_dir = await download_and_extract_wof_bundle(wof_type, DATA_DIR)

    docs = []
    processed_count = 0
    skipped_count = 0

    # Handle different data sources
    if wof_type in ["country", "region"]:
        # Natural Earth data (Shapefiles)
        await process_natural_earth_data(data_dir, our_level, docs)
    elif wof_type in ["locality", "neighbourhood"]:
        # GeoNames India data (Text files)
        await process_geonames_india_data(data_dir, our_level, docs)

    print(f"📊 Created {len(docs)} {step_name}")

    # Insert documents
    if docs:
        inserted_count = await insert_in_batches(docs, step_name)
        progress_tracker.mark_completed(step_name.rstrip("s"), inserted_count)
    else:
        print(f"📋 No {step_name} to import")


async def process_natural_earth_data(
    data_dir: Path, our_level: str, docs: list
) -> None:
    """Process Natural Earth shapefile data."""
    try:
        import geopandas as gpd

        # Find shapefile
        shp_files = list(data_dir.rglob("*.shp"))
        if not shp_files:
            print(f"❌ No shapefile found in {data_dir}")
            return

        # Read shapefile
        gdf = gpd.read_file(shp_files[0])

        for _, row in gdf.iterrows():
            try:
                properties = row.to_dict()

                # Extract names for Natural Earth format
                primary_name = None
                name_fields = ["NAME_EN", "NAME", "ADMIN", "NAME_LONG"]

                for field in name_fields:
                    if properties.get(field):
                        primary_name = safe_str(properties[field])
                        if primary_name:
                            break

                if not primary_name:
                    continue

                # Get aliases
                aliases = []
                alias_fields = ["NAME_SORT", "NAME_ALT", "ABBREV", "POSTAL"]
                for field in alias_fields:
                    if properties.get(field):
                        alias = safe_str(properties[field])
                        if alias and alias != primary_name:
                            aliases.append(alias)

                aliases = filter_english_names(aliases)

                # Get geometry
                geometry = row.geometry
                if geometry is None:
                    continue

                # Get centroid for coordinates - fix coordinate handling
                if hasattr(geometry, "centroid"):
                    centroid = geometry.centroid
                    # Ensure coordinates are proper floats, not tuples
                    point_coords = [float(centroid.x), float(centroid.y)]
                    point_geom = {
                        "type": "Point",
                        "coordinates": point_coords,
                    }
                else:
                    continue

                # Convert geometry to GeoJSON and fix coordinate structure
                geom_dict = geometry.__geo_interface__

                # Clean up coordinate structure for polygons
                if geom_dict["type"] in ["Polygon", "MultiPolygon"]:

                    def clean_coordinates(coords):
                        """Recursively clean coordinate arrays to ensure they're lists of floats"""
                        if isinstance(coords, (list, tuple)):
                            if len(coords) == 2 and all(
                                isinstance(x, (int, float)) for x in coords
                            ):
                                # This is a coordinate pair
                                return [float(coords[0]), float(coords[1])]
                            else:
                                # This is a nested structure
                                return [clean_coordinates(item) for item in coords]
                        return coords

                    geom_dict["coordinates"] = clean_coordinates(
                        geom_dict["coordinates"]
                    )

                # Create address
                country_code = clean_country_code(properties.get("ISO_A2"))
                address = Address(
                    street_address=None,
                    address_locality=None,
                    address_region=None,
                    postal_code=None,
                    country=country_code,
                )

                # Create region with proper coordinate handling
                try:
                    polygon_geom = None
                    if geom_dict["type"] in ["Polygon", "MultiPolygon"]:
                        polygon_geom = GeoJSONPolygon(**geom_dict)

                    region = Region(
                        name=primary_name,
                        aliases=aliases,
                        level=our_level,  # type: ignore
                        geometry=polygon_geom,
                        coordinates=GeoJSONPoint(**point_geom),
                        address=address,
                    )
                    docs.append(region)
                except Exception as coord_error:
                    print(f"❌ Coordinate error for {primary_name}: {coord_error}")
                    continue

            except Exception as e:
                print(f"❌ Error processing region: {e}")
                continue

    except ImportError:
        print("❌ geopandas not installed. Install with: pip install geopandas")
    except Exception as e:
        print(f"❌ Error processing Natural Earth data: {e}")


async def process_geonames_india_data(
    data_dir: Path, our_level: str, docs: list
) -> None:
    """Process GeoNames India data for localities and neighbourhoods."""
    # Find the GeoNames text file
    txt_files = list(data_dir.rglob("IN.txt"))
    if not txt_files:
        print(f"❌ No GeoNames IN.txt file found in {data_dir}")
        return

    # Feature codes for different levels
    feature_codes = {
        "city": ["PPL", "PPLA", "PPLA2", "PPLA3", "PPLA4", "PPLC"],
        "locality": ["ADM2", "ADM3"],
        "neighbourhood": ["PPLX", "PPL"],
    }

    target_codes = feature_codes.get(our_level, [])
    processed_count = 0

    with open(txt_files[0], encoding="utf-8") as f:
        for line in f:
            if line.startswith("#"):
                continue

            try:
                # Parse GeoNames format
                parts = line.strip().split("\t")
                if len(parts) < 15:
                    continue

                processed_count += 1
                if processed_count % 1000 == 0:
                    print(f"   📊 Processed {processed_count} records...")

                feature_code = parts[7]
                if feature_code not in target_codes:
                    continue

                name = parts[1]
                latitude_str = parts[4]
                longitude_str = parts[5]

                if not name or not latitude_str or not longitude_str:
                    continue

                # Ensure proper float conversion
                try:
                    latitude = float(latitude_str)
                    longitude = float(longitude_str)
                except (ValueError, TypeError):
                    continue

                # Validate coordinate ranges
                if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
                    continue

                # Get alternate names
                alt_names = parts[3].split(",") if parts[3] else []
                aliases = filter_english_names(
                    [n.strip() for n in alt_names if n.strip()]
                )

                # Create point geometry with proper coordinate format
                point_geom = {"type": "Point", "coordinates": [longitude, latitude]}

                # Create address
                address = Address(
                    street_address=None,
                    address_locality=None,
                    address_region=None,
                    postal_code=None,
                    country=clean_country_code("IN"),
                )

                # Create region with validation
                try:
                    region = Region(
                        name=name,
                        aliases=aliases,
                        level=our_level,  # type: ignore
                        geometry=None,  # No polygon for GeoNames points
                        coordinates=GeoJSONPoint(**point_geom),
                        address=address,
                    )
                    docs.append(region)
                except Exception as validation_error:
                    print(f"❌ Validation error for {name}: {validation_error}")
                    continue

            except Exception as e:
                continue


async def import_all_wof_data(
    progress_tracker: ProgressTracker, level_filter: str | None = None
) -> None:
    """Import all data types."""

    # Define import order and mappings based on your requirements
    import_order = [
        ("country", "country"),  # Global countries
        ("region", "state"),  # Global states
        ("locality", "city"),  # India cities only
        ("locality", "locality"),  # India localities only
        ("neighbourhood", "neighbourhood"),  # India neighbourhoods only
    ]

    for wof_type, our_level in import_order:
        # Skip if level filter is specified and doesn't match
        if level_filter and our_level != level_filter:
            continue

        # For localities and neighbourhoods, only process India data
        if our_level in ["city", "locality", "neighbourhood"]:
            print(f"🇮🇳 Processing India-only {our_level} data...")

        await import_wof_data_type(wof_type, our_level, progress_tracker)


# -------------------
# MAIN IMPORT FUNCTION
# -------------------


async def main(level_filter: str | None = None) -> None:
    """Run the main import process."""
    try:
        await initialize_database(
            str(get_settings(DatabaseSettings).database_url),
            get_settings(DatabaseSettings).default_database_name,
        )

        print("🚀 Starting WhoisOnFirst regions import...")

        # Initialize progress tracker
        progress_tracker = ProgressTracker(PROGRESS_FILE)

        # Print current progress status
        if progress_tracker.progress.get("last_update"):
            last_update = time.ctime(progress_tracker.progress["last_update"])
            print(f"📋 Resuming from previous session (last update: {last_update})")

        # Import data
        await import_all_wof_data(progress_tracker, level_filter)

        print("🎉 WhoisOnFirst import completed successfully!")
        print("📊 Final stats:")
        for level in ["countries", "states", "cities", "localities", "neighbourhoods"]:
            count = progress_tracker.progress.get(f"{level[:-1]}_count", 0)
            print(f"   {level.title()}: {count}")

    except KeyboardInterrupt:
        print("\n⚠️ Import interrupted by user. Progress saved.")
        print("💡 Run the script again to resume.")
    except Exception as e:
        print(f"💥 Fatal error: {e}")
        raise


def reset_progress() -> None:
    """Reset import progress."""
    if PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()
        print("🔄 Progress reset.")
    else:
        print("📋 No progress file found.")


if __name__ == "__main__":
    import sys

    level_filter = None
    reset = False

    # Parse command line arguments
    for arg in sys.argv[1:]:
        if arg == "--reset":
            reset = True
        elif arg.startswith("--level="):
            level_filter = arg.split("=", 1)[1]
        elif arg in ["country", "state", "city", "locality", "neighbourhood"]:
            level_filter = arg

    if reset:
        reset_progress()
    else:
        asyncio.run(main(level_filter))

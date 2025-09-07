import asyncio
import json
import time
import zipfile
from pathlib import Path
from typing import Any

import httpx
from app.base.models import Address
from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.geocoding.documents import Region
from app.geocoding.models import GeoJSONMultiPolygon, GeoJSONPoint, GeoJSONPolygon
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
DATA_SOURCES = {
    # Global data from Natural Earth
    "country": "https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_0_countries.zip",
    "region": "https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_1_states_provinces.zip",
    # India-specific data from GeoNames
    "locality": "http://download.geonames.org/export/dump/IN.zip",
    "neighbourhood": "http://download.geonames.org/export/dump/IN.zip",
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


def is_valid_text(text: str) -> bool:
    """Check if text contains only English/Latin characters."""
    # if not text:
    #     return False
    # # Allow Latin characters, spaces, hyphens, apostrophes, periods, commas
    # pattern = r"^[a-zA-Z\s\-\'\.,&()]+$"
    # return bool(re.match(pattern, text.strip()))
    return True


def filter_english_names(names: list[str]) -> list[str]:
    """Filter names to only include English/Latin script names."""
    if not names:
        return []

    english_names = []
    for name in names:
        if not name or len(name.strip()) < 2:
            continue
        # Skip if contains non-Latin characters
        if not is_valid_text(name.strip()):
            continue
        # # Skip if it's all uppercase and short (likely a code)
        # if name.isupper() and len(name) < 5:
        #     continue
        english_names.append(name.strip())

    # Remove duplicates while preserving order
    seen = set()
    return [
        name
        for name in english_names
        if not (name.lower() in seen or seen.add(name.lower()))
    ]


def extract_postal_code(properties: dict, postal_fields: list[str]) -> str | None:
    """Extract postal code from properties using available fields."""
    for field in postal_fields:
        if properties.get(field):
            postal_code = safe_str(properties[field])
            if postal_code:
                return postal_code
    return None


def get_healthcare_aliases(name: str, level: str) -> list[str]:
    """Get healthcare-specific aliases for Indian locations."""
    aliases = []
    name_lower = name.lower()

    # Healthcare hub aliases and colloquial names for major Indian cities/states
    healthcare_aliases = {
        # Major healthcare destination cities
        "bangalore": [
            "bengaluru",
            "silicon valley of india",
            "garden city",
            "tech city",
        ],
        "bengaluru": [
            "bangalore",
            "silicon valley of india",
            "garden city",
            "tech city",
        ],
        "mumbai": ["bombay", "financial capital", "bollywood city"],
        "bombay": ["mumbai", "financial capital", "bollywood city"],
        "delhi": ["new delhi", "national capital territory", "nct", "capital"],
        "new delhi": ["delhi", "national capital territory", "nct", "capital"],
        "chennai": ["madras", "detroit of india", "health city"],
        "madras": ["chennai", "detroit of india", "health city"],
        "hyderabad": ["cyberabad", "hitec city", "pharma city"],
        "kolkata": ["calcutta", "city of joy", "cultural capital"],
        "calcutta": ["kolkata", "city of joy", "cultural capital"],
        "pune": ["poona", "oxford of the east", "pune city"],
        "poona": ["pune", "oxford of the east", "pune city"],
        "ahmedabad": ["amdavad", "karnavati", "commercial capital of gujarat"],
        "gurgaon": ["gurugram", "millennium city", "cyber city"],
        "gurugram": ["gurgaon", "millennium city", "cyber city"],
        "noida": ["new okhla industrial development authority"],
        "kochi": ["cochin", "queen of arabian sea"],
        "cochin": ["kochi", "queen of arabian sea"],
        "thiruvananthapuram": ["trivandrum", "tvm"],
        "trivandrum": ["thiruvananthapuram", "tvm"],
        "bhubaneswar": ["temple city", "planned city"],
        "jaipur": ["pink city", "paris of india"],
        "lucknow": ["city of nawabs"],
        "chandigarh": ["city beautiful", "planned city"],
        "indore": ["commercial capital of mp"],
        "nagpur": ["orange city", "geographical center of india"],
        "coimbatore": ["manchester of south india", "textile city"],
        "visakhapatnam": ["vizag", "city of destiny"],
        "vijayawada": ["bezawada"],
        "vadodara": ["baroda"],
        "surat": ["diamond city", "textile city"],
        "rajkot": ["ranger city"],
        "agra": ["city of taj"],
        "kanpur": ["manchester of east"],
        "patna": ["pataliputra"],
        # State aliases
        "karnataka": ["mysore state"],
        "tamil nadu": ["madras state", "tn"],
        "andhra pradesh": ["ap"],
        "telangana": ["ts"],
        "maharashtra": ["mh"],
        "west bengal": ["wb", "bengal"],
        "uttar pradesh": ["up"],
        "madhya pradesh": ["mp", "heart of india"],
        "rajasthan": ["land of kings"],
        "gujarat": ["jewel of west"],
        "kerala": ["gods own country"],
        "punjab": ["land of five rivers"],
        "haryana": ["wheat bowl of india"],
        "himachal pradesh": ["hp", "dev bhoomi"],
        "uttarakhand": ["uk", "dev bhoomi"],
        "jharkhand": ["land of forests"],
        "chhattisgarh": ["cg"],
        "odisha": ["orissa"],
        "assam": ["gateway to northeast"],
        "arunachal pradesh": ["ap", "land of rising sun"],
        "manipur": ["jewel of india"],
        "meghalaya": ["abode of clouds"],
        "mizoram": ["land of mizos"],
        "nagaland": ["land of festivals"],
        "sikkim": ["land of mystic splendor"],
        "tripura": ["land of tripura"],
        # Union territories
        "andaman and nicobar islands": ["andaman", "nicobar", "a&n islands"],
        "dadra and nagar haveli and daman and diu": [
            "dadra",
            "nagar haveli",
            "daman",
            "diu",
        ],
        "lakshadweep": ["laccadive islands"],
        "puducherry": ["pondicherry", "pondy"],
    }

    # Healthcare specialization aliases
    healthcare_specializations = {
        "hyderabad": ["genome valley", "vaccine capital"],
        "bangalore": ["biotech capital", "it capital"],
        "chennai": ["medical tourism hub"],
        "mumbai": ["pharmaceutical hub"],
        "delhi": ["medical capital"],
        "pune": ["pharma cluster"],
        "ahmedabad": ["pharma hub"],
        "goa": ["wellness destination"],
        "kerala": ["ayurveda capital", "medical tourism"],
    }

    # Add aliases based on exact or partial matches
    for location, location_aliases in healthcare_aliases.items():
        if location in name_lower or name_lower in location:
            aliases.extend(location_aliases)

    # Add healthcare specialization aliases
    for location, spec_aliases in healthcare_specializations.items():
        if location in name_lower or name_lower in location:
            aliases.extend(spec_aliases)

    # Add common abbreviations and variations
    if level in ["state", "country"]:
        # Add state-specific abbreviations
        state_abbrevs = {
            "andhra pradesh": ["ap"],
            "arunachal pradesh": ["ap"],
            "tamil nadu": ["tn"],
            "west bengal": ["wb"],
            "uttar pradesh": ["up"],
            "madhya pradesh": ["mp"],
            "himachal pradesh": ["hp"],
            "uttarakhand": ["uk"],
            "jammu and kashmir": ["j&k", "jk"],
        }

        for state, abbrevs in state_abbrevs.items():
            if state in name_lower:
                aliases.extend(abbrevs)

    return [alias for alias in aliases if alias and alias.lower() != name_lower]


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
    url = DATA_SOURCES[wof_type]
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
                    print(f"💥 Failed batch {batch_num} after retries: {e}")

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


async def import_specifc_data_type(
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
    if wof_type == "country":
        # Natural Earth data for countries
        await process_natural_earth_countries(data_dir, our_level, docs)
    elif wof_type == "region":
        # Natural Earth data for states/regions
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


async def process_natural_earth_countries(
    data_dir: Path, our_level: str, docs: list
) -> None:
    """Process Natural Earth shapefile data specifically for countries."""
    try:
        import geopandas as gpd

        # Find shapefile
        shp_files = list(data_dir.rglob("*.shp"))
        if not shp_files:
            print(f"❌ No shapefile found in {data_dir}")
            return

        print(f"📂 Found shapefile: {shp_files[0]}")

        # Read shapefile
        gdf = gpd.read_file(shp_files[0])
        print(f"📊 Loaded {len(gdf)} country records from shapefile")

        # Country-specific field mappings
        name_fields = ["NAME_EN", "NAME", "ADMIN", "NAME_LONG", "SOVEREIGNT"]
        alias_fields = [
            "NAME_SORT",
            "NAME_ALT",
            "ABBREV",
            "POSTAL",
            "NAME_LOCAL",
            "NAME_AR",
            "NAME_BN",
            "NAME_DE",
            "NAME_ES",
            "NAME_FR",
            "NAME_EL",
            "NAME_HI",
            "NAME_HU",
            "NAME_ID",
            "NAME_IT",
            "NAME_JA",
            "NAME_KO",
            "NAME_NL",
            "NAME_PL",
            "NAME_PT",
            "NAME_RU",
            "NAME_SV",
            "NAME_TR",
            "NAME_VI",
            "NAME_ZH",
            "ABBREV_LEN",
            "TINY",
            "HOMEPART",
        ]
        country_code_field = "ISO_A2"
        postal_code_fields = ["POSTAL", "POSTAL_CODE", "ZIP", "ZIPCODE"]
        region_fields = ["NAME_EN", "NAME", "ADMIN", "NAME_LONG", "SOVEREIGNT"]

        processed_count = 0
        skipped_count = 0
        error_count = 0

        for _, row in gdf.iterrows():
            try:
                properties = row.to_dict()
                processed_count += 1

                if processed_count % 25 == 0:
                    print(f"   📊 Processed {processed_count} countries...")

                # Extract names for Natural Earth format
                primary_name = None
                for field in name_fields:
                    if properties.get(field):
                        primary_name = safe_str(properties[field])
                        if primary_name:
                            break

                if not primary_name:
                    continue

                # Get aliases - Enhanced for healthcare recruitment
                aliases = []

                # Standard Natural Earth alias fields
                for field in alias_fields:
                    if properties.get(field):
                        alias = safe_str(properties[field])
                        if alias and alias != primary_name:
                            aliases.append(alias)

                # Add manual healthcare-specific aliases for countries
                aliases.extend(get_healthcare_aliases(primary_name, our_level))

                aliases = filter_english_names(aliases)

                # Get geometry
                geometry = row.geometry
                if geometry is None:
                    continue

                # Get centroid for coordinates
                if hasattr(geometry, "centroid"):
                    centroid = geometry.centroid
                    try:
                        lon = float(centroid.x)
                        lat = float(centroid.y)

                        # Validate coordinate ranges
                        if not (-180 <= lon <= 180) or not (-90 <= lat <= 90):
                            print(
                                f"Warning: Invalid centroid coordinates for {primary_name}: ({lon}, {lat})"
                            )
                            continue

                        # Create point geometry with validated coordinates
                        point_geom = {
                            "type": "Point",
                            "coordinates": [float(lon), float(lat)],
                        }
                    except (ValueError, TypeError, AttributeError) as centroid_error:
                        print(
                            f"Warning: Failed to extract centroid for {primary_name}: {centroid_error}"
                        )
                        continue
                else:
                    continue

                # Convert geometry to GeoJSON
                geom_dict = geometry.__geo_interface__

                # Clean up coordinate structure for polygons
                if geom_dict["type"] in ["Polygon", "MultiPolygon"]:
                    # Use the same coordinate cleaning functions as the main function
                    def clean_coordinates(coords):
                        if not isinstance(coords, (list, tuple)):
                            return coords

                        if len(coords) == 2 and all(
                            isinstance(x, (int, float)) for x in coords
                        ):
                            try:
                                lon, lat = float(coords[0]), float(coords[1])
                                if (-180 <= lon <= 180) and (-90 <= lat <= 90):
                                    return [lon, lat]
                                else:
                                    return []
                            except (ValueError, TypeError):
                                return []

                        if len(coords) == 3 and all(
                            isinstance(x, (int, float)) for x in coords
                        ):
                            try:
                                lon, lat = float(coords[0]), float(coords[1])
                                if (-180 <= lon <= 180) and (-90 <= lat <= 90):
                                    return [lon, lat]
                                else:
                                    return []
                            except (ValueError, TypeError):
                                return []

                        try:
                            cleaned = []
                            for item in coords:
                                if item is not None:
                                    result = clean_coordinates(item)
                                    if result:
                                        cleaned.append(result)
                            return cleaned
                        except (TypeError, ValueError):
                            return []

                    def remove_duplicate_vertices(coords):
                        if not isinstance(coords, list):
                            return coords

                        if (
                            len(coords) > 0
                            and isinstance(coords[0], list)
                            and len(coords[0]) == 2
                        ):
                            cleaned_ring = []
                            prev_point = None

                            for point in coords:
                                if prev_point is None or point != prev_point:
                                    cleaned_ring.append(point)
                                    prev_point = point

                            if (
                                len(cleaned_ring) > 2
                                and cleaned_ring[0] != cleaned_ring[-1]
                            ):
                                cleaned_ring.append(cleaned_ring[0])

                            return cleaned_ring
                        else:
                            return [remove_duplicate_vertices(item) for item in coords]

                    try:
                        geom_dict["coordinates"] = clean_coordinates(
                            geom_dict["coordinates"]
                        )
                        geom_dict["coordinates"] = remove_duplicate_vertices(
                            geom_dict["coordinates"]
                        )

                        if not geom_dict["coordinates"]:
                            print(
                                f"Warning: Empty coordinates after cleaning for {primary_name}"
                            )
                            continue

                    except Exception as clean_error:
                        print(
                            f"Warning: Failed to clean coordinates for {primary_name}: {clean_error}"
                        )
                        continue

                # Create address with postal code information
                country_code = clean_country_code(properties.get(country_code_field))
                postal_code = extract_postal_code(properties, postal_code_fields)

                # For countries, we don't have region/locality info
                address = Address(
                    street_address=None,
                    address_locality=None,
                    address_region=None,
                    postal_code=postal_code,
                    country=country_code,
                )

                # Create region with proper coordinate handling
                try:
                    polygon_geom = None

                    # Validate geometry using Shapely
                    try:
                        from shapely.geometry import shape
                        from shapely.validation import make_valid

                        shapely_geom = shape(geom_dict)

                        if not shapely_geom.is_valid:
                            print(
                                f"Warning: Invalid geometry for {primary_name}, attempting to fix..."
                            )
                            shapely_geom = make_valid(shapely_geom)
                            geom_dict = shapely_geom.__geo_interface__

                        if shapely_geom.is_empty:
                            print(
                                f"Warning: Empty geometry after fixing for {primary_name}"
                            )
                            continue

                    except Exception as shapely_error:
                        print(
                            f"Warning: Failed to validate geometry for {primary_name}: {shapely_error}"
                        )
                        continue

                    if geom_dict["type"] in ["Polygon"]:
                        try:
                            coords = geom_dict["coordinates"]
                            if coords and len(coords) > 0:
                                polygon_geom = GeoJSONPolygon(**geom_dict)
                        except (ValidationError, ValueError, TypeError) as poly_error:
                            print(
                                f"Warning: Invalid polygon geometry for {primary_name}: {poly_error}"
                            )
                            polygon_geom = None
                    elif geom_dict["type"] in ["MultiPolygon"]:
                        try:
                            coords = geom_dict["coordinates"]
                            if coords and len(coords) > 0:
                                polygon_geom = GeoJSONMultiPolygon(**geom_dict)
                        except (ValidationError, ValueError, TypeError) as poly_error:
                            print(
                                f"Warning: Invalid polygon geometry for {primary_name}: {poly_error}"
                            )
                            polygon_geom = None

                    # Validate point geometry
                    try:
                        coords = point_geom.get("coordinates", [])
                        if not isinstance(coords, list) or len(coords) != 2:
                            print(
                                f"❌ Invalid coordinates structure for {primary_name}: {coords}"
                            )
                            continue

                        try:
                            lon, lat = float(coords[0]), float(coords[1])
                            if not ((-180 <= lon <= 180) and (-90 <= lat <= 90)):
                                print(
                                    f"❌ Coordinates out of valid range for {primary_name}: ({lon}, {lat})"
                                )
                                continue
                            point_geom["coordinates"] = [lon, lat]
                        except (ValueError, TypeError, IndexError) as coord_err:
                            print(
                                f"❌ Cannot convert coordinates to float for {primary_name}: {coord_err}"
                            )
                            continue

                        point_obj = GeoJSONPoint(**point_geom)
                    except (ValidationError, ValueError, TypeError) as point_error:
                        print(
                            f"❌ Invalid point geometry for {primary_name}: {point_error}"
                        )
                        continue

                    region = Region(
                        name=primary_name,
                        aliases=aliases,
                        level=our_level,  # type: ignore
                        geometry=polygon_geom,
                        coordinates=point_obj,
                        address=address,
                    )
                    docs.append(region)

                except Exception as coord_error:
                    error_count += 1
                    if error_count <= 5:
                        print(
                            f"   ❌ Coordinate error for {primary_name}: {coord_error}"
                        )
                    continue

            except Exception as e:
                error_count += 1
                if error_count <= 5:
                    print(f"   ❌ Error processing country: {e}")
                continue

        print(f"✅ Processed {processed_count} countries, created {len(docs)} regions")
        print(f"📊 Summary: {skipped_count} skipped, {error_count} errors")

    except ImportError:
        print("❌ geopandas not installed. Install with: pip install geopandas")
    except Exception as e:
        print(f"❌ Error processing Natural Earth countries data: {e}")


async def process_natural_earth_data(
    data_dir: Path, our_level: str, docs: list
) -> None:
    """Process Natural Earth shapefile data for states/regions."""
    try:
        import geopandas as gpd

        # Find shapefile
        shp_files = list(data_dir.rglob("*.shp"))
        if not shp_files:
            print(f"❌ No shapefile found in {data_dir}")
            return

        print(f"📂 Found shapefile: {shp_files[0]}")

        # Read shapefile
        gdf = gpd.read_file(shp_files[0])
        print(f"📊 Loaded {len(gdf)} records from shapefile")

        # Debug: Print available columns to help with field mapping
        print(f"🔍 Available columns: {list(gdf.columns)}")

        # Define field mappings for Natural Earth admin-1 states/provinces
        # Based on actual Natural Earth admin-1 attribute table structure (all lowercase)
        postal_code_fields = ["postal", "postal_code", "zip", "zipcode", "post"]
        name_fields = ["name", "name_en", "name_long", "admin", "name_alt", "name_sort"]
        alias_fields = [
            "name_sort",
            "name_alt",
            "abbrev",
            "postal",
            "name_local",
            "name_ar",
            "name_bn",
            "name_de",
            "name_es",
            "name_fr",
            "name_el",
            "name_hi",
            "name_hu",
            "name_id",
            "name_it",
            "name_ja",
            "name_ko",
            "name_nl",
            "name_pl",
            "name_pt",
            "name_ru",
            "name_sv",
            "name_tr",
            "name_vi",
            "name_zh",
            "name_he",
            "name_uk",
            "name_ur",
            "name_fa",
            "name_zht",
            "abbrev_len",
            "tiny",
            "homepart",
            "name_ascii",  # Common in Natural Earth
            "name_abbrev",  # Common in Natural Earth
        ]
        country_code_field = "adm0_a3"  # Natural Earth uses adm0_a3 for country codes
        region_fields = ["name", "name_en", "admin", "name_long", "name_alt"]

        processed_count = 0
        skipped_count = 0
        error_count = 0

        for _, row in gdf.iterrows():
            try:
                properties = row.to_dict()
                processed_count += 1

                if processed_count % 50 == 0:
                    print(
                        f"   📊 Processed {processed_count} records... (skipped: {skipped_count}, errors: {error_count})"
                    )

                # Extract names for Natural Earth format
                primary_name = None
                for field in name_fields:
                    if properties.get(field):
                        primary_name = safe_str(properties[field])
                        if primary_name:
                            break

                if not primary_name:
                    skipped_count += 1
                    if (
                        skipped_count <= 5
                    ):  # Show first few skipped records for debugging
                        print(
                            f"   ⚠️  Skipped record {processed_count}: No valid name found in fields {name_fields}"
                        )
                    continue

                # Get aliases - Enhanced for healthcare recruitment
                aliases = []

                # Standard Natural Earth alias fields
                for field in alias_fields:
                    if properties.get(field):
                        alias = safe_str(properties[field])
                        if alias and alias != primary_name:
                            aliases.append(alias)

                # Add manual healthcare-specific aliases for Indian states/regions
                aliases.extend(get_healthcare_aliases(primary_name, our_level))

                aliases = filter_english_names(aliases)

                # Get geometry
                geometry = row.geometry
                if geometry is None or geometry.is_empty:
                    skipped_count += 1
                    if skipped_count <= 5:
                        print(f"   ⚠️  Skipped {primary_name}: No valid geometry")
                    continue

                # Validate geometry before processing
                try:
                    from shapely.validation import make_valid

                    if not geometry.is_valid:
                        print(f"   🔧 Repairing invalid geometry for {primary_name}")
                        geometry = make_valid(geometry)
                        if geometry.is_empty:
                            skipped_count += 1
                            if skipped_count <= 5:
                                print(
                                    f"   ⚠️  Skipped {primary_name}: Geometry became empty after repair"
                                )
                            continue
                except Exception as repair_error:
                    print(
                        f"   ⚠️  Failed to repair geometry for {primary_name}: {repair_error}"
                    )
                    skipped_count += 1
                    continue

                # Get centroid for coordinates - fix coordinate handling
                if hasattr(geometry, "centroid"):
                    centroid = geometry.centroid
                    try:
                        # Ensure coordinates are proper floats, not tuples
                        lon = float(centroid.x)
                        lat = float(centroid.y)

                        # Validate coordinate ranges
                        if not (-180 <= lon <= 180) or not (-90 <= lat <= 90):
                            print(
                                f"   ⚠️  Invalid centroid coordinates for {primary_name}: ({lon}, {lat})"
                            )
                            skipped_count += 1
                            continue

                        # Create point geometry with validated coordinates
                        point_geom = {
                            "type": "Point",
                            "coordinates": [float(lon), float(lat)],
                        }
                    except (ValueError, TypeError, AttributeError) as centroid_error:
                        print(
                            f"   ⚠️  Failed to extract centroid for {primary_name}: {centroid_error}"
                        )
                        skipped_count += 1
                        continue
                else:
                    skipped_count += 1
                    if skipped_count <= 5:
                        print(f"   ⚠️  Skipped {primary_name}: No centroid available")
                    continue

                # Convert geometry to GeoJSON and fix coordinate structure
                geom_dict = geometry.__geo_interface__

                # Clean up coordinate structure for polygons
                if geom_dict["type"] in ["Polygon", "MultiPolygon"]:

                    def clean_coordinates(coords):
                        """Recursively clean coordinate arrays to ensure they're lists of floats"""
                        if not isinstance(coords, (list, tuple)):
                            return coords

                        # Check if this is a coordinate pair [lon, lat]
                        if len(coords) == 2 and all(
                            isinstance(x, (int, float)) for x in coords
                        ):
                            try:
                                lon, lat = float(coords[0]), float(coords[1])
                                # Validate coordinate ranges
                                if (-180 <= lon <= 180) and (-90 <= lat <= 90):
                                    return [lon, lat]
                                else:
                                    print(
                                        f"Warning: Coordinates out of range: ({lon}, {lat})"
                                    )
                                    return []
                            except (ValueError, TypeError) as e:
                                print(f"Warning: Invalid coordinate values: {e}")
                                return []

                        # Check if this is a coordinate pair with optional elevation [lon, lat, elev]
                        if len(coords) == 3 and all(
                            isinstance(x, (int, float)) for x in coords
                        ):
                            try:
                                lon, lat = float(coords[0]), float(coords[1])
                                # Validate coordinate ranges (ignore elevation)
                                if (-180 <= lon <= 180) and (-90 <= lat <= 90):
                                    return [lon, lat]
                                else:
                                    print(
                                        f"Warning: Coordinates out of range: ({lon}, {lat})"
                                    )
                                    return []
                            except (ValueError, TypeError) as e:
                                print(f"Warning: Invalid coordinate values: {e}")
                                return []

                        # This is a nested structure - recursively process
                        try:
                            cleaned = []
                            for item in coords:
                                if item is not None:
                                    result = clean_coordinates(item)
                                    if result:  # Only add non-empty results
                                        cleaned.append(result)
                            return cleaned
                        except (TypeError, ValueError) as e:
                            print(
                                f"Warning: Skipping invalid coordinate structure: {e}"
                            )
                            return []

                    def remove_duplicate_vertices(coords):
                        """Remove duplicate consecutive vertices from polygon coordinates"""
                        if not isinstance(coords, list):
                            return coords

                        # For polygon rings, remove duplicate consecutive points
                        if (
                            len(coords) > 0
                            and isinstance(coords[0], list)
                            and len(coords[0]) == 2
                        ):
                            # This is a ring of coordinates
                            cleaned_ring = []
                            prev_point = None

                            for point in coords:
                                if prev_point is None or point != prev_point:
                                    cleaned_ring.append(point)
                                    prev_point = point

                            # Ensure polygon is closed (first and last points should be the same)
                            if (
                                len(cleaned_ring) > 2
                                and cleaned_ring[0] != cleaned_ring[-1]
                            ):
                                cleaned_ring.append(cleaned_ring[0])

                            return cleaned_ring
                        else:
                            # Recursively process nested structures
                            return [remove_duplicate_vertices(item) for item in coords]

                    try:
                        # First clean coordinates
                        geom_dict["coordinates"] = clean_coordinates(
                            geom_dict["coordinates"]
                        )

                        # Then remove duplicate vertices
                        geom_dict["coordinates"] = remove_duplicate_vertices(
                            geom_dict["coordinates"]
                        )

                        # Validate that we have valid coordinates after cleaning
                        if not geom_dict["coordinates"]:
                            print(
                                f"Warning: Empty coordinates after cleaning for {primary_name}"
                            )
                            continue

                    except Exception as clean_error:
                        print(
                            f"Warning: Failed to clean coordinates for {primary_name}: {clean_error}"
                        )
                        continue

                # Create address with postal code information
                country_code = clean_country_code(properties.get(country_code_field))
                postal_code = extract_postal_code(properties, postal_code_fields)

                # For countries, we don't have region/locality info
                address = Address(
                    street_address=None,
                    address_locality=None,
                    address_region=None,
                    postal_code=postal_code,
                    country=country_code,
                )

                # Create region with proper coordinate handling
                try:
                    polygon_geom = None

                    # Validate geometry using Shapely before creating GeoJSON objects
                    try:
                        from shapely.geometry import shape
                        from shapely.validation import make_valid

                        # Create Shapely geometry from the cleaned coordinates
                        shapely_geom = shape(geom_dict)

                        # Make the geometry valid if it's not
                        if not shapely_geom.is_valid:
                            print(
                                f"Warning: Invalid geometry for {primary_name}, attempting to fix..."
                            )
                            shapely_geom = make_valid(shapely_geom)

                            # Update geom_dict with the fixed geometry
                            geom_dict = shapely_geom.__geo_interface__

                        # Check if geometry is empty after fixing
                        if shapely_geom.is_empty:
                            print(
                                f"Warning: Empty geometry after fixing for {primary_name}"
                            )
                            continue

                    except Exception as shapely_error:
                        print(
                            f"Warning: Failed to validate geometry for {primary_name}: {shapely_error}"
                        )
                        continue

                    if geom_dict["type"] in ["Polygon"]:
                        try:
                            # Validate coordinate structure before creating polygon
                            coords = geom_dict["coordinates"]
                            if not coords or len(coords) == 0:
                                print(
                                    f"Warning: Empty coordinates for polygon {primary_name}"
                                )
                            else:
                                polygon_geom = GeoJSONPolygon(**geom_dict)
                        except (ValidationError, ValueError, TypeError) as poly_error:
                            print(
                                f"Warning: Invalid polygon geometry for {primary_name}: {poly_error}"
                            )
                            polygon_geom = None
                    elif geom_dict["type"] in ["MultiPolygon"]:
                        try:
                            # Validate coordinate structure before creating polygon
                            coords = geom_dict["coordinates"]
                            if not coords or len(coords) == 0:
                                print(
                                    f"Warning: Empty coordinates for polygon {primary_name}"
                                )
                            else:
                                polygon_geom = GeoJSONMultiPolygon(**geom_dict)
                        except (ValidationError, ValueError, TypeError) as poly_error:
                            print(
                                f"Warning: Invalid polygon geometry for {primary_name}: {poly_error}"
                            )
                            polygon_geom = None
                    # Validate point geometry with enhanced error handling
                    try:
                        # Ensure coordinates are exactly 2 elements [lon, lat]
                        coords = point_geom.get("coordinates", [])
                        if not isinstance(coords, list) or len(coords) != 2:
                            print(
                                f"❌ Invalid coordinates structure for {primary_name}: {coords}"
                            )
                            continue

                        # Ensure each coordinate is a valid float
                        try:
                            lon, lat = float(coords[0]), float(coords[1])
                            if not ((-180 <= lon <= 180) and (-90 <= lat <= 90)):
                                print(
                                    f"❌ Coordinates out of valid range for {primary_name}: ({lon}, {lat})"
                                )
                                continue
                            # Recreate with validated coordinates
                            point_geom["coordinates"] = [lon, lat]
                        except (ValueError, TypeError, IndexError) as coord_err:
                            print(
                                f"❌ Cannot convert coordinates to float for {primary_name}: {coord_err}"
                            )
                            continue

                        point_obj = GeoJSONPoint(**point_geom)
                    except (ValidationError, ValueError, TypeError) as point_error:
                        print(
                            f"❌ Invalid point geometry for {primary_name}: {point_error}"
                        )
                        continue

                    region = Region(
                        name=primary_name,
                        aliases=aliases,
                        level=our_level,  # type: ignore
                        geometry=polygon_geom,
                        coordinates=point_obj,
                        address=address,
                    )
                    docs.append(region)

                except Exception as coord_error:
                    error_count += 1
                    if error_count <= 5:
                        print(
                            f"   ❌ Coordinate error for {primary_name}: {coord_error}"
                        )
                    continue

            except Exception as e:
                error_count += 1
                if error_count <= 5:  # Show first few errors for debugging
                    print(f"   ❌ Error processing record {processed_count}: {e}")
                continue

        print(f"✅ Processed {processed_count} records, created {len(docs)} regions")
        print(f"📊 Summary: {skipped_count} skipped, {error_count} errors")

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

                # Get alternate names from GeoNames
                alt_names = parts[3].split(",") if parts[3] else []
                geonames_aliases = [n.strip() for n in alt_names if n.strip()]

                # Add healthcare-specific aliases
                healthcare_aliases = get_healthcare_aliases(name, our_level)

                # Combine all aliases
                all_aliases = geonames_aliases + healthcare_aliases
                aliases = filter_english_names(all_aliases)

                # Create point geometry with validated coordinate format
                point_geom = {
                    "type": "Point",
                    "coordinates": [float(longitude), float(latitude)],
                }

                # Create address with postal code and locality information
                # Note: GeoNames main data does not contain postal codes
                # Postal codes are stored in separate alternate names file with language code 'post'
                postal_code = None  # No postal code available in main GeoNames data

                # For Indian localities, use the name as address_locality
                address = Address(
                    street_address=None,
                    address_locality=name,
                    address_region=None,  # We'll need to map this from state data
                    postal_code=postal_code,
                    country=clean_country_code("IN"),
                )

                # Create region with validation
                try:
                    # Validate point geometry first with enhanced error handling
                    try:
                        # Ensure coordinates are exactly 2 elements [lon, lat]
                        coords = point_geom.get("coordinates", [])
                        if not isinstance(coords, list) or len(coords) != 2:
                            print(
                                f"❌ Invalid coordinates structure for {name}: {coords}"
                            )
                            continue

                        # Ensure each coordinate is a valid float
                        try:
                            lon, lat = float(coords[0]), float(coords[1])
                            if not ((-180 <= lon <= 180) and (-90 <= lat <= 90)):
                                print(
                                    f"❌ Coordinates out of valid range for {name}: ({lon}, {lat})"
                                )
                                continue
                            # Recreate with validated coordinates
                            point_geom["coordinates"] = [lon, lat]
                        except (ValueError, TypeError, IndexError) as coord_err:
                            print(
                                f"❌ Cannot convert coordinates to float for {name}: {coord_err}"
                            )
                            continue

                        point_obj = GeoJSONPoint(**point_geom)
                    except (ValidationError, ValueError, TypeError) as point_error:
                        print(
                            f"❌ Invalid point coordinates for {name} ({longitude}, {latitude}): {point_error}"
                        )
                        continue

                    region = Region(
                        name=name,
                        aliases=aliases,
                        level=our_level,  # type: ignore
                        geometry=None,  # No polygon for GeoNames points
                        coordinates=point_obj,
                        address=address,
                    )
                    docs.append(region)
                except Exception as validation_error:
                    print(f"❌ Validation error for {name}: {validation_error}")
                    continue

            except Exception as e:
                continue


async def import_all_data(
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

        await import_specifc_data_type(wof_type, our_level, progress_tracker)


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
        await import_all_data(progress_tracker, level_filter)

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

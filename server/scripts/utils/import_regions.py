import asyncio
import json
import re
import time
import zipfile
from pathlib import Path

import geopandas as gpd
import pandas as pd
import requests
from app.base.models import Address
from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.geocoding.documents import Region
from app.geocoding.models import GeoJSONPoint, GeoJSONPolygon
from pydantic import TypeAdapter, ValidationError
from pydantic_extra_types.country import CountryAlpha2
from pymongo.errors import BulkWriteError

# Fixed issues:
# - Filter aliases to English/Latin script only
# - Improved postal code matching
# - Use admin_name1 instead of admin1 for textual region names
# - Enhanced geometry processing with validation
#
# Production-ready features:
# - Robust error handling with retry logic
# - Progress tracking with automatic resume capability
# - Duplicate detection to avoid re-importing existing data
# - Graceful handling of interruptions (Ctrl+C, timeouts)
# - Batch processing with per-batch progress saving
# - Failed batch logging for manual review
#
# Usage:
#   python import_regions.py           # Normal import (resumes automatically)
#   python import_regions.py --reset   # Reset progress and start fresh

# -------------------
# CONFIG
# -------------------
DATA_DIR = Path("./data")
BATCH_SIZE = 100  # adjust as needed
PROGRESS_FILE = DATA_DIR / "import_progress.json"
MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds between retries

# Fixed Natural Earth URLs (CDN)
NE_COUNTRIES_URL = (
    "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries.zip"
)
NE_STATES_URL = (
    "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip"
)
GEONAMES_ALLCITIES_URL = "https://download.geonames.org/export/dump/allCountries.zip"

# -------------------
# HELPERS
# -------------------

alpha2_adapter = TypeAdapter(CountryAlpha2)


def safe_str(value: str | None) -> str | None:
    """Return stripped string, or None if missing/NaN."""
    if isinstance(value, str):
        s = value.strip()
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
        code = alpha2_adapter.validate_python(code.upper())
        return code
    except (ValidationError, Exception):
        return None


def is_english_text(text: str) -> bool:
    """Check if text contains only English/Latin characters and common punctuation."""
    if not text:
        return False
    # Allow Latin characters, spaces, hyphens, apostrophes, periods, commas
    pattern = r"^[a-zA-Z\s\-\'\.,]+$"
    return bool(re.match(pattern, text.strip()))


def filter_english_aliases(aliases_str: str | None) -> list[str]:
    """Filter aliases to only include English/Latin script names."""
    if not isinstance(aliases_str, str) or not aliases_str.strip():
        return []

    aliases = [alias.strip() for alias in aliases_str.split(",") if alias.strip()]
    english_aliases = []

    for alias in aliases:
        # Skip very short aliases (likely codes)
        if len(alias) < 2:
            continue
        # Skip if contains non-Latin characters
        if not is_english_text(alias):
            continue
        # Skip if it's all uppercase (likely a code)
        if alias.isupper() and len(alias) < 5:
            continue
        english_aliases.append(alias)

    # Remove duplicates while preserving order
    seen = set()
    return [
        alias
        for alias in english_aliases
        if not (alias.lower() in seen or seen.add(alias.lower()))
    ]


def safe_geometry_to_geojson(geometry: object) -> dict | None:
    """Safely convert geometry to GeoJSON format with validation."""
    if geometry is None or geometry.is_empty:
        return None

    try:
        geom = geometry.__geo_interface__

        # Handle MultiPolygon by taking the largest polygon
        if geom["type"] == "MultiPolygon":
            if not geom.get("coordinates"):
                return None
            # Find the largest polygon by area (approximate using coordinate count)
            largest = max(geom["coordinates"], key=lambda p: len(p[0]) if p else 0)
            geom = {"type": "Polygon", "coordinates": largest}

        # Handle regular Polygon - validate coordinates
        elif geom["type"] == "Polygon":
            coords = geom.get("coordinates", [])
            if not coords or not coords[0] or len(coords[0]) < 3:
                return None
            # Polygon is already in the right format, just validate and return
            return geom

        # For other geometry types, return as-is (Point, LineString, etc.)
        else:
            return geom

        # Final validation for converted MultiPolygon -> Polygon
        if geom["type"] == "Polygon":
            coords = geom.get("coordinates", [])
            if not coords or not coords[0] or len(coords[0]) < 3:
                return None

        return geom
    except Exception as e:
        print(f"Warning: Failed to convert geometry: {e}")
        return None


class ProgressTracker:
    """Track import progress to enable resumption after interruptions."""

    def __init__(self, progress_file: Path):
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
            "countries_count": 0,
            "states_count": 0,
            "cities_count": 0,
            "last_update": None,
            "countries_batches_completed": 0,
            "states_batches_completed": 0,
            "cities_batches_completed": 0,
        }

    def save_progress(self):
        """Save current progress to file."""
        try:
            self.progress_file.parent.mkdir(parents=True, exist_ok=True)
            self.progress["last_update"] = time.time()
            with open(self.progress_file, "w") as f:
                json.dump(self.progress, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save progress: {e}")

    def mark_completed(self, step: str, count: int = 0):
        """Mark a step as completed."""
        self.progress[f"{step}_completed"] = True
        if count > 0:
            self.progress[f"{step}_count"] = count
        self.save_progress()

    def is_completed(self, step: str) -> bool:
        """Check if a step is completed."""
        return self.progress.get(f"{step}_completed", False)

    def update_batch_progress(self, step: str, batch_num: int):
        """Update batch progress for a step."""
        self.progress[f"{step}_batches_completed"] = batch_num
        self.save_progress()

    def get_batch_progress(self, step: str) -> int:
        """Get number of completed batches for a step."""
        return self.progress.get(f"{step}_batches_completed", 0)


def download_and_extract(url: str, dest_dir: Path) -> Path:
    print(f"Downloading {url} to {dest_dir}")
    dest_dir.mkdir(parents=True, exist_ok=True)
    fname = dest_dir / url.split("/")[-1]
    if not fname.exists():
        r = requests.get(url)
        r.raise_for_status()
        with open(fname, "wb") as f:
            f.write(r.content)

    # Check if it's a zip file and extract if needed
    if fname.suffix.lower() == ".zip":
        with zipfile.ZipFile(fname, "r") as zf:
            zf.extractall(dest_dir)
    elif fname.suffix.lower() == ".txt":
        # Plain text file, no extraction needed
        pass
    else:
        # Try to extract as zip, fallback to treating as plain file
        try:
            with zipfile.ZipFile(fname, "r") as zf:
                zf.extractall(dest_dir)
        except zipfile.BadZipFile:
            print(f"Note: {fname} is not a zip file, treating as plain file")

    return dest_dir


async def check_existing_documents(docs: list) -> list:
    """Filter out documents that already exist in the database."""
    if not docs:
        return []

    # Get all existing region names for this level
    existing_names = set()
    for level in ["country", "state", "locality"]:
        existing_regions = await Region.find(Region.level == level).to_list()
        existing_names.update(region.name.lower() for region in existing_regions)

    # Filter out existing documents
    new_docs = []
    for doc in docs:
        if doc.name.lower() not in existing_names:
            new_docs.append(doc)

    if len(new_docs) < len(docs):
        print(
            f"📋 Filtered {len(docs) - len(new_docs)} existing documents, {len(new_docs)} new documents to insert"
        )

    return new_docs


async def insert_in_batches_robust(
    docs: list,
    batch_size: int = BATCH_SIZE,
    progress_tracker: ProgressTracker | None = None,
    step_name: str = "",
    skip_batches: int = 0,
) -> int:
    """
    Insert documents in batches with robust error handling and progress tracking.
    Returns the number of successfully inserted documents.
    """
    if not docs:
        return 0

    # Filter out existing documents to avoid duplicates
    docs = await check_existing_documents(docs)
    if not docs:
        print("📋 No new documents to insert (all already exist)")
        return 0

    total_batches = (len(docs) + batch_size - 1) // batch_size
    total_inserted = 0

    for i in range(skip_batches * batch_size, len(docs), batch_size):
        batch_num = i // batch_size + 1
        batch = docs[i : i + batch_size]

        retry_count = 0
        while retry_count <= MAX_RETRIES:
            try:
                print(
                    f"🔄 Processing batch {batch_num}/{total_batches} ({len(batch)} docs)..."
                )

                result = await Region.insert_many(batch, ordered=False)
                inserted_count = len(result.inserted_ids)
                total_inserted += inserted_count

                print(
                    f"✅ Batch {batch_num}/{total_batches}: Inserted {inserted_count} documents"
                )

                # Update progress
                if progress_tracker and step_name:
                    progress_tracker.update_batch_progress(step_name, batch_num)

                break  # Success, exit retry loop

            except BulkWriteError as e:
                retry_count += 1

                # Handle partial success in bulk writes
                details = e.details
                inserted_count = details.get("nInserted", 0)
                if inserted_count > 0:
                    total_inserted += inserted_count
                    print(f"⚠️ Partial success: {inserted_count} documents inserted")

                # Show detailed error information
                write_errors = details.get("writeErrors", [])
                if write_errors:
                    print(f"📋 Batch {batch_num} details:")
                    error_summary = {}
                    for error in write_errors[:5]:  # Show first 5 errors
                        error_code = error.get("code", "unknown")
                        error_msg = error.get("errmsg", "unknown error")
                        error_key = f"{error_code}: {error_msg}"
                        error_summary[error_key] = error_summary.get(error_key, 0) + 1

                    for error_type, count in error_summary.items():
                        print(f"   • {error_type} ({count} times)")

                    if len(write_errors) > 5:
                        print(f"   • ... and {len(write_errors) - 5} more errors")

                # Check if all errors are duplicates (code 11000)
                duplicate_errors = [
                    err for err in write_errors if err.get("code") == 11000
                ]
                validation_errors = [
                    err for err in write_errors if err.get("code") == 121
                ]
                other_errors = [
                    err for err in write_errors if err.get("code") not in [11000, 121]
                ]

                # If all errors are duplicates, treat as success
                if len(duplicate_errors) == len(write_errors) and write_errors:
                    print(
                        "📋 All errors are duplicates - this is expected during resume"
                    )
                    if progress_tracker and step_name:
                        progress_tracker.update_batch_progress(step_name, batch_num)
                    break  # Treat as success and continue

                # If we have validation errors, don't retry (they'll fail again)
                if validation_errors:
                    print(
                        f"⚠️ Skipping retry due to {len(validation_errors)} validation errors"
                    )
                    print(
                        "💡 These documents have data quality issues and need manual review"
                    )
                    if progress_tracker and step_name:
                        progress_tracker.update_batch_progress(step_name, batch_num)
                    break  # Don't retry validation failures

                # Only retry for temporary/network errors
                if retry_count <= MAX_RETRIES and not validation_errors:
                    print(
                        f"⏳ Retrying batch {batch_num} in {RETRY_DELAY} seconds... (attempt {retry_count + 1})"
                    )
                    await asyncio.sleep(RETRY_DELAY)
                else:
                    print(
                        f"💥 Failed batch {batch_num} after {MAX_RETRIES + 1} attempts"
                    )
                    # Save failed batch for manual review
                    failed_batch_file = (
                        DATA_DIR / f"failed_batch_{step_name}_{batch_num}.json"
                    )
                    try:
                        failed_batch_file.parent.mkdir(parents=True, exist_ok=True)
                        with open(failed_batch_file, "w") as f:
                            json.dump(
                                {
                                    "error_details": details,
                                    "batch_documents": [doc.dict() for doc in batch],
                                },
                                f,
                                indent=2,
                                default=str,
                            )
                        print(f"📝 Failed batch details saved to {failed_batch_file}")
                    except Exception as save_error:
                        print(f"❌ Could not save failed batch: {save_error}")

            except Exception as e:
                retry_count += 1
                print(
                    f"❌ Error in batch {batch_num} (attempt {retry_count}/{MAX_RETRIES + 1}): {e.__class__.__name__}: {str(e)[:200]}"
                )

                if retry_count <= MAX_RETRIES:
                    print(f"⏳ Retrying in {RETRY_DELAY} seconds...")
                    await asyncio.sleep(RETRY_DELAY)
                else:
                    print(
                        f"💥 Failed to insert batch {batch_num} after {MAX_RETRIES + 1} attempts. Continuing with next batch..."
                    )
                    # Log failed batch details for manual review
                    failed_batch_file = (
                        DATA_DIR / f"failed_batch_{step_name}_{batch_num}.json"
                    )
                    try:
                        failed_batch_file.parent.mkdir(parents=True, exist_ok=True)
                        with open(failed_batch_file, "w") as f:
                            json.dump(
                                [doc.dict() for doc in batch], f, indent=2, default=str
                            )
                        print(f"📝 Failed batch saved to {failed_batch_file}")
                    except Exception as save_error:
                        print(f"❌ Could not save failed batch: {save_error}")

    print(f"📊 Total inserted: {total_inserted}/{len(docs)} documents")
    return total_inserted


# -------------------
# IMPORTERS
# -------------------


async def import_countries_and_states(progress_tracker: ProgressTracker) -> None:
    """Load polygons from Natural Earth (countries + states)."""

    # Check if countries are already imported
    if progress_tracker.is_completed("countries"):
        print("📋 Countries already imported, skipping...")
    else:
        print("🌍 Importing countries...")
        ne_dir = download_and_extract(
            NE_COUNTRIES_URL, DATA_DIR / "naturalearth" / "countries"
        )
        shp = list(ne_dir.glob("*.shp"))[0]
        gdf = gpd.read_file(shp)

        docs = []
        for _, row in gdf.iterrows():
            # Skip if no valid name
            name_val = row.get("NAME")
            if not isinstance(name_val, str) or not name_val.strip():
                continue

            # Process geometry safely
            geom_dict = safe_geometry_to_geojson(row.geometry)
            if geom_dict is None:
                print(f"Warning: Skipping country {row['NAME']} - invalid geometry")
                continue

            # Build aliases list with English names only
            aliases = []
            if row.get("NAME_LONG") and row["NAME_LONG"] != row["NAME"]:
                aliases.append(row["NAME_LONG"])

            try:
                country_name = str(name_val).strip()
                doc = Region(
                    name=country_name,
                    aliases=aliases,
                    level="country",
                    geometry=GeoJSONPolygon(**geom_dict),
                    coordinates=GeoJSONPoint(
                        type="Point",
                        coordinates=[row.geometry.centroid.x, row.geometry.centroid.y],
                    ),
                    address=Address(
                        street_address=None,
                        address_locality=None,
                        address_region=None,
                        postal_code=None,
                        country=clean_country_code(row.get("ISO_A2", None)),
                    ),
                )
                docs.append(doc)
            except Exception as e:
                country_name_safe = str(name_val).strip() if name_val else "Unknown"
                print(f"Error processing country {country_name_safe}: {e}")
                continue

        # Insert countries with resume capability
        skip_batches = progress_tracker.get_batch_progress("countries")
        inserted_count = await insert_in_batches_robust(
            docs,
            progress_tracker=progress_tracker,
            step_name="countries",
            skip_batches=skip_batches,
        )

        if inserted_count > 0:
            progress_tracker.mark_completed("countries", inserted_count)
            print(f"✅ Countries import completed: {inserted_count} countries inserted")
        else:
            print("📋 No new countries to import")

    # Check if states are already imported
    if progress_tracker.is_completed("states"):
        print("📋 States/provinces already imported, skipping...")
    else:
        print("🏛️ Importing states/provinces...")
        ne_dir = download_and_extract(
            NE_STATES_URL, DATA_DIR / "naturalearth" / "states"
        )
        shp = list(ne_dir.glob("*.shp"))[0]
        gdf = gpd.read_file(shp)

        print(f"Available columns: {list(gdf.columns)}")

        def get_region_name(row) -> str | None:
            # Try multiple columns in order of preference for English names
            for col in ["name", "name_en", "gn_name", "woe_name"]:
                val = row.get(col)
                if val and isinstance(val, str) and val.strip():
                    return val.strip()
            return None

        docs = []
        skipped_count = 0

        for _, row in gdf.iterrows():
            region_name = get_region_name(row)
            if not region_name:
                skipped_count += 1
                continue

            # Process geometry safely
            geom_dict = safe_geometry_to_geojson(row.geometry)
            if geom_dict is None:
                print(f"Warning: Skipping state {region_name} - invalid geometry")
                continue

            # Filter aliases to English only
            aliases = filter_english_aliases(row.get("name_alt"))

            try:
                doc = Region(
                    name=region_name,
                    aliases=aliases,
                    level="state",
                    geometry=GeoJSONPolygon(**geom_dict),
                    coordinates=GeoJSONPoint(
                        type="Point",
                        coordinates=[row.geometry.centroid.x, row.geometry.centroid.y],
                    ),
                    address=Address(
                        street_address=None,
                        address_locality=region_name,
                        address_region=safe_str(
                            row.get("adm0_name")
                        ),  # parent country name
                        postal_code=None,  # States don't have postal codes
                        country=clean_country_code(row.get("iso_a2")),
                    ),
                )
                docs.append(doc)
            except Exception as e:
                print(f"Error processing state {region_name}: {e}")
                continue

        # Insert states with resume capability
        skip_batches = progress_tracker.get_batch_progress("states")
        inserted_count = await insert_in_batches_robust(
            docs,
            progress_tracker=progress_tracker,
            step_name="states",
            skip_batches=skip_batches,
        )

        if inserted_count > 0:
            progress_tracker.mark_completed("states", inserted_count)
            print(
                f"✅ States/provinces import completed: {inserted_count} states inserted"
            )
        else:
            print("📋 No new states/provinces to import")

        if skipped_count > 0:
            print(f"⚠️ Skipped {skipped_count} records without valid names")


def load_global_postal_codes() -> dict:
    """
    Load global postal codes from the official GeoNames.org dataset.

    This uses the bulk download from https://download.geonames.org/export/zip/allCountries.zip
    which contains the same postal codes data that's accessible via the web interface at
    https://www.geonames.org/postal-codes/

    Returns multiple lookup dictionaries for improved postal code matching.
    """
    print("Loading global postal codes from official GeoNames.org dataset...")
    # Use the official GeoNames postal codes bulk download
    # This is the authoritative source referenced at https://www.geonames.org/postal-codes/
    postal_dir = download_and_extract(
        "https://download.geonames.org/export/zip/allCountries.zip",
        DATA_DIR / "geonames_postal",
    )
    # Find the postal codes data file
    txt_files = list(postal_dir.glob("*.txt"))
    if not txt_files:
        raise FileNotFoundError(f"No .txt file found in {postal_dir}")

    txtfile = txt_files[0]
    print(f"Using postal codes file: {txtfile}")

    # Verify we have the correct GeoNames postal codes format (12 fields):
    # This is the standard format from https://www.geonames.org/postal-codes/
    # country_code, postal_code, place_name, admin_name1, admin_code1, admin_name2, admin_code2, admin_name3, admin_code3, latitude, longitude, accuracy
    cols = [
        "country_code",  # ISO country code (2 chars, e.g., 'AD')
        "postal_code",  # Actual postal code (up to 20 chars, e.g., 'AD100')
        "place_name",  # Place name (up to 180 chars, e.g., 'Canillo')
        "admin_name1",  # 1st order subdivision name (e.g., state/province)
        "admin_code1",  # 1st order subdivision code (e.g., '02')
        "admin_name2",  # 2nd order subdivision name (e.g., county)
        "admin_code2",  # 2nd order subdivision code
        "admin_name3",  # 3rd order subdivision name (e.g., community)
        "admin_code3",  # 3rd order subdivision code
        "latitude",  # Latitude in decimal degrees (WGS84)
        "longitude",  # Longitude in decimal degrees (WGS84)
        "accuracy",  # Accuracy of coordinates (1=estimated, 6=centroid)
    ]
    # Debug: Check raw file format first
    print("First 3 raw lines from postal codes file:")
    with open(txtfile, encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i >= 3:
                break
            print(f"  Raw line {i}: {line.strip()}")

    # Read and validate the GeoNames postal codes dataset
    try:
        df = pd.read_csv(txtfile, sep="\t", names=cols, dtype=str)
        print(f"Loaded {len(df)} postal code records from GeoNames")

        # Validate we have the expected GeoNames postal codes format
        if len(df.columns) != 12:
            raise ValueError(
                f"Expected 12 columns in GeoNames postal codes format, got {len(df.columns)}"
            )

        # Check that we have some basic data
        if df.empty:
            raise ValueError("Postal codes dataset is empty")

        # Verify sample data looks correct
        sample = df.head(1).iloc[0]
        if not sample.get("country_code") or not sample.get("postal_code"):
            raise ValueError(
                "Invalid GeoNames postal codes format - missing required fields"
            )

        print("✅ GeoNames postal codes dataset validation passed")

    except Exception as e:
        print(f"❌ Error reading GeoNames postal codes dataset: {e}")
        raise

    # Debug: Check first few rows to verify data structure
    print("First 3 rows of GeoNames postal codes data:")
    for i in range(min(3, len(df))):
        row = df.iloc[i]
        print(
            f"  Row {i}: country='{row.get('country_code')}', postal='{row.get('postal_code')}', place='{row.get('place_name')}', admin='{row.get('admin_code1')}'"
        )

    # Create multiple lookup dictionaries for better matching
    lookups = {
        "by_name_and_admin_code": {},
        "by_name_and_admin_name": {},
        "by_name_only": {},
    }

    debug_count = 0
    for _, row in df.iterrows():
        place_name = row.get("place_name")
        postal_code = row.get("postal_code")
        country_code = row.get("country_code")

        if not all([place_name, postal_code, country_code]):
            continue

        place_name = str(place_name).strip()
        postal_code = str(postal_code).strip()
        country_code = str(country_code).strip()

        if not place_name or not postal_code or not country_code:
            continue

        # Debug first few entries
        if debug_count < 3:
            print(
                f"Processing postal entry {debug_count}: country='{country_code}', place='{place_name}', postal='{postal_code}'"
            )
            debug_count += 1

        place_lower = place_name.lower()

        # Lookup by name + admin code
        admin_code1 = row.get("admin_code1")
        if (
            admin_code1
            and str(admin_code1).strip()
            and str(admin_code1).strip() != "nan"
        ):
            admin_code1_str = str(admin_code1).strip()
            key1 = (country_code, place_lower, admin_code1_str)
            lookups["by_name_and_admin_code"][key1] = postal_code

        # Lookup by name + admin name (textual)
        admin_name1 = row.get("admin_name1")
        if (
            admin_name1
            and str(admin_name1).strip()
            and str(admin_name1).strip() != "nan"
        ):
            admin_name1_str = str(admin_name1).strip().lower()
            key2 = (country_code, place_lower, admin_name1_str)
            lookups["by_name_and_admin_name"][key2] = postal_code

        # Lookup by name only (fallback)
        key3 = (country_code, place_lower)
        if key3 not in lookups["by_name_only"]:  # Keep first occurrence
            lookups["by_name_only"][key3] = postal_code

    print(
        f"Loaded postal codes: {len(lookups['by_name_and_admin_code'])} with admin codes, "
        f"{len(lookups['by_name_and_admin_name'])} with admin names, "
        f"{len(lookups['by_name_only'])} by name only"
    )

    # Debug: Show some sample data
    print("Sample postal code entries (by_name_only):")
    sample_keys = list(lookups["by_name_only"].keys())[:5]
    for key in sample_keys:
        print(f"  {key} -> {lookups['by_name_only'][key]}")

    print("Sample postal code entries (by_name_and_admin_code):")
    sample_keys = list(lookups["by_name_and_admin_code"].keys())[:5]
    for key in sample_keys:
        print(f"  {key} -> {lookups['by_name_and_admin_code'][key]}")

    return lookups


def find_postal_code(
    postal_lookups: dict,
    country_code: str,
    place_name: str,
    admin_code: str | None = None,
    admin_name: str | None = None,
    debug: bool = False,
) -> str | None:
    """Find postal code using multiple lookup strategies."""
    if not place_name or not country_code:
        return None

    place_lower = place_name.strip().lower()

    # Try lookup by name + admin code first
    if admin_code:
        key = (country_code, place_lower, admin_code)
        postal = postal_lookups["by_name_and_admin_code"].get(key)
        if postal:
            if debug:
                print(f"Found postal by admin code: {place_name} -> {postal}")
            return postal

    # Try lookup by name + admin name
    if admin_name:
        admin_name_lower = admin_name.strip().lower()
        key = (country_code, place_lower, admin_name_lower)
        postal = postal_lookups["by_name_and_admin_name"].get(key)
        if postal:
            if debug:
                print(f"Found postal by admin name: {place_name} -> {postal}")
            return postal

    # Fallback to name only
    key = (country_code, place_lower)
    postal = postal_lookups["by_name_only"].get(key)
    if postal and debug:
        print(f"Found postal by name only: {place_name} -> {postal}")
    elif debug:
        print(
            f"No postal code found for: {place_name} (country: {country_code}, admin: {admin_code}/{admin_name})"
        )

    return postal


async def import_cities_with_global_postal_codes(
    progress_tracker: ProgressTracker,
) -> None:
    """Load cities from GeoNames cities500 and merge global postal codes."""

    # Check if cities are already imported
    if progress_tracker.is_completed("cities"):
        print("📋 Cities already imported, skipping...")
        return

    print("🏙️ Importing cities with postal codes...")
    gn_dir = download_and_extract(GEONAMES_URL, DATA_DIR / "geonames")
    txtfile = gn_dir / "cities500.txt"

    cols = [
        "geonameid",
        "name",
        "asciiname",
        "alternatenames",
        "latitude",
        "longitude",
        "feature_class",
        "feature_code",
        "country_code",
        "cc2",
        "admin1",
        "admin2",
        "admin3",
        "admin4",
        "population",
        "elevation",
        "dem",
        "timezone",
        "moddate",
    ]
    df = pd.read_csv(txtfile, sep="\t", names=cols, low_memory=False)

    # Load GeoNames admin divisions for textual names
    print("Loading admin division names...")
    admin_dir = download_and_extract(
        "http://download.geonames.org/export/dump/admin1CodesASCII.txt",
        DATA_DIR / "geonames_admin",
    )
    admin_file = admin_dir / "admin1CodesASCII.txt"

    # Parse admin divisions: format is "country_code.admin1_code\tname\tascii_name\tgeonameid"
    admin_names = {}
    with open(admin_file, encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) >= 3:
                code_part = parts[0]  # e.g., "US.CA"
                name = (
                    parts[2] if len(parts) > 2 and parts[2] else parts[1]
                )  # prefer ascii_name
                if "." in code_part:
                    country_code, admin1_code = code_part.split(".", 1)
                    admin_names[(country_code, admin1_code)] = name

    print(f"Loaded {len(admin_names)} admin division names")
    # Debug: Show some sample admin names
    print("Sample admin division entries:")
    sample_keys = list(admin_names.keys())[:5]
    for key in sample_keys:
        print(f"  {key} -> {admin_names[key]}")

    # Load global postal codes from the official GeoNames.org dataset
    # This provides postal codes for ~120 countries as referenced at https://www.geonames.org/postal-codes/
    postal_lookups = load_global_postal_codes()

    docs = []
    skipped_count = 0
    postal_found_count = 0
    debug_count = 0

    print(f"Processing {len(df)} cities...")

    for _, row in df.iterrows():
        name_val = row.get("name")
        if (
            name_val is None
            or (isinstance(name_val, float) and pd.isna(name_val))
            or not name_val
        ):
            skipped_count += 1
            continue

        city_name = str(name_val).strip()
        if not city_name:
            skipped_count += 1
            continue

        # Get textual admin region name instead of code
        admin_region_text = None
        if row.get("admin1") and row.get("country_code"):
            admin_key = (row["country_code"], row["admin1"])
            admin_region_text = admin_names.get(admin_key)

        # Find postal code using improved lookup
        country_code_val = row.get("country_code")
        admin1_val = row.get("admin1")

        # Debug first few cities
        debug_this = debug_count < 5
        if debug_this:
            print(f"\nDebug city #{debug_count + 1}: {city_name}")
            print(f"  Country: {country_code_val}")
            print(f"  Admin1 (code): {admin1_val}")
            print(f"  Admin region (name): {admin_region_text}")
            debug_count += 1

        postal_code = find_postal_code(
            postal_lookups,
            str(country_code_val) if country_code_val else "",
            city_name,
            admin_code=str(admin1_val) if admin1_val else None,
            admin_name=admin_region_text,
            debug=debug_this,
        )

        if postal_code:
            postal_found_count += 1

        # Filter aliases to English only
        aliases = filter_english_aliases(row.get("alternatenames"))

        # Validate coordinates
        try:
            lat_val = row.get("latitude")
            lon_val = row.get("longitude")
            lat = float(lat_val) if lat_val is not None else 0.0
            lon = float(lon_val) if lon_val is not None else 0.0
            if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
                print(f"Warning: Invalid coordinates for {city_name}: {lat}, {lon}")
                continue
        except (ValueError, TypeError):
            print(f"Warning: Invalid coordinates for {city_name}")
            continue

        point = GeoJSONPoint(type="Point", coordinates=[lon, lat])

        try:
            doc = Region(
                name=city_name,
                aliases=aliases,
                level="locality",
                geometry=None,  # Cities don't have polygon geometry
                coordinates=point,
                address=Address(
                    street_address=None,
                    address_locality=city_name,
                    address_region=admin_region_text,  # Use textual name instead of code
                    postal_code=postal_code,
                    country=clean_country_code(
                        str(country_code_val) if country_code_val else None
                    ),
                ),
            )
            docs.append(doc)
        except Exception as e:
            print(f"Error processing city {city_name}: {e}")
            continue

    # Insert cities with resume capability
    skip_batches = progress_tracker.get_batch_progress("cities")
    inserted_count = await insert_in_batches_robust(
        docs,
        progress_tracker=progress_tracker,
        step_name="cities",
        skip_batches=skip_batches,
    )

    if inserted_count > 0:
        progress_tracker.mark_completed("cities", inserted_count)
        print(f"✅ Cities import completed: {inserted_count} cities inserted")
        print(f"📊 Found postal codes for {postal_found_count} cities")
    else:
        print("📋 No new cities to import")

    if skipped_count > 0:
        print(f"⚠️ Skipped {skipped_count} invalid records")


# -------------------
# MAIN
# -------------------


async def main() -> None:
    try:
        await initialize_database(
            str(get_settings(DatabaseSettings).database_url),
            get_settings(DatabaseSettings).default_database_name,
        )

        print("🚀 Starting robust regions import process...")

        # Initialize progress tracker
        progress_tracker = ProgressTracker(PROGRESS_FILE)

        # Print current progress status
        if progress_tracker.progress.get("last_update"):
            last_update = time.ctime(progress_tracker.progress["last_update"])
            print(f"📋 Resuming from previous session (last update: {last_update})")
            print(
                f"   Countries: {'✅' if progress_tracker.is_completed('countries') else '⏳'}"
            )
            print(
                f"   States: {'✅' if progress_tracker.is_completed('states') else '⏳'}"
            )
            print(
                f"   Cities: {'✅' if progress_tracker.is_completed('cities') else '⏳'}"
            )
        else:
            print("📋 Starting fresh import...")

        # Import countries and states with geometry
        await import_countries_and_states(progress_tracker)

        # Import cities with postal codes
        await import_cities_with_global_postal_codes(progress_tracker)

        print("🎉 Regions import completed successfully!")
        print("📊 Final stats:")
        print(f"   Countries: {progress_tracker.progress.get('countries_count', 0)}")
        print(f"   States: {progress_tracker.progress.get('states_count', 0)}")
        print(f"   Cities: {progress_tracker.progress.get('cities_count', 0)}")

    except KeyboardInterrupt:
        print("\n⚠️ Import interrupted by user. Progress has been saved.")
        print("💡 Run the script again to resume from where it left off.")
    except Exception as e:
        print(f"💥 Fatal error during import: {e}")
        print("💡 Check your database connection and try again.")
        print("📝 Progress has been saved - you can resume the import.")
        raise


def reset_progress() -> None:
    """Reset import progress to start fresh."""
    if PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()
        print("🔄 Progress reset. Next run will start fresh.")
    else:
        print("📋 No progress file found.")


if __name__ == "__main__":
    import sys

    # Allow resetting progress via command line argument
    if len(sys.argv) > 1 and sys.argv[1] == "--reset":
        reset_progress()
    else:
        asyncio.run(main())

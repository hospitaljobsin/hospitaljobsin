import asyncio
import re
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

# Fixed issues:
# - Filter aliases to English/Latin script only
# - Improved postal code matching
# - Use admin_name1 instead of admin1 for textual region names
# - Enhanced geometry processing with validation

# -------------------
# CONFIG
# -------------------
DATA_DIR = Path("./data")
BATCH_SIZE = 100  # adjust as needed

# Fixed Natural Earth URLs (CDN)
NE_COUNTRIES_URL = (
    "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries.zip"
)
NE_STATES_URL = (
    "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip"
)
GEONAMES_URL = (
    "https://download.geonames.org/export/dump/cities500.zip"  # cities > 500 pop
)

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


async def insert_in_batches(docs: list, batch_size: int = BATCH_SIZE) -> None:
    for i in range(0, len(docs), batch_size):
        batch = docs[i : i + batch_size]
        try:
            result = await Region.insert_many(batch, ordered=False)
            print(
                f"✅ Inserted batch {i // batch_size + 1}: "
                f"{len(result.inserted_ids)} docs"
            )
        except Exception as e:
            print(f"❌ Error in batch {i // batch_size + 1}: {e}")


# -------------------
# IMPORTERS
# -------------------


async def import_countries_and_states() -> None:
    """Load polygons from Natural Earth (countries + states)."""
    print("Importing countries...")
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
            print(f"Error processing country {country_name}: {e}")
            continue

    await insert_in_batches(docs)
    print(f"Inserted {len(docs)} countries total.")

    print("Importing states/provinces...")
    ne_dir = download_and_extract(NE_STATES_URL, DATA_DIR / "naturalearth" / "states")
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

    await insert_in_batches(docs)
    print(
        f"Inserted {len(docs)} states/provinces total. Skipped {skipped_count} records without names."
    )


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


async def import_cities_with_global_postal_codes() -> None:
    """Load cities from GeoNames cities500 and merge global postal codes."""
    print("Importing cities with postal codes...")
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
        if pd.isna(name_val) or not name_val:
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

    await insert_in_batches(docs)
    print(
        f"Inserted {len(docs)} cities/localities. "
        f"Found postal codes for {postal_found_count} cities. "
        f"Skipped {skipped_count} invalid records."
    )


# -------------------
# MAIN
# -------------------


async def main() -> None:
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    print("Starting regions import process...")

    # Import countries and states with geometry
    await import_countries_and_states()

    # Import cities with postal codes
    await import_cities_with_global_postal_codes()

    print("Regions import completed successfully!")


if __name__ == "__main__":
    asyncio.run(main())

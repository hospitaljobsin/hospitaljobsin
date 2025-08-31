import asyncio
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

# FIXME: geometry is null everywhere
# aliases are in other languages- hindhi, Korean, etc. we don't need that
# postal codes are missing
# address regions are numbers- but they must be text ideally

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


def download_and_extract(url: str, dest_dir: Path):
    print(f"Downloading {url} to {dest_dir}")
    dest_dir.mkdir(parents=True, exist_ok=True)
    fname = dest_dir / url.split("/")[-1]
    if not fname.exists():
        r = requests.get(url)
        r.raise_for_status()
        with open(fname, "wb") as f:
            f.write(r.content)
    # extract
    with zipfile.ZipFile(fname, "r") as zf:
        zf.extractall(dest_dir)
    return dest_dir


async def insert_in_batches(docs, batch_size=BATCH_SIZE):
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


async def import_countries_and_states():
    """Load polygons from Natural Earth (countries + states)."""
    print("Importing countries...")
    ne_dir = download_and_extract(
        NE_COUNTRIES_URL, DATA_DIR / "naturalearth" / "countries"
    )
    shp = list(ne_dir.glob("*.shp"))[0]
    gdf = gpd.read_file(shp)

    docs = []
    for _, row in gdf.iterrows():
        geom = row.geometry.__geo_interface__
        if geom["type"] == "MultiPolygon":
            largest = max(geom["coordinates"], key=lambda p: len(p[0]))
            geom = {"type": "Polygon", "coordinates": largest}

        doc = Region(
            name=row["NAME"],
            code=row.get("ISO_A2", None),
            aliases=[row["NAME_LONG"]] if "NAME_LONG" in row else [],
            level="country",
            geometry=GeoJSONPolygon(**geom),
            coordinates=GeoJSONPoint(
                type="Point",
                coordinates=[row.geometry.centroid.x, row.geometry.centroid.y],
            ),
            address=Address(
                street_address=None,
                address_locality=row["NAME"],
                address_region=None,
                postal_code=None,
                country=clean_country_code(row.get("ISO_A2", None)),
            ),
        )
        docs.append(doc)

    await insert_in_batches(docs)
    print(f"Inserted {len(docs)} countries total.")

    print("Importing states/provinces...")
    ne_dir = download_and_extract(NE_STATES_URL, DATA_DIR / "naturalearth" / "states")
    shp = list(ne_dir.glob("*.shp"))[0]
    gdf = gpd.read_file(shp)

    print(list(gdf.columns))

    def get_region_name(row):
        # Try multiple columns in order of preference
        for col in ["name", "name_en", "gn_name", "woe_name", "name_local"]:
            val = row.get(col)
            if val and isinstance(val, str):
                return val.strip()
        return "Unknown"

    docs = []
    for _, row in gdf.iterrows():
        geom = row.geometry.__geo_interface__
        if geom["type"] == "MultiPolygon":
            largest = max(geom["coordinates"], key=lambda p: len(p[0]))
            geom = {"type": "Polygon", "coordinates": largest}

        region_name = get_region_name(row)
        if region_name == "Unknown":
            print(f"Skipping row with no name: {row['adm1_code']}")
            continue

        doc = Region(
            name=region_name,
            code=row.get("postal", None),
            aliases=[row["name_alt"]] if row.get("name_alt") else [],
            level="state",
            geometry=GeoJSONPolygon(**geom),
            coordinates=GeoJSONPoint(
                type="Point",
                coordinates=[row.geometry.centroid.x, row.geometry.centroid.y],
            ),
            address=Address(
                street_address=None,
                address_locality=region_name,
                address_region=row.get("adm0_name", None),  # parent country name
                postal_code=row.get("postal", None),
                country=clean_country_code(row.get("iso_a2", None)),
            ),
        )
        docs.append(doc)

    await insert_in_batches(docs)
    print(f"Inserted {len(docs)} states/provinces total.")


def load_global_postal_codes():
    """Return a dict mapping (country_code, place_name, admin_code1) -> postal_code"""
    postal_dir = download_and_extract(
        "http://download.geonames.org/export/zip/allCountries.zip",
        DATA_DIR / "geonames_postal",
    )
    txtfile = list(postal_dir.glob("*.txt"))[0]

    cols = [
        "country_code",
        "postal_code",
        "place_name",
        "admin_name1",
        "admin_code1",
        "admin_name2",
        "admin_code2",
        "latitude",
        "longitude",
        "accuracy",
    ]
    df = pd.read_csv(txtfile, sep="\t", names=cols, dtype=str)

    lookup = {}
    for _, row in df.iterrows():
        place_name = row.get("place_name")
        if not isinstance(place_name, str) or not place_name.strip():
            continue  # skip rows with missing place_name
        key = (row["country_code"], place_name.strip().lower(), row["admin_code1"])
        lookup[key] = row["postal_code"]
    return lookup


async def import_cities_with_global_postal_codes():
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

    # Load global postal codes
    postal_lookup = load_global_postal_codes()

    docs = []
    for _, row in df.iterrows():
        if pd.isna(row["name"]):
            continue

        key = (row["country_code"], row["name"].strip().lower(), row["admin1"])
        postal_code = postal_lookup.get(key)

        point = GeoJSONPoint(
            type="Point", coordinates=[row["longitude"], row["latitude"]]
        )

        doc = Region(
            name=row["name"],
            code=postal_code,
            aliases=row["alternatenames"].split(",")
            if isinstance(row["alternatenames"], str)
            else [],
            level="locality",
            geometry=None,
            coordinates=point,
            address=Address(
                street_address=None,
                address_locality=safe_str(row.get("name")),
                address_region=safe_str(row.get("admin1")),  # normalize NaN here
                postal_code=postal_code,
                country=clean_country_code(row.get("country_code", None)),
            ),
        )
        docs.append(doc)

    await insert_in_batches(docs)
    print(f"Inserted {len(docs)} cities/localities with postal codes.")


# -------------------
# MAIN
# -------------------


async def main():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    # await import_countries_and_states()
    await import_cities_with_global_postal_codes()


if __name__ == "__main__":
    asyncio.run(main())

import json
from collections.abc import AsyncGenerator
from pathlib import Path

import pytest
from app.base.models import Address
from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.geocoding.documents import Region
from app.geocoding.models import GeoJSONMultiPolygon, GeoJSONPoint, GeoJSONPolygon
from motor.motor_asyncio import AsyncIOMotorClient


@pytest.fixture(scope="session")
def db_settings() -> DatabaseSettings:
    return get_settings(DatabaseSettings)


@pytest.fixture(autouse=True, scope="session")
async def initialize_test_database(
    db_settings: DatabaseSettings,
) -> AsyncGenerator[None]:
    await initialize_database(
        database_url=str(db_settings.database_url),
        default_database_name=db_settings.test_database_name,
    )

    yield

    client: AsyncIOMotorClient = AsyncIOMotorClient(str(db_settings.database_url))

    database = client.get_default_database(default=db_settings.test_database_name)

    collections = await database.list_collection_names()

    for collection_name in collections:
        if collection_name.startswith("system."):
            continue
        await database.drop_collection(collection_name)

    # Close connection
    client.close()


@pytest.fixture(autouse=True, scope="session")
async def import_region_data(initialize_test_database: AsyncGenerator[None]) -> None:
    """Import region data into the test database."""
    # Load the fixtures data
    fixtures_path = Path(__file__).parent.parent / "fixtures" / "regions.json"

    with fixtures_path.open() as f:
        regions_data = json.load(f)

    # Convert JSON data to Region documents
    regions = []
    for region_data in regions_data:
        # Create Address instance
        address = Address(
            display_name=region_data["address"]["display_name"],
            street_address=region_data["address"].get("street_address"),
            address_locality=region_data["address"].get("address_locality"),
            address_region=region_data["address"].get("address_region"),
            postal_code=region_data["address"].get("postal_code"),
            country=region_data["address"]["country"],
        )

        # Create coordinates (GeoJSONPoint)
        coordinates = GeoJSONPoint(
            type=region_data["coordinates"]["type"],
            coordinates=region_data["coordinates"]["coordinates"],
        )

        # Create geometry if it exists
        geometry = None
        if "geometry" in region_data:
            geom_data = region_data["geometry"]
            if geom_data["type"] == "Polygon":
                geometry = GeoJSONPolygon(
                    type=geom_data["type"], coordinates=geom_data["coordinates"]
                )
            elif geom_data["type"] == "MultiPolygon":
                geometry = GeoJSONMultiPolygon(
                    type=geom_data["type"], coordinates=geom_data["coordinates"]
                )

        # Create Region document
        region = Region(
            name=region_data["name"],
            address=address,
            aliases=region_data.get("aliases", []),
            level=region_data["level"],
            geometry=geometry,
            coordinates=coordinates,
        )

        regions.append(region)

    # Insert all regions into the database
    if regions:
        await Region.insert_many(regions)

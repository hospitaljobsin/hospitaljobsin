import json
from collections.abc import AsyncGenerator
from pathlib import Path

import pytest
from app.base.models import Address
from app.config import DatabaseSettings, get_settings
from app.core.constants import (
    JOB_APPLICANT_EMBEDDING_INDEX_NAME,
    JOB_SEARCH_INDEX_NAME,
    REGION_SEARCH_INDEX_NAME,
)
from app.database import initialize_database
from app.geocoding.documents import Region
from app.geocoding.models import GeoJSONMultiPolygon, GeoJSONPoint, GeoJSONPolygon
from app.jobs.documents import Job, JobApplicant
from pymongo import AsyncMongoClient
from structlog import get_logger

from tests.utils.database import wait_for_search_indexes

logger = get_logger()

# TODO: isolate tests. we don't want test data polluting other tests
# but we need pre-made fixtures like regions to persist always


@pytest.fixture(scope="session")
def db_settings() -> DatabaseSettings:
    return get_settings(DatabaseSettings)


@pytest.fixture(autouse=True, scope="session")
async def initialize_test_database(
    db_settings: DatabaseSettings,
) -> AsyncGenerator[None]:
    client: AsyncMongoClient = AsyncMongoClient(str(db_settings.database_url))

    await initialize_database(
        database_url=str(db_settings.database_url),
        default_database_name=db_settings.test_database_name,
    )

    # Wait for indexes to be ready
    logger.info("Waiting for search indexes to be ready, this may take a moment...")
    print(
        "\n[INFO] Waiting for MongoDB search indexes to be ready, this may take a moment..."
    )

    await wait_for_search_indexes(
        client=client,
        database_name=db_settings.test_database_name,
        collection_names=[
            str(JobApplicant.get_settings().name),
            str(Job.get_settings().name),
            str(Region.get_settings().name),
        ],
        index_names=[
            JOB_APPLICANT_EMBEDDING_INDEX_NAME,
            JOB_SEARCH_INDEX_NAME,
            REGION_SEARCH_INDEX_NAME,
        ],
        wait_time=60,  # wait up to 60 seconds for indexes to be ready
        check_interval=0.5,  # check every half second
    )

    logger.info("Test database initialized and indexes are ready.")
    print("[INFO] MongoDB search indexes are ready. Test database initialized.")

    yield

    client: AsyncMongoClient = AsyncMongoClient(str(db_settings.database_url))

    database = client.get_default_database(default=db_settings.test_database_name)

    collections = await database.list_collection_names()

    logger.info("Dropping collections", collections=collections)

    for collection_name in collections:
        if collection_name.startswith("system."):
            continue
        await database.drop_collection(collection_name)

    # Close connection
    await client.close()


@pytest.fixture(autouse=True, scope="session")
async def import_region_data(
    initialize_test_database: AsyncGenerator[None],
) -> AsyncGenerator[None]:
    """Import region data into the test database."""
    logger.info("Importing region data into the test database...")
    print("\n[INFO] Importing region test data...")
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
        print(f"[INFO] Successfully imported {len(regions)} regions.")
        logger.info("Successfully imported regions", count=len(regions))

    yield None
    await Region.delete_all()

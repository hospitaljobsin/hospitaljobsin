from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from pymongo import AsyncMongoClient


async def setup_test_database() -> None:
    """Seed test database with e2e fixtures."""
    # Initialize Beanie with test database
    settings = get_settings(DatabaseSettings)
    await initialize_database(
        database_url=str(settings.database_url),
        default_database_name=settings.default_database_name,
    )


async def teardown_test_database() -> None:
    """Remove e2e fixtures from test database."""
    # Get connection to database
    settings = get_settings(DatabaseSettings)
    client: AsyncMongoClient = AsyncMongoClient(str(settings.database_url))

    database = client.get_default_database(default=settings.default_database_name)

    collections = await database.list_collection_names()

    for collection_name in collections:
        if collection_name.startswith("system."):
            continue
        await database.drop_collection(collection_name)

    # Close connection
    await client.close()

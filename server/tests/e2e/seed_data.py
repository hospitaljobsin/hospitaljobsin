from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from pymongo import AsyncMongoClient


async def setup_test_database() -> None:
    """Seed test database with e2e fixtures."""
    # Initialize Beanie with test database
    settings = get_settings(DatabaseSettings)
    await initialize_database(
        default_database_name=settings.default_database_name,
        db_client=AsyncMongoClient(
            str(settings.database_url),
            connectTimeoutMS=1000 * 15,
            socketTimeoutMS=1000 * 12,
            serverSelectionTimeoutMS=1000 * 15,
        ),
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

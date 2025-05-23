from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from motor.motor_asyncio import AsyncIOMotorClient


async def setup_test_database() -> None:
    """Seed test database with e2e fixtures."""
    # Initialize Beanie with test database
    settings = get_settings(DatabaseSettings)
    async with initialize_database(
        database_url=str(settings.database_url),
        default_database_name=settings.default_database_name,
    ):
        pass


async def teardown_test_database() -> None:
    """Remove e2e fixtures from test database."""
    # Get connection to database
    settings = get_settings(DatabaseSettings)
    client: AsyncIOMotorClient = AsyncIOMotorClient(str(settings.database_url))

    database = client.get_default_database()

    collections = await database.list_collection_names()

    for collection_name in collections:
        if collection_name.startswith("system."):
            continue
        await database.drop_collection(collection_name)

    # Close connection
    client.close()

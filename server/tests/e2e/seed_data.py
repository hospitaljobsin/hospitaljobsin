from app.accounts.repositories import AccountRepo
from app.config import Settings
from app.database import initialize_database
from motor.motor_asyncio import AsyncIOMotorClient


async def setup_test_database() -> None:
    """Seed test database with e2e fixtures."""
    # Initialize Beanie with test database
    settings = Settings()
    async with initialize_database(
        database_url=str(settings.database_url),
    ):
        # Create test data
        account_repo = AccountRepo()
        await account_repo.create(
            email="tester@example.org",
            full_name="Tester",
            auth_providers=["password"],
            password="Password123!",
        )


async def teardown_test_database() -> None:
    """Remove e2e fixtures from test database."""
    # Get connection to database
    settings = Settings()
    client: AsyncIOMotorClient = AsyncIOMotorClient(str(settings.database_url))

    database = client.get_default_database()

    collections = await database.list_collection_names()

    for collection_name in collections:
        collection = database.get_collection(collection_name)
        await collection.delete_many({})

    # Close connection
    client.close()

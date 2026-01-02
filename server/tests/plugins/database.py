from collections.abc import AsyncGenerator

import pytest
from app.config import DatabaseSettings, RedisSettings, get_settings
from app.core.redis_client import create_redis_client
from app.database import initialize_database
from pymongo import AsyncMongoClient
from redis.asyncio import Redis
from structlog import get_logger

logger = get_logger()


@pytest.fixture(scope="session")
def db_settings() -> DatabaseSettings:
    return get_settings(DatabaseSettings)


@pytest.fixture(scope="session")
def db_name(worker_id: str) -> str:
    """Get a test database name, unique per pytest-xdist worker."""
    return f"testmedicaljobs_{worker_id}"


@pytest.fixture(scope="session")
def redis_settings() -> RedisSettings:
    return get_settings(RedisSettings)


@pytest.fixture(scope="session")
async def redis_client(redis_settings: RedisSettings) -> AsyncGenerator[Redis]:
    """Create a Redis client for testing."""
    client = create_redis_client(redis_settings)
    yield client
    await client.aclose()


@pytest.fixture(scope="module", autouse=True)
async def purge_redis_cache(redis_client: Redis) -> AsyncGenerator[None]:
    """Purge all Redis caches before each test."""
    logger.info("Purging Redis cache before test")
    await redis_client.flushall()
    yield
    # Optionally clean up after test too
    logger.info("Cleaning up Redis cache after test")
    await redis_client.flushall()


@pytest.fixture(scope="session")
async def db_client(db_settings: DatabaseSettings) -> AsyncGenerator[AsyncMongoClient]:
    client = AsyncMongoClient(str(db_settings.database_url))
    yield client
    await client.close()


@pytest.fixture(autouse=True, scope="session")
async def initialize_test_database(
    db_client: AsyncMongoClient, db_name: str
) -> AsyncGenerator[None]:
    await initialize_database(
        default_database_name=db_name,
        db_client=db_client,
    )

    # Wait for indexes to be ready
    logger.info("Waiting for search indexes to be ready, this may take a moment...")
    print(
        "\n[INFO] Waiting for MongoDB search indexes to be ready, this may take a moment..."
    )

    logger.info("Test database initialized and indexes are ready.")
    print("[INFO] MongoDB search indexes are ready. Test database initialized.")

    yield

    database = db_client.get_database(name=db_name)

    collections = await database.list_collection_names()

    logger.info("Dropping collections", collections=collections)

    for collection_name in collections:
        if collection_name.startswith("system."):
            continue
        await database.drop_collection(collection_name)


@pytest.fixture(autouse=True, scope="module")
async def cleanup_database(
    initialize_test_database,
    import_region_data,
    db_settings: DatabaseSettings,
    db_client: AsyncMongoClient,
    db_name: str,
) -> AsyncGenerator[None]:
    yield

    database = db_client.get_database(name=db_name)

    collections = await database.list_collection_names()

    for collection_name in collections:
        if collection_name.startswith("system."):
            continue
        collection = database.get_collection(collection_name)
        logger.info(f"Cleaning up collection: {collection_name}")
        await collection.delete_many({})

import asyncio
import time
from typing import Any

from pymongo import AsyncMongoClient
from pymongo.asynchronous.collection import AsyncCollection
from pymongo.asynchronous.database import AsyncDatabase
from structlog import get_logger

logger = get_logger()


async def get_index_status(
    collection: AsyncCollection, index_name: str
) -> tuple[str, bool]:
    """
    Get the status and queryable state of a MongoDB Atlas Search index.

    Args:
        collection: MongoDB collection
        index_name: Name of the index

    Returns:
        Tuple of (status, queryable) where:
            status: Status of the index (e.g., "READY", "BUILDING", etc.)
            queryable: Boolean indicating if the index is queryable

    """
    try:
        # Use list_search_indexes API directly as it's more reliable with PyMongo async
        cursor = await collection.list_search_indexes()
        indexes = await cursor.to_list(length=None)

        for index in indexes:
            if index.get("name") == index_name:
                status = index.get("status", "READY")
                queryable = index.get("queryable", status == "READY")
                return status, queryable

    except (AttributeError, KeyError, TypeError, ConnectionError, TimeoutError) as e:
        logger.debug("Error checking index status", error=str(e))
        return "ERROR", False

    # If index not found by name, return NOT_FOUND
    return "NOT_FOUND", False


async def _find_matching_indexes(
    client: AsyncMongoClient,
    database_name: str,
    collection_names: list[str],
    index_names: list[str],
) -> dict[str, list[str]]:
    """
    Find all matching search indexes across the specified collections.

    Args:
        client: MongoDB client instance
        database_name: Name of the database
        collection_names: List of collection names to check
        index_names: List of index names to check

    Returns:
        Dictionary mapping collection names to lists of index names
    """
    database = client.get_default_database(default=database_name)
    indexes_to_check = {}

    for collection_name in collection_names:
        indexes_to_check[collection_name] = []
        collection = database.get_collection(collection_name)

        # Get all indexes for this collection
        try:
            cursor = await collection.list_search_indexes()
            async for index in cursor:
                index_name = index.get("name", "")
                if index_name in index_names:
                    indexes_to_check[collection_name].append(index_name)
        except (
            AttributeError,
            KeyError,
            TypeError,
            ConnectionError,
            TimeoutError,
        ) as e:
            logger.debug(
                "Error listing search indexes for collection",
                collection=collection_name,
                error=str(e),
            )

    # Filter out collections with no matching indexes
    return {k: v for k, v in indexes_to_check.items() if v}


async def _check_all_indexes_ready(
    database: AsyncDatabase,
    indexes_to_check: dict[str, list[str]],
) -> tuple[bool, dict[str, list[dict[str, Any]]]]:
    """
    Check if all indexes are ready and queryable.

    Args:
        database: MongoDB database instance
        indexes_to_check: Dictionary mapping collection names to index names

    Returns:
        Tuple containing:
            - Boolean indicating if all indexes are ready and queryable
            - Dictionary of indexes that are not ready or queryable
    """
    all_ready = True
    not_ready_indexes: dict[str, list[dict[str, Any]]] = {}

    for collection_name, collection_index_names in indexes_to_check.items():
        collection = database.get_collection(collection_name)
        not_ready = []

        # Check the status of each index
        for index_name in collection_index_names:
            # Get the status and queryable state of the index
            status, queryable = await get_index_status(collection, index_name)

            if not (status == "READY" and queryable):
                all_ready = False
                logger.debug(
                    "Index not ready or not queryable yet",
                    index_name=index_name,
                    collection=collection_name,
                    status=status,
                    queryable=queryable,
                )
                not_ready.append(
                    {"name": index_name, "status": status, "queryable": queryable}
                )

        if not_ready:
            not_ready_indexes[collection_name] = not_ready

    return all_ready, not_ready_indexes


async def wait_for_search_indexes(
    client: AsyncMongoClient,
    database_name: str,
    collection_names: list[str],
    index_names: list[str],
    wait_time: int = 60,
    check_interval: float = 0.5,
) -> None:
    """
    Wait for MongoDB search indexes to be ready and queryable.

    Args:
        client: MongoDB client instance
        database_name: Name of the database
        collection_names: List of collection names to check
        index_names: List of index names to check
        wait_time: Maximum time to wait in seconds
        check_interval: Time between checks in seconds

    Raises:
        TimeoutError: If indexes are not ready and queryable within the timeout period
    """
    database = client.get_default_database(default=database_name)
    start_time = time.time()

    # Find matching indexes
    indexes_to_check = await _find_matching_indexes(
        client, database_name, collection_names, index_names
    )

    if not indexes_to_check:
        logger.warning("No matching indexes found to wait for")
        return

    logger.info(
        "Waiting for search indexes to be ready and queryable",
        indexes=indexes_to_check,
    )

    index_count = sum(len(indexes) for indexes in indexes_to_check.values())
    logger.info("Checking status of MongoDB search indexes", count=index_count)

    # Wait for indexes to be ready and queryable
    while time.time() - start_time < wait_time:
        all_ready, not_ready_indexes = await _check_all_indexes_ready(
            database, indexes_to_check
        )

        if all_ready:
            logger.info("All search indexes are ready and queryable")
            return

        # Wait before checking again
        await asyncio.sleep(check_interval)

    # If we get here, we've timed out
    all_ready, remaining_indexes = await _check_all_indexes_ready(
        database, indexes_to_check
    )

    if remaining_indexes:
        error_message = f"Indexes not ready or not queryable within {wait_time} seconds: {remaining_indexes}"
        logger.error(error_message)
        raise TimeoutError(error_message)

#!/usr/bin/env python3
"""
Clear all job clustering cache entries from Redis.

This is useful when debugging clustering issues or after fixing clustering logic.

Usage:
    cd server
    uv run python scripts/utils/clear_cluster_cache.py
"""

import asyncio
import logging

from app.config import RedisSettings, get_settings
from redis.asyncio import Redis

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def clear_cluster_cache() -> None:
    """Clear all job clustering cache entries from Redis."""
    redis_settings = get_settings(RedisSettings)

    # Initialize Redis connection
    redis_client = Redis(
        host=redis_settings.redis_host,
        port=redis_settings.redis_port,
        username=redis_settings.redis_username,
        password=redis_settings.redis_password,
        decode_responses=True,
    )

    logger.info("Connecting to Redis...")

    try:
        # Find all job cluster cache keys (pattern: job_clusters:v*:*)
        pattern = "job_clusters:v*:*"
        logger.info("Searching for cache keys matching pattern: %s", pattern)

        keys = [key async for key in redis_client.scan_iter(match=pattern, count=100)]

        if not keys:
            logger.info("No cluster cache keys found. Cache is already clear.")
            return

        logger.info("Found %d cluster cache keys to delete", len(keys))

        # Delete all cache keys
        deleted = await redis_client.delete(*keys)
        logger.info("Successfully deleted %d cache entries", deleted)

    finally:
        await redis_client.aclose()
        logger.info("Redis connection closed")


if __name__ == "__main__":
    asyncio.run(clear_cluster_cache())

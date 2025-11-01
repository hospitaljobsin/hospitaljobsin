#!/usr/bin/env python3
"""
Migration script to backfill H3 indexes for existing jobs.

This script finds all jobs that have geo coordinates but no h3_indexes,
computes H3 indexes at resolutions [1, 3, 5, 7, 9, 10, 11], and updates
the documents in bulk batches of 1000.

Usage:
    cd server
    uv run python scripts/backfill_h3_indexes.py
"""

import asyncio
import logging

import h3
from app.base.models import GeoObject
from app.config import DatabaseSettings, get_settings
from app.jobs.documents import Job
from beanie import init_beanie
from pymongo import AsyncMongoClient, UpdateOne
from tqdm import tqdm

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def compute_h3_indexes(geo: GeoObject | None) -> dict[str, str] | None:
    """
    Compute H3 indexes at multiple resolutions for a job location.

    Args:
        geo: GeoObject containing coordinates [lng, lat]

    Returns:
        Dictionary mapping resolution (as string) to H3 index,
        or None if geo is None or invalid

    """
    if not geo or not geo.coordinates:
        return None

    lng, lat = geo.coordinates

    # Include all H3 resolutions (0-15) to prevent future indexing issues
    resolutions = list(
        range(16)
    )  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    h3_indexes = {}

    for resolution in resolutions:
        h3_index = h3.latlng_to_cell(lat, lng, resolution)
        h3_indexes[str(resolution)] = h3_index

    return h3_indexes


async def backfill_h3_indexes() -> None:
    """Backfill H3 indexes for existing jobs with geo coordinates.

    Find jobs with geo but no h3_indexes, compute indexes,
    and update in bulk batches.
    """
    settings = get_settings(DatabaseSettings)

    # Initialize MongoDB connection
    client = AsyncMongoClient(str(settings.database_url))

    # Initialize Beanie
    await init_beanie(
        database=client.get_database(settings.default_database_name),
        document_models=[Job],
    )

    logger.info("Finding jobs with geo coordinates but no h3_indexes...")

    # Find all jobs that have geo but no h3_indexes
    query = {
        "geo": {"$ne": None},
        "$or": [{"h3_indexes": {"$exists": False}}, {"h3_indexes": None}],
    }

    total_count = await Job.find(query).count()
    logger.info("Found %d jobs to process", total_count)

    if total_count == 0:
        logger.info("No jobs to backfill. Exiting.")
        return

    batch_size = 1000
    batch_operations: list[UpdateOne] = []

    # Process jobs with progress bar
    with tqdm(total=total_count, desc="Backfilling H3 indexes") as pbar:
        async for job in Job.find(query):
            if job.geo and job.geo.coordinates:
                # Compute H3 indexes
                h3_indexes = compute_h3_indexes(job.geo)

                # Create bulk update operation
                operation = UpdateOne(
                    {"_id": job.id}, {"$set": {"h3_indexes": h3_indexes}}
                )
                batch_operations.append(operation)

                # Execute batch when size reaches limit
                if len(batch_operations) >= batch_size:
                    await Job.get_pymongo_collection().bulk_write(
                        batch_operations, ordered=False
                    )
                    batch_operations = []

                pbar.update(1)

        # Execute remaining operations
        if batch_operations:
            await Job.get_pymongo_collection().bulk_write(
                batch_operations, ordered=False
            )

    logger.info("Successfully backfilled H3 indexes for %d jobs", total_count)

    # Verify results
    logger.info("Verifying results...")
    updated_count = await Job.find({"h3_indexes": {"$ne": None}}).count()
    logger.info("Total jobs with h3_indexes: %d", updated_count)

    # Sample verification
    logger.info("Sample verification (first 3 jobs):")
    async for job in Job.find({"h3_indexes": {"$ne": None}}).limit(3):
        logger.info("  Job %s:", job.id)
        logger.info("    Geo: %s", job.geo.coordinates if job.geo else "None")
        logger.info("    H3 indexes: %s", job.h3_indexes)

    # Close connection
    client.close()


if __name__ == "__main__":
    asyncio.run(backfill_h3_indexes())

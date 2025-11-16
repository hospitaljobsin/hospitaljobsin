import asyncio
import json

import httpx
from app.config import (
    BingIndexNowSettings,
    DatabaseSettings,
    EnvironmentSettings,
    FrontendSettings,
    get_settings,
)
from app.container import create_container
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.logger import setup_logging
from aws_lambda_powertools.utilities.typing import LambdaContext
from pymongo import AsyncMongoClient
from structlog import get_logger

env_settings = get_settings(EnvironmentSettings)

initialize_instrumentation(settings=env_settings)

setup_logging(human_readable=env_settings.debug)

container = create_container()

logger = get_logger(__name__)

INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
REPO_PAGE_SIZE = 100  # Job repo pagination limit
INDEXNOW_BATCH_SIZE = 10000  # IndexNow supports up to 10,000 URLs per request


async def initialize_handler() -> None:
    database_settings = get_settings(DatabaseSettings)
    await initialize_database(
        db_client=AsyncMongoClient(
            str(database_settings.database_url),
            connectTimeoutMS=1000 * 15,
            socketTimeoutMS=1000 * 12,
            serverSelectionTimeoutMS=1000 * 15,
        ),
        default_database_name=database_settings.default_database_name,
    )


loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

loop.run_until_complete(initialize_handler())


def lambda_handler(event: dict, context: LambdaContext) -> str:
    """Lambda handler for notifying Bing IndexNow API of job postings."""
    return loop.run_until_complete(notify_bing_indexnow())


async def notify_bing_indexnow() -> str:
    """Notify Bing IndexNow API about active job postings."""
    async with container.context() as ctx:
        job_repo = await ctx.resolve(JobRepo)

    frontend_settings = get_settings(FrontendSettings)
    indexing_settings = get_settings(BingIndexNowSettings)

    total_notified = 0
    total_failed = 0

    async with httpx.AsyncClient() as client:
        accumulated_jobs = []
        accumulated_urls = []
        cursor = None

        while True:
            jobs_result = await job_repo.get_for_bing_indexing(
                first=REPO_PAGE_SIZE, after=cursor
            )

            if not jobs_result.entities:
                break

            accumulated_jobs.extend(jobs_result.entities)
            accumulated_urls.extend(
                await _build_url_list(jobs_result.entities, frontend_settings)
            )

            if (
                len(accumulated_urls) >= INDEXNOW_BATCH_SIZE
                or not jobs_result.page_info.has_next_page
            ):
                payload = {
                    "host": frontend_settings.base_domain,
                    "key": indexing_settings.bing_indexnow_api_key,
                    "urlList": accumulated_urls,
                }

                try:
                    response = await client.post(
                        INDEXNOW_ENDPOINT,
                        headers={"Content-Type": "application/json; charset=utf-8"},
                        json=payload,
                    )
                    response.raise_for_status()
                    job_ids = [job.id for job in accumulated_jobs]
                    await job_repo.mark_as_notified_on_bing_index(job_ids)
                    total_notified += len(accumulated_jobs)
                except httpx.HTTPStatusError as e:
                    total_failed += len(accumulated_jobs)
                    logger.error(f"HTTP error notifying Bing IndexNow: {e}")
                except Exception as e:
                    total_failed += len(accumulated_jobs)
                    logger.exception(f"Failed to notify Bing IndexNow about batch: {e}")

                accumulated_jobs = []
                accumulated_urls = []

            if not jobs_result.page_info.has_next_page:
                break

            cursor = str(jobs_result.page_info.end_cursor)

    logger.info(
        f"Completed Bing IndexNow notification: {total_notified} notified, {total_failed} failed"
    )

    return json.dumps(
        {"status": "ok", "notified": total_notified, "failed": total_failed}
    )


async def _build_url_list(jobs: list[Job], frontend_settings) -> list[str]:
    """Build a list of job URLs for IndexNow submission."""
    url_list = []
    for job in jobs:
        await job.fetch_link(Job.organization)
        job_url = f"{frontend_settings.seeker_portal_base_url}/organizations/{job.organization.slug}/jobs/{job.slug}"
        url_list.append(job_url)
    return url_list


if __name__ == "__main__":
    loop.run_until_complete(notify_bing_indexnow())

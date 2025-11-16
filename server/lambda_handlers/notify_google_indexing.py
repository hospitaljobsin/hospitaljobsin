import asyncio
import json

import httpx
from app.config import (
    DatabaseSettings,
    EnvironmentSettings,
    FrontendSettings,
    GoogleIndexingSettings,
    get_settings,
)
from app.container import create_container
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.logger import setup_logging
from aws_lambda_powertools.utilities.typing import LambdaContext
from google.auth.transport.requests import Request
from google.oauth2 import service_account
from pymongo import AsyncMongoClient
from structlog import get_logger

env_settings = get_settings(EnvironmentSettings)

initialize_instrumentation(settings=env_settings)

setup_logging(human_readable=env_settings.debug)

container = create_container()

logger = get_logger(__name__)

SCOPES = ["https://www.googleapis.com/auth/indexing"]
BATCH_ENDPOINT = "https://indexing.googleapis.com/batch"
BATCH_SIZE = 50

DAILY_QUOTA = 200
RUNS_PER_DAY = 4
REQUEST_QUOTA_PER_RUN = DAILY_QUOTA // RUNS_PER_DAY  # 50 requests per run


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
    """Lambda handler for notifying Google Indexing API of job postings."""
    return loop.run_until_complete(notify_google_indexing())


async def notify_google_indexing() -> str:
    """Notify Google Indexing API about active job postings within daily quota."""
    async with container.context() as ctx:
        job_repo = await ctx.resolve(JobRepo)

    frontend_settings = get_settings(FrontendSettings)
    indexing_settings = get_settings(GoogleIndexingSettings)
    service_account_info = json.loads(
        indexing_settings.google_indexing_service_account_json
    )
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info, scopes=SCOPES
    )
    credentials.refresh(Request())

    total_notified = 0
    total_failed = 0
    quota_exceeded = False

    async with httpx.AsyncClient() as client:
        jobs_result = await job_repo.get_for_google_indexing(first=BATCH_SIZE)

        while jobs_result.entities and total_notified < REQUEST_QUOTA_PER_RUN:
            batch_body = await _build_batch_request(
                jobs_result.entities, frontend_settings, credentials.token
            )
            try:
                response = await client.post(
                    BATCH_ENDPOINT,
                    headers={
                        "Content-Type": "multipart/mixed; boundary=batch_boundary"
                    },
                    content=batch_body,
                )
                response.raise_for_status()
                job_ids = [job.id for job in jobs_result.entities]
                await job_repo.mark_as_notified_on_google_index(job_ids)
                total_notified += len(jobs_result.entities)
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:
                    quota_exceeded = True
                    logger.warning(f"Google Indexing API quota exceeded: {e}")
                    break
                total_failed += len(jobs_result.entities)
                logger.error(f"HTTP error notifying Google: {e}")
            except Exception as e:
                total_failed += len(jobs_result.entities)
                logger.exception(f"Failed to notify Google about batch: {e}")

            if (
                not jobs_result.page_info.has_next_page
                or total_notified >= REQUEST_QUOTA_PER_RUN
            ):
                break

            jobs_result = await job_repo.get_for_google_indexing(
                first=BATCH_SIZE, after=str(jobs_result.page_info.end_cursor)
            )

    status = "quota_exceeded" if quota_exceeded else "ok"
    logger.info(
        f"Completed Google Indexing notification: {total_notified} notified, {total_failed} failed, status={status}"
    )

    return json.dumps(
        {"status": status, "notified": total_notified, "failed": total_failed}
    )


async def _build_batch_request(jobs: list[Job], frontend_settings, token: str) -> str:
    """Build a multipart/mixed batch request body."""
    parts = []
    for job in jobs:
        await job.fetch_link(Job.organization)
        job_url = f"{frontend_settings.seeker_portal_base_url}/organizations/{job.organization.slug}/jobs/{job.slug}"
        body = json.dumps({"url": job_url, "type": "URL_UPDATED"})
        part = (
            f"--batch_boundary\r\n"
            f"Content-Type: application/http\r\n\r\n"
            f"POST /v3/urlNotifications:publish\r\n"
            f"Authorization: Bearer {token}\r\n"
            f"Content-Type: application/json\r\n\r\n"
            f"{body}\r\n"
        )
        parts.append(part)
    return "".join(parts) + "--batch_boundary--\r\n"


if __name__ == "__main__":
    loop.run_until_complete(notify_google_indexing())

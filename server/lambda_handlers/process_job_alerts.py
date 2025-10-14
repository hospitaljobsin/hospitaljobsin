import asyncio
import json
from collections.abc import Sequence

from app.config import (
    DatabaseSettings,
    EnvironmentSettings,
    JobAlertsSettings,
    get_settings,
)
from app.container import create_container
from app.core.constants import JobAlertFrequency
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.job_alerts.documents import JobAlert
from app.job_alerts.repositories import JobAlertRepo
from app.logger import setup_logging
from aws_lambda_powertools.utilities.parser import envelopes, event_parser
from aws_lambda_powertools.utilities.typing import LambdaContext
from pydantic import BaseModel
from pymongo import AsyncMongoClient
from structlog import get_logger
from types_aiobotocore_sqs import SQSClient

env_settings = get_settings(EnvironmentSettings)

initialize_instrumentation(settings=env_settings)

# set up logging
setup_logging(
    human_readable=env_settings.debug,
)

# initialize container outside lambda handler to avoid re-initialization on each invocation
container = create_container()

logger = get_logger(__name__)

BATCH_SIZE = 100  # cannot exceed pagination limit of 100

SQS_BATCH_LIMIT = 10  # SQS limit


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


# 🟢 Create a persistent event loop and use it both for init and handler
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

# ✅ run once per cold start
loop.run_until_complete(initialize_handler())


class ProcessJobAlertsInput(BaseModel):
    frequency: JobAlertFrequency


@event_parser(model=ProcessJobAlertsInput, envelope=envelopes.EventBridgeEnvelope)
def lambda_handler(data: ProcessJobAlertsInput, context: LambdaContext) -> str:
    """Lambda handler for the daily WhatsApp message generation cron job."""
    return loop.run_until_complete(process_job_alerts(frequency=data.frequency))


async def process_job_alerts(frequency: JobAlertFrequency) -> str:
    """Process job alerts and push them into the SQS queue."""
    async with container.context() as ctx:
        alert_settings = await ctx.resolve(JobAlertsSettings)
        job_alert_repo = await ctx.resolve(JobAlertRepo)
        sqs_client = await ctx.resolve(SQSClient)

    after: str | None = None
    has_next_page = True
    while has_next_page:
        job_alerts = await job_alert_repo.get_all_by_frequency(
            frequency=frequency, after=after, first=BATCH_SIZE
        )
        await process_alert_batch(
            job_alerts.entities,
            sqs_client=sqs_client,
            queue_url=alert_settings.sqs_job_alerts_queue_url,
        )
        has_next_page = job_alerts.page_info.has_next_page
        after = str(job_alerts.page_info.end_cursor)
    return json.dumps({"status": "ok"})


async def process_alert_batch(
    alerts: Sequence[JobAlert], sqs_client: SQSClient, queue_url: str
) -> None:
    entries = []
    for alert in alerts:
        entries.append(
            {
                "Id": str(alert.id),
                "MessageBody": str(
                    {
                        "alert_id": str(alert.id),
                    }
                ),
            }
        )
        # Send in batches of 10 (SQS limit)
        if len(entries) == SQS_BATCH_LIMIT:
            await sqs_client.send_message_batch(QueueUrl=queue_url, Entries=entries)
            entries = []
    if entries:
        await sqs_client.send_message_batch(QueueUrl=queue_url, Entries=entries)
    logger.info(f"Processed {len(alerts)} alerts")


if __name__ == "__main__":
    loop.run_until_complete(process_job_alerts("daily"))

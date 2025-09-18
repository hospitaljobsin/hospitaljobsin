import asyncio
import json

from app.config import AppSettings, DatabaseSettings, EnvironmentSettings, get_settings
from app.container import create_container
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.job_alerts.repositories import JobAlertRepo
from app.logger import setup_logging
from aws_lambda_powertools.utilities.data_classes import SQSEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from bson import ObjectId
from pydantic import BaseModel
from structlog import get_logger

settings = get_settings(AppSettings)

env_settings = get_settings(EnvironmentSettings)

initialize_instrumentation(settings=env_settings)

# set up logging
setup_logging(
    human_readable=env_settings.debug,
)

# initialize container outside lambda handler to avoid re-initialization on each invocation
container = create_container()

logger = get_logger(__name__)


async def initialize_handler() -> None:
    database_settings = get_settings(DatabaseSettings)
    await initialize_database(
        database_url=str(database_settings.database_url),
        default_database_name=database_settings.default_database_name,
    )


# 🟢 Create a persistent event loop and use it both for init and handler
loop = asyncio.get_event_loop()

# ✅ run once per cold start
loop.run_until_complete(initialize_handler())


class JobAlertEventBody(BaseModel):
    alert_id: str


@event_source(data_class=SQSEvent)
def lambda_handler(event: SQSEvent, context: LambdaContext) -> str:
    """Lambda handler for the job alert event."""
    processing_requests: list[tuple[JobAlertEventBody, str]] = [
        (
            JobAlertEventBody(**record.json_body),
            record.message_id,
        )
        for record in event.records
    ]
    return loop.run_until_complete(send_job_alerts(processing_requests))


async def send_job_alerts(
    event: list[tuple[JobAlertEventBody, str]],
) -> str:
    """Process the job applicant analysis event."""
    batch_item_failures = []
    sqs_batch_response = {}

    async with container.context() as ctx:
        job_alert_repo = await ctx.resolve(JobAlertRepo)

    for record, message_id in event:
        job_alert = await job_alert_repo.get_by_id(
            job_alert_id=ObjectId(record.alert_id),
            fetch_links=True,
        )
        if job_alert is None:
            logger.warning(
                "Job alert not found while trying to send job alert",
                extra={"job_alert_id": record.alert_id},
            )
            continue

        # TODO: process each job alert here.
        # send job alerts via email/ whatsapp (later), then mark those jobs somehow.
        # we shouldn't be sending redundant alerts for same jobs again and again.

        # job_applicant = await job_applicant_analysis_service.analyse_job_applicant(
        #     job=job_applicant.job,
        #     job_application=job_applicant,
        # )

        # if job_applicant.analysis_status == "failed":
        #     batch_item_failures.append(
        #         {
        #             "itemIdentifier": message_id,
        #         }
        #     )
        pass
    sqs_batch_response["batchItemFailures"] = batch_item_failures
    return json.dumps(sqs_batch_response)

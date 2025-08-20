import asyncio
import json

from aws_lambda_powertools.utilities.data_classes import SQSEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from bson import ObjectId
from structlog import get_logger

from app.config import AppSettings, DatabaseSettings, EnvironmentSettings, get_settings
from app.container import create_container
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.jobs.models import JobApplicantAnalysisEventBody
from app.jobs.repositories import JobApplicantRepo
from app.jobs.services import JobApplicantAnalysisService
from app.logger import setup_logging

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


@event_source(data_class=SQSEvent)
def lambda_handler(event: SQSEvent, context: LambdaContext) -> str:
    """Lambda handler for the job applicant analysis event."""
    processing_requests: list[tuple[JobApplicantAnalysisEventBody, str]] = [
        (
            JobApplicantAnalysisEventBody(**record.json_body),
            record.message_id,
        )
        for record in event.records
    ]
    return loop.run_until_complete(
        process_job_applicant_analysis_event(processing_requests)
    )


async def process_job_applicant_analysis_event(
    event: list[tuple[JobApplicantAnalysisEventBody, str]],
) -> str:
    """Process the job applicant analysis event."""
    batch_item_failures = []
    sqs_batch_response = {}
    async with container.context() as ctx:
        job_applicant_analysis_service = await ctx.resolve(JobApplicantAnalysisService)
        job_applicant_repo = await ctx.resolve(JobApplicantRepo)

    for record, message_id in event:
        job_applicant = await job_applicant_repo.get(
            account_id=ObjectId(record.account_id),
            job_id=ObjectId(record.job_id),
        )

        if job_applicant is None:
            logger.warning(
                "Job applicant not found while analysing job applicant",
                extra={"account_id": record.account_id, "job_id": record.job_id},
            )
            continue

        job_applicant = await job_applicant_analysis_service.analyse_job_applicant(
            job=job_applicant.job,
            job_application=job_applicant,
        )

        if job_applicant.analysis_status == "failed":
            batch_item_failures.append(
                {
                    "itemIdentifier": message_id,
                }
            )
    sqs_batch_response["batchItemFailures"] = batch_item_failures
    return json.dumps(sqs_batch_response)

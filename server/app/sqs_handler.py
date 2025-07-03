import asyncio

from aws_lambda_powertools.utilities.data_classes import SQSEvent, event_source
from aws_lambda_powertools.utilities.parser import envelopes, event_parser
from aws_lambda_powertools.utilities.typing import LambdaContext
from bson import ObjectId
from structlog import get_logger

from app.config import AppSettings, get_settings
from app.container import create_container
from app.core.instrumentation import initialize_instrumentation
from app.jobs.models import JobApplicantAnalysisEventBody
from app.jobs.repositories import JobApplicantRepo
from app.jobs.services import JobApplicantAnalysisService
from app.logger import setup_logging

settings = get_settings(AppSettings)

initialize_instrumentation(settings=settings)

# set up logging
setup_logging(
    human_readable=settings.debug,
)

# initialize container outside lambda handler to avoid re-initialization on each invocation
container = create_container()

logger = get_logger(__name__)


@event_source(data_class=SQSEvent)
@event_parser(model=JobApplicantAnalysisEventBody, envelope=envelopes.SqsEnvelope)
def lambda_handler(
    event: list[JobApplicantAnalysisEventBody], context: LambdaContext
) -> dict:
    """Lambda handler for the job applicant analysis event."""
    return asyncio.run(process_job_applicant_analysis_event(event))


async def process_job_applicant_analysis_event(
    event: list[JobApplicantAnalysisEventBody],
) -> dict:
    """Process the job applicant analysis event."""
    async with container.context() as ctx:
        job_applicant_analysis_service = await ctx.resolve(JobApplicantAnalysisService)
        job_applicant_repo = await ctx.resolve(JobApplicantRepo)

    for record in event:
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

        await job_applicant_analysis_service.analyse_job_applicant(
            job=job_applicant.job,
            job_application=job_applicant,
        )

    return {"status": "ok"}

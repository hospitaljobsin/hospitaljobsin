from aws_lambda_powertools.utilities.data_classes import SQSEvent, event_source
from aws_lambda_powertools.utilities.parser import envelopes, event_parser
from aws_lambda_powertools.utilities.typing import LambdaContext
from bson import ObjectId
from pydantic import BaseModel

from app.container import create_container
from app.jobs.repositories import JobApplicantRepo
from app.jobs.services import JobApplicantAnalysisService

container = create_container()


class JobApplicantAnalysisEventBody(BaseModel):
    account_id: str
    job_id: str


@event_source(data_class=SQSEvent)
@event_parser(model=JobApplicantAnalysisEventBody, envelope=envelopes.SqsEnvelope)
async def lambda_handler(
    event: list[JobApplicantAnalysisEventBody], context: LambdaContext
) -> dict:
    """Lambda handler for the job applicant analysis event."""
    async with container.context() as ctx:
        job_applicant_analysis_service = await ctx.resolve(JobApplicantAnalysisService)
        job_applicant_repo = await ctx.resolve(JobApplicantRepo)

    for record in event:
        job_applicant = await job_applicant_repo.get(
            account_id=ObjectId(record.account_id),
            job_id=ObjectId(record.job_id),
        )

        if job_applicant is None:
            # TODO: throw error here???
            continue

        await job_applicant_analysis_service.analyse_job_applicant(
            job=job_applicant.job,
            job_application=job_applicant,
        )

    return {"status": "ok"}

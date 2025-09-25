import asyncio
import json
from datetime import UTC, datetime, timedelta
from urllib.parse import urlencode

import phonenumbers
from app.config import (
    DatabaseSettings,
    EnvironmentSettings,
    FrontendSettings,
    get_settings,
)
from app.container import create_container
from app.core.emails import BaseEmailSender
from app.core.instrumentation import initialize_instrumentation
from app.core.whatsapp_client import WhatsappClient
from app.database import initialize_database
from app.job_alerts.models import AlertFilters
from app.job_alerts.repositories import JobAlertRepo
from app.jobs.repositories import (
    JobRepo,
    JobSearchSortBy,
    JobType,
    JobWorkMode,
)
from app.logger import setup_logging
from aws_lambda_powertools.utilities.data_classes import SQSEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from bson import ObjectId
from pydantic import BaseModel
from structlog import get_logger

JOBS_SHOW_LIMIT = 10  # Number of jobs to show in the email


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


def build_search_url(filters: AlertFilters) -> str:
    """Build the job search URL based on the filters."""
    base_url = f"{get_settings(FrontendSettings).seeker_portal_base_url}/search"

    # Build the path component
    if filters.search_term and filters.location:
        base_url += f"/{filters.search_term.strip().replace(' ', '-')}-jobs-in-{filters.location.strip().replace(' ', '-')}"
    elif filters.search_term:
        base_url += f"/{filters.search_term.strip().replace(' ', '-')}-jobs"
    elif filters.location:
        base_url += f"/jobs-in-{filters.location.strip().replace(' ', '-')}"

    # Build query parameters dictionary
    query_params = {}

    if filters.min_experience is not None:
        query_params["minExperience"] = str(filters.min_experience)

    if filters.max_experience is not None:
        query_params["maxExperience"] = str(filters.max_experience)

    if filters.min_salary is not None:
        query_params["minSalary"] = str(filters.min_salary)

    if filters.max_salary is not None:
        query_params["maxSalary"] = str(filters.max_salary)

    if filters.work_mode:
        query_params["workMode"] = ",".join([val.upper() for val in filters.work_mode])

    if filters.job_type:
        query_params["jobType"] = ",".join([val.upper() for val in filters.job_type])

    # Use urlencode to properly encode query parameters
    if query_params:
        query_string = urlencode(query_params)
        return f"{base_url}?{query_string}"

    return base_url


async def send_job_alerts(
    event: list[tuple[JobAlertEventBody, str]],
) -> str:
    """Process the job applicant analysis event."""
    batch_item_failures = []
    sqs_batch_response = {}

    async with container.context() as ctx:
        job_alert_repo = await ctx.resolve(JobAlertRepo)
        job_repo = await ctx.resolve(JobRepo)
        email_sender = await ctx.resolve(BaseEmailSender)
        whatsapp_client = await ctx.resolve(WhatsappClient)

    for record, message_id in event:
        try:
            # Get the job alert with account details
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

            filter_datetime: datetime

            match job_alert.frequency:
                case "daily":
                    filter_datetime = datetime.now(UTC) - timedelta(days=1)
                case "weekly":
                    filter_datetime = datetime.now(UTC) - timedelta(weeks=1)
                case "monthly":
                    filter_datetime = datetime.now(UTC) - timedelta(weeks=4)

            work_mode = job_alert.filters.work_mode or []

            job_type = job_alert.filters.job_type or []

            # Get all active jobs matching the alert filters
            jobs_result = await job_repo.get_all_active(
                work_mode=[JobWorkMode(val) for val in work_mode],  # type: ignore[arg-type]
                job_type=[JobType(val) for val in job_type],  # type: ignore[arg-type]
                search_term=job_alert.filters.search_term,
                location=job_alert.filters.location,
                min_experience=job_alert.filters.min_experience,
                max_experience=job_alert.filters.max_experience,
                min_salary=job_alert.filters.min_salary,
                max_salary=job_alert.filters.max_salary,
                first=JOBS_SHOW_LIMIT,
                cutoff_datetime=filter_datetime,  # filter here based on frequency
                sort_by=JobSearchSortBy.RELEVANCE,
            )

            # Limit to 10 most recent jobs for the email
            jobs_to_send = jobs_result.entities

            if not jobs_to_send:
                logger.info(
                    "No new jobs found for job alert",
                    extra={"job_alert_id": record.alert_id},
                )
                continue

            for job in jobs_to_send:
                # TODO: make this more efficient by batching
                await job.fetch_all_links()

            # Send email alert
            await email_sender.send_template_email(
                receiver=job_alert.account.email,
                template="job-alerts",
                context={
                    "jobs": jobs_to_send,
                    "job_alert": job_alert,
                    "has_more_jobs": jobs_result.page_info.has_next_page,
                    "search_url": build_search_url(job_alert.filters),
                    "job_alerts_url": f"{get_settings(FrontendSettings).seeker_portal_base_url}/my-alerts",
                },
            )

            if (
                job_alert.account.whatsapp_job_alerts_enabled
                and job_alert.account.phone_number is not None
            ):
                # send whatsapp job alerts highlighting most relevant job
                most_relevant_job = jobs_to_send[0]
                await whatsapp_client.send_job_alerts(
                    receiver=phonenumbers.parse(job_alert.account.phone_number),
                    name=job_alert.account.full_name,
                    organization_name=most_relevant_job.organization.name,
                    location=most_relevant_job.location,
                    other_jobs_count=f"{len(jobs_to_send) - 1}+"
                    if len(jobs_to_send) > 1
                    else "many",
                    search_jobs_url=build_search_url(job_alert.filters),
                )

            # Update the last sent timestamp for the alert
            await job_alert_repo.update_last_sent_at(job_alert=job_alert)

            logger.info(
                "Successfully sent job alert",
                extra={
                    "job_alert_id": record.alert_id,
                    "jobs_sent": len(jobs_to_send),
                    "recipient_email": job_alert.account.email,
                },
            )

        except Exception as e:
            logger.exception(
                "Failed to process job alert",
                extra={
                    "job_alert_id": record.alert_id,
                    "error": str(e),
                },
            )
            batch_item_failures.append(
                {
                    "itemIdentifier": message_id,
                }
            )
    sqs_batch_response["batchItemFailures"] = batch_item_failures
    return json.dumps(sqs_batch_response)


if __name__ == "__main__":
    # for local testing only
    loop.run_until_complete(
        send_job_alerts([(JobAlertEventBody(alert_id="68ce92ba3921b9135ab59732"), "1")])
    )

import asyncio
import json

from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from bson import ObjectId
from structlog import get_logger

from app.config import AppSettings, DatabaseSettings, get_settings
from app.container import create_container
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
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


@event_source(data_class=EventBridgeEvent)
def lambda_handler(event: EventBridgeEvent, context: LambdaContext) -> str:
    """Lambda handler for the daily WhatsApp message generation cron job."""
    return loop.run_until_complete(process_wa_messages_generation_event())


async def process_wa_messages_generation_event() -> str:
    """Process the daily WhatsApp message generation job."""
    async with container.context() as ctx:
        job_repo = await ctx.resolve(JobRepo)

    wa_messages = []

    unposted_jobs = await job_repo.get_for_whatsapp_message_generation()
    for job in unposted_jobs:
        wa_messages.append(format_job_for_whatsapp_message(job))

    # TODO: post the messages as individual files to google drive

    await job_repo.mark_as_posted_on_whatsapp(
        [ObjectId(job.id) for job in unposted_jobs]
    )

    return json.dumps({"status": "ok", "jobs_processed": len(unposted_jobs)})


def format_salary(job):
    """Format salary based on available fields"""
    if hasattr(job, "min_salary") and hasattr(job, "max_salary"):
        if job.min_salary and job.max_salary:
            return f"₹{job.min_salary} - ₹{job.max_salary}"
        elif job.min_salary:
            return f"From ₹{job.min_salary}"
        elif job.max_salary:
            return f"Up to ₹{job.max_salary}"
        else:
            return "Not specified"
    else:
        return "Not specified"


def format_experience(job):
    """Format experience based on available fields"""
    if hasattr(job, "min_experience") and hasattr(job, "max_experience"):
        if job.min_experience and job.max_experience:
            return f"{job.min_experience} - {job.max_experience} years"
        elif job.min_experience:
            return f"From {job.min_experience} years"
        elif job.max_experience:
            return f"Up to {job.max_experience} years"
        else:
            return "Not specified"
    elif hasattr(job, "experience") and job.experience:
        return job.experience
    else:
        return "Not specified"


def format_job_for_whatsapp_message(job: Job) -> str:
    """Format a job for whatsapp message."""

    return f"""
*{job.title.strip()}*
{job.organization.name.strip()}

*Location:* {job.location if job.location else "Not specified"}
*Salary:* {format_salary(job)}
*Vacancies:* {job.vacancies if job.vacancies else "Not specified"}
*Experience:* {format_experience(job)}

🔗 *Apply Now:*
https://hospitaljobs.in/organizations/{job.organization.slug}/jobs/{job.slug}
        """

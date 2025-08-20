import asyncio
import json
import os
import shutil
import tempfile
import zipfile
from datetime import UTC, datetime
from pathlib import Path

from app.config import DatabaseSettings, EnvironmentSettings, get_settings
from app.container import create_container
from app.core.constants import SENDER_EMAIL, SUPPORT_EMAIL
from app.core.emails import BaseEmailSender
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.jobs.documents import Job
from app.logger import setup_logging
from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext
from beanie.operators import In, Or
from bson import ObjectId
from structlog import get_logger

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


@event_source(data_class=EventBridgeEvent)
def lambda_handler(event: EventBridgeEvent, context: LambdaContext) -> str:
    """Lambda handler for the daily WhatsApp message generation cron job."""
    return loop.run_until_complete(process_wa_messages_generation_event())


async def process_wa_messages_generation_event() -> str:
    """Process the daily WhatsApp message generation job."""
    async with container.context() as ctx:
        # TODO: job repo needs to connect to redis client. need to fix this.
        # job_repo = await ctx.resolve(JobRepo)
        email_sender = await ctx.resolve(BaseEmailSender)

        # TODO: job repo needs to connect to redis client. need to fix this.
        # unposted_jobs = await job_repo.get_for_whatsapp_message_generation()
        unposted_jobs = await Job.find(
            Job.is_active == True,
            Job.whatsapp_channel_posted_at == None,
            Or(Job.expires_at == None, Job.expires_at > datetime.now(UTC)),
            fetch_links=True,
            nesting_depth=2,
        ).to_list()
        wa_messages = [
            format_job_for_whatsapp_message(job=job) for job in unposted_jobs
        ]

        if wa_messages:
            # Create individual text files and zip them
            zip_file_path = await create_message_files_and_zip(
                wa_messages, unposted_jobs
            )

            # Send email with zip attachment using the email template
            await send_whatsapp_messages_email(
                zip_file_path, len(wa_messages), email_sender=email_sender
            )

            # Clean up temporary files
            cleanup_temp_files(zip_file_path)

        # TODO: job repo needs to connect to redis client. need to fix this.
        # await job_repo.mark_as_posted_on_whatsapp(
        #     [ObjectId(job.id) for job in unposted_jobs]
        # )
        await Job.find(In(Job.id, [ObjectId(job.id) for job in unposted_jobs])).set(
            {Job.whatsapp_channel_posted_at: datetime.now(UTC)}
        )
        return json.dumps({"status": "ok", "jobs_processed": len(unposted_jobs)})


async def send_whatsapp_messages_email(
    zip_file_path: str, message_count: int, email_sender: BaseEmailSender
) -> None:
    """Send email with zip attachment using the email template."""
    try:
        # Read the zip file
        with open(zip_file_path, "rb") as f:
            zip_content = f.read()

        # Prepare context for the template
        context = {
            "app_name": "HospitalJobs.in",
            "app_url": "https://hospitaljobs.in",
            "message_count": message_count,
        }

        # Prepare attachment
        zip_filename = os.path.basename(zip_file_path)
        attachments = [(zip_filename, zip_content, "application/zip")]

        # Send email using template
        await email_sender.send_template_email(
            receiver=SUPPORT_EMAIL,
            template="whatsapp-messages",
            context=context,
            sender=SENDER_EMAIL,
            attachments=attachments,
        )

        logger.info(f"Email sent successfully with attachment: {zip_filename}")

    except Exception as e:
        logger.error(f"Failed to send email: {e!s}")
        raise


async def create_message_files_and_zip(wa_messages: list[str], jobs: list[Job]) -> str:
    """Create individual text files for each message and zip them."""
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)

        # Create individual text files for each message
        for i, (message, job) in enumerate(zip(wa_messages, jobs)):
            filename = f"job_{i + 1}_{job.organization.slug}_{job.slug}.txt"
            file_path = temp_path / filename

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(message.strip())

        # Create zip file
        timestamp = datetime.now(UTC).strftime("%d_%m_%Y")
        zip_filename = f"checkpoint_{timestamp}.zip"
        zip_path = temp_path / zip_filename

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file_path in temp_path.glob("*.txt"):
                zipf.write(file_path, file_path.name)

        # Copy zip to a persistent location (Lambda /tmp directory)
        persistent_zip_path = f"/tmp/{zip_filename}"

        shutil.copy2(zip_path, persistent_zip_path)

        return persistent_zip_path


def cleanup_temp_files(zip_file_path: str) -> None:
    """Clean up temporary files."""
    try:
        if os.path.exists(zip_file_path):
            os.remove(zip_file_path)
            logger.info(f"Cleaned up temporary file: {zip_file_path}")
    except Exception as e:
        logger.warning(f"Failed to clean up temporary file {zip_file_path}: {e!s}")


def format_salary(job: Job) -> str:
    """Format salary based on available fields."""
    if hasattr(job, "min_salary") and hasattr(job, "max_salary"):
        if job.min_salary and job.max_salary:
            return f"₹{job.min_salary} - ₹{job.max_salary}"
        if job.min_salary:
            return f"From ₹{job.min_salary}"
        if job.max_salary:
            return f"Up to ₹{job.max_salary}"
        return "Not specified"
    return "Not specified"


def format_experience(job: Job) -> str:
    """Format experience based on available fields."""
    if hasattr(job, "min_experience") and hasattr(job, "max_experience"):
        if job.min_experience and job.max_experience:
            return f"{job.min_experience} - {job.max_experience} years"
        if job.min_experience:
            return f"From {job.min_experience} years"
        if job.max_experience:
            return f"Up to {job.max_experience} years"
        return "Not specified"
    if hasattr(job, "experience") and job.experience:
        return job.experience
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


if __name__ == "__main__":
    loop.run_until_complete(process_wa_messages_generation_event())

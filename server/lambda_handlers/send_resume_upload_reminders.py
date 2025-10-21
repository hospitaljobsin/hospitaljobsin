import asyncio
from datetime import UTC, datetime, timedelta

from app.accounts.documents import Account
from app.config import (
    AppSettings,
    DatabaseSettings,
    EnvironmentSettings,
    FrontendSettings,
    get_settings,
)
from app.container import create_container
from app.core.emails import BaseEmailSender
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.logger import setup_logging
from aws_lambda_powertools.utilities.typing import LambdaContext
from bson import ObjectId
from pymongo import AsyncMongoClient
from structlog import get_logger

env_settings = get_settings(EnvironmentSettings)

initialize_instrumentation(settings=env_settings)

setup_logging(human_readable=env_settings.debug)

container = create_container()

logger = get_logger(__name__)


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


def lambda_handler(event: dict, context: LambdaContext) -> dict:
    """Lambda handler to send resume upload reminders."""
    return loop.run_until_complete(send_resume_upload_reminders())


async def send_resume_upload_reminders() -> dict:
    """Send resume upload reminders to users without resumes."""
    async with container.context() as ctx:
        email_sender = await ctx.resolve(BaseEmailSender)
        app_settings = get_settings(AppSettings)
        frontend_settings = get_settings(FrontendSettings)

        # Find accounts created in the last 7 days
        cutoff_date = datetime.now(UTC) - timedelta(days=7)
        cutoff_object_id = ObjectId.from_datetime(cutoff_date)

        accounts = await Account.find(
            Account.id >= cutoff_object_id,
            fetch_links=True,
        ).to_list()

        sent_count = 0
        skipped_count = 0

        for account in accounts:
            # Skip if profile exists and has a resume
            if account.profile and account.profile.resume_url:
                skipped_count += 1
                continue

            try:
                await email_sender.send_template_email(
                    receiver=account.email,
                    template="resume-upload-reminder",
                    context={
                        "user_name": account.full_name,
                        "upload_resume_url": f"{frontend_settings.seeker_portal_base_url}/profile/resume?utm_source=email&utm_medium=email&utm_campaign=resume_upload_reminder",
                        "support_email": app_settings.support_email,
                        "app_name": app_settings.app_name,
                        "app_logo_url": app_settings.app_logo_url,
                        "app_tagline": app_settings.app_tagline,
                        "company_name": app_settings.company_name,
                        "current_year": app_settings.current_year,
                    },
                )

                sent_count += 1

                logger.info(
                    "Resume upload reminder sent",
                    extra={
                        "account_id": str(account.id),
                        "email": account.email,
                    },
                )

            except Exception as e:
                logger.exception(
                    "Failed to send resume upload reminder",
                    extra={
                        "account_id": str(account.id),
                        "email": account.email,
                        "error": str(e),
                    },
                )

    logger.info(
        "Resume upload reminders batch completed",
        extra={
            "sent_count": sent_count,
            "skipped_count": skipped_count,
        },
    )

    return {
        "statusCode": 200,
        "body": {
            "sent": sent_count,
            "skipped": skipped_count,
        },
    }


if __name__ == "__main__":
    # For local testing
    result = loop.run_until_complete(send_resume_upload_reminders())
    print(result)

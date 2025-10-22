import asyncio
from collections import defaultdict
from datetime import UTC, datetime, timedelta

from app.config import (
    DatabaseSettings,
    EnvironmentSettings,
    FrontendSettings,
    get_settings,
)
from app.container import create_container
from app.core.emails import BaseEmailSender
from app.core.instrumentation import initialize_instrumentation
from app.database import initialize_database
from app.jobs.repositories import JobApplicantRepo, JobRepo
from app.logger import setup_logging
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from aws_lambda_powertools.utilities.typing import LambdaContext
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
    """Lambda handler for sending daily application digest emails."""
    return loop.run_until_complete(send_application_digests())


async def send_application_digests() -> dict:
    """Send daily digest emails to organization members about new applications."""
    async with container.context() as ctx:
        organization_repo = await ctx.resolve(OrganizationRepo)
        organization_member_repo = await ctx.resolve(OrganizationMemberRepo)
        job_applicant_repo = await ctx.resolve(JobApplicantRepo)
        job_repo = await ctx.resolve(JobRepo)
        email_sender = await ctx.resolve(BaseEmailSender)
        frontend_settings = get_settings(FrontendSettings)

        now = datetime.now(UTC)
        cutoff_time = now.replace(
            hour=0, minute=0, second=0, microsecond=0
        ) - timedelta(days=1)

        emails_sent = 0
        after = None
        seen_cursors = set()

        while True:
            organizations = await organization_repo.get_all(first=99, after=after)

            if not organizations.entities:
                break

            # Prevent infinite loop if cursor repeats
            current_cursor = organizations.page_info.end_cursor
            if current_cursor and current_cursor in seen_cursors:
                logger.error("Detected cursor loop, breaking pagination")
                break
            if current_cursor:
                seen_cursors.add(current_cursor)

            for organization in organizations.entities:
                new_applicants_result = (
                    await job_applicant_repo.get_all_by_organization_id_paginated(
                        organization_id=organization.id,
                        first=100,
                    )
                )

                new_applicants = [
                    applicant
                    for applicant in new_applicants_result.entities
                    if applicant.id and applicant.id.generation_time >= cutoff_time
                ]

                if not new_applicants:
                    continue

                applicants_by_job = defaultdict(list)
                job_ids = set()
                for applicant in new_applicants:
                    if hasattr(applicant.job, "ref"):
                        job_id = applicant.job.ref.id
                    elif hasattr(applicant.job, "id"):
                        job_id = applicant.job.id
                    else:
                        job_id = applicant.job
                    applicants_by_job[job_id].append(applicant)
                    job_ids.add(job_id)

                jobs = await job_repo.get_many_by_ids(list(job_ids))
                jobs_by_id = {job.id: job for job in jobs if job}

                members_result = (
                    await organization_member_repo.get_all_by_organization_id(
                        organization_id=organization.id,
                        first=100,
                    )
                )

                for job_id, job_applicants in applicants_by_job.items():
                    job = jobs_by_id.get(job_id)
                    if not job:
                        continue

                    for member in members_result.entities:
                        try:
                            await email_sender.send_template_email(
                                receiver=member.account.email,
                                template="candidate-application-notification",
                                context={
                                    "recruiter_name": member.account.full_name,
                                    "job": job,
                                    "organization": organization,
                                    "applicants": job_applicants,
                                    "applicant_count": len(job_applicants),
                                    "applicants_url": f"https://{organization.slug}.{frontend_settings.base_domain}/jobs/{job.slug}/applicants",
                                    "manage_jobs_url": f"https://{organization.slug}.{frontend_settings.base_domain}",
                                },
                            )

                            emails_sent += 1

                            logger.info(
                                "Sent application digest",
                                extra={
                                    "organization_id": str(organization.id),
                                    "job_id": str(job.id),
                                    "member_email": member.account.email,
                                    "applicant_count": len(job_applicants),
                                },
                            )
                        except Exception as e:
                            logger.exception(
                                "Failed to send application digest",
                                extra={
                                    "organization_id": str(organization.id),
                                    "job_id": str(job.id),
                                    "member_email": member.account.email,
                                    "error": str(e),
                                },
                            )

            if not organizations.page_info.has_next_page:
                break

            after = organizations.page_info.end_cursor

            # Safety check: if cursor didn't change, break
            if after is None:
                break

        logger.info(f"Application digest job completed. Sent {emails_sent} emails.")

        return {"statusCode": 200, "emails_sent": emails_sent}


if __name__ == "__main__":
    loop.run_until_complete(send_application_digests())

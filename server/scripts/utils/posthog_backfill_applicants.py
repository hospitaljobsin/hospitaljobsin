import asyncio

from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.database import initialize_database
from app.jobs.documents import JobApplicant
from posthog import Posthog
from pymongo import AsyncMongoClient
from strawberry import relay


async def backfill_user_analytics() -> None:
    """Backfill PostHog analytics for existing users with dynamic auth provider detection."""
    # Find the organization with slug "aryan"
    await initialize_database(
        get_settings(DatabaseSettings).default_database_name,
        db_client=AsyncMongoClient(str(get_settings(DatabaseSettings).database_url)),
    )

    container = create_container()
    async with container.context() as ctx:
        posthog_client = await ctx.resolve(Posthog)

    applicants = await JobApplicant.find().to_list()

    for applicant in applicants:
        await applicant.fetch_link(JobApplicant.job)
        existing_job = applicant.job
        posthog_client.capture(
            event="job_applied",
            distinct_id=str(relay.GlobalID("Account", str(applicant.account.ref.id))),
            timestamp=applicant.id.generation_time,
            groups={
                "organization": str(
                    relay.GlobalID("Organization", str(existing_job.organization.id))
                )
            },
            properties={
                "job_id": str(relay.GlobalID("Job", str(existing_job.id))),
                "job_title": existing_job.title,
            },
        )
        print(f"Inserted backfill analytics for applicant: {applicant.account.ref.id}")


# Run the async function
if __name__ == "__main__":
    asyncio.run(backfill_user_analytics())

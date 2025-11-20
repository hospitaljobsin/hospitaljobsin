import asyncio

from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.database import initialize_database
from app.jobs.documents import Job
from app.organizations.documents import Organization, OrganizationMember
from posthog import Posthog
from pymongo import AsyncMongoClient
from strawberry import relay


async def insert_healthcare_jobs() -> None:
    """Insert 500+ diverse healthcare jobs across various regions for clustering demonstration."""
    # Find the organization with slug "aryan"
    await initialize_database(
        get_settings(DatabaseSettings).default_database_name,
        db_client=AsyncMongoClient(str(get_settings(DatabaseSettings).database_url)),
    )

    container = create_container()
    async with container.context() as ctx:
        posthog_client = await ctx.resolve(Posthog)

    organizations = await Organization.find().to_list()

    for organization in organizations:
        # Identify the organization group in PostHog
        admins = await OrganizationMember.find(
            OrganizationMember.organization.id == organization.id,
            OrganizationMember.role == "admin",
        ).to_list()
        admin = admins[0]
        posthog_client.capture(
            event="organization_created",
            distinct_id=str(relay.GlobalID("Account", str(admin.id))),
            timestamp=organization.id.generation_time,
            properties={
                "organization_id": str(
                    relay.GlobalID("Organization", str(organization.id))
                ),
                "organization_name": organization.name,
                "organization_slug": organization.slug,
            },
        )
        print(f"Inserted backfill analytics for organization: {organization.slug}")

    jobs = await Job.find().to_list()

    for job in jobs:
        admins = await OrganizationMember.find(
            OrganizationMember.organization.id == job.organization.ref.id,
            OrganizationMember.role == "admin",
        ).to_list()
        admin = admins[0]

        posthog_client.capture(
            event="job_created",
            distinct_id=str(relay.GlobalID("Account", str(admin.id))),
            timestamp=job.id.generation_time,
            groups={
                "organization": str(
                    relay.GlobalID("Organization", str(job.organization.ref.id))
                )
            },
            properties={
                "job_id": str(relay.GlobalID("Job", str(job.id))),
                "job_title": job.title,
            },
        )
        posthog_client.capture(
            event="job_published",
            distinct_id=str(relay.GlobalID("Account", str(admin.id))),
            timestamp=job.id.generation_time,
            groups={
                "organization": str(
                    relay.GlobalID("Organization", str(job.organization.ref.id))
                )
            },
            properties={
                "job_id": str(relay.GlobalID("Job", str(job.id))),
                "job_title": job.title,
            },
        )

        print(
            f"Inserted backfill analytics for job: {job.title} in organization: {organization.slug}"
        )


# Run the async function
if __name__ == "__main__":
    asyncio.run(insert_healthcare_jobs())

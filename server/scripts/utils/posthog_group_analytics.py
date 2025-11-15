import asyncio

from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.database import initialize_database
from app.organizations.documents import Organization
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
        posthog_client.group_identify(
            "organization",
            str(relay.GlobalID("Organization", str(organization.id))),
            {
                "name": organization.name,
                "slug": organization.slug,
                "created_at": organization.id.generation_time,
            },
        )
        print(f"Inserted group analytics for organization: {organization.slug}")


# Run the async function
if __name__ == "__main__":
    asyncio.run(insert_healthcare_jobs())

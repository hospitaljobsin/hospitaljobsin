import asyncio

from app.accounts.documents import Account
from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.database import initialize_database
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

    users = await Account.find().to_list()

    for user in users:
        # Determine the first auth provider based on ID generation time
        first_auth_provider = (
            user.auth_providers[0] if user.auth_providers else "password"
        )

        posthog_client.capture(
            event="user_signed_up",
            distinct_id=str(relay.GlobalID("Account", str(user.id))),
            timestamp=user.id.generation_time,
            properties={"email": user.email, "auth_provider": first_auth_provider},
        )
        print(f"Inserted backfill analytics for user: {user.email}")


# Run the async function
if __name__ == "__main__":
    asyncio.run(backfill_user_analytics())

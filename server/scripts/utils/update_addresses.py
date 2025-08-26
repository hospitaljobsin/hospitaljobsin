import asyncio

from app.base.models import Address
from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.core.geocoding import BaseLocationService
from app.database import initialize_database
from app.organizations.documents import Organization


async def update_locations():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    container = create_container()
    async with container.context() as ctx:
        location_service = await ctx.resolve(BaseLocationService)

    organizations = await Organization.find().to_list()

    for organization in organizations:
        if organization.verification_request is not None:
            organization.verification_request.address = Address(
                display_name="",
                street_address="",
                address_locality="",
                address_region="",
                postal_code="",
                country="India",
            )
            await organization.save()
            print(f"saved organization {organization.id}")


if __name__ == "__main__":
    asyncio.run(update_locations())

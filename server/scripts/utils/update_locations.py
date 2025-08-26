import asyncio

from app.base.models import Address, GeoObject
from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.core.geocoding import BaseLocationService
from app.database import initialize_database
from app.jobs.documents import Job


async def update_locations():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    container = create_container()
    async with container.context() as ctx:
        location_service = await ctx.resolve(BaseLocationService)

    jobs = await Job.find().to_list()

    for job in jobs:
        if job.location is None:
            job.location = "Chennai, India"
            print(f"job.location is none for job {job.id}")
        result = await location_service.geocode(job.location)
        if result is None:
            print(f"result is none for job {job.id}")
            continue
        job.geo = GeoObject(
            coordinates=(result.longitude, result.latitude),
        )
        job.address = Address(
            display_name=job.location,
            street_address=result.street_address,
            address_locality=result.address_locality,
            address_region=result.address_region,
            postal_code=result.postal_code,
            country=result.country,
        )
        await job.save()
        print(f"saved job {job.id}")


if __name__ == "__main__":
    asyncio.run(update_locations())

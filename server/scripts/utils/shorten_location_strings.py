import asyncio

from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.jobs.documents import Job


def shorten_location(location: str) -> str | None:
    """
    Shorten location string to first two comma-separated parts.
    Handles various edge cases:
    - Single locations (no commas)
    - Empty or whitespace-only strings
    - Locations with single comma
    - Malformed data
    """
    if not location or not location.strip():
        return None

    # Clean the location string
    location = location.strip()

    # Split by comma and clean each part
    parts = [part.strip() for part in location.split(",") if part.strip()]

    # Handle edge cases
    if not parts:
        return None

    if len(parts) == 1:
        # Single location, return as is
        return parts[0]

    if len(parts) == 2:
        # Already has exactly 2 parts, return as is
        return ", ".join(parts)

    # More than 2 parts, take first two
    return ", ".join(parts[:2])


async def shorten_location_strings():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    jobs = await Job.find().to_list()

    for job in jobs:
        if job.location is not None:
            original_location = job.location
            job.location = shorten_location(job.location)

            # Only save if location actually changed
            if original_location != job.location:
                await job.save()
                print(
                    f"Updated job {job.id}: '{original_location}' -> '{job.location}'"
                )
            else:
                print(f"No change for job {job.id}: '{job.location}'")
        else:
            print(f"Job {job.id} has no location")

    print("Done")


if __name__ == "__main__":
    asyncio.run(shorten_location_strings())

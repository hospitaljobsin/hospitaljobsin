import asyncio
from datetime import UTC, datetime

from app.config import DatabaseSettings, get_settings
from app.database import initialize_database
from app.jobs.documents import Job
from beanie.operators import Or


async def generate_whatsapp_messages():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    messages = []
    job_ids_being_processed = []

    jobs = await Job.find(
        Job.is_active == True,
        Job.whatsapp_channel_posted_at == None,
        Or(Job.expires_at == None, Job.expires_at > datetime.now(UTC)),
        fetch_links=True,
        nesting_depth=2,
    ).to_list()

    for job in jobs:
        job.whatsapp_channel_posted_at = None
        await job.save()


if __name__ == "__main__":
    asyncio.run(generate_whatsapp_messages())

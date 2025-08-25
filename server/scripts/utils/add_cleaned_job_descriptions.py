import asyncio

from app.config import DatabaseSettings, get_settings
from app.core.formatting import clean_markdown_text, markdown_to_clean_html
from app.database import initialize_database
from app.jobs.documents import Job


async def add_cleaned_job_descriptions():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    jobs = await Job.find().to_list()

    for job in jobs:
        job.description_cleaned = clean_markdown_text(job.description)
        job.description_html = markdown_to_clean_html(job.description)
        await job.save()
        print(f"Saved job {job.id}")

    print("Done")


if __name__ == "__main__":
    asyncio.run(add_cleaned_job_descriptions())

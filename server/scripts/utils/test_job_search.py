import asyncio

from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.database import initialize_database
from app.jobs.repositories import JobRepo


async def test_job_search():
    await initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    )

    container = create_container()
    async with container.context() as ctx:
        job_repo = await ctx.resolve(JobRepo)
    jobs = await job_repo.get_all_active(
        work_mode=[],
        job_type=[],
        search_term="nurse",
        first=25,
    )

    print(f"Found {jobs.total_count} jobs")
    for job in jobs.entities:
        print(f"Job ID: {job.id}, Title: {job.title}")


if __name__ == "__main__":
    asyncio.run(test_job_search())

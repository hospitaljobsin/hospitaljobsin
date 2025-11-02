import pytest
from aioinject import Container
from app.jobs.services import JobService


@pytest.fixture(scope="session")
async def job_service(container: Container) -> JobService:
    async with container.context() as ctx:
        return await ctx.resolve(JobService)

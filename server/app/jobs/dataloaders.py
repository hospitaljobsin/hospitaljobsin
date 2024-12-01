from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId

from app.jobs.repositories import JobRepo

from .documents import Job


@inject
async def load_job_by_id(
    job_ids: list[str],
    job_repo: Annotated[
        JobRepo,
        Inject,
    ],
) -> list[Job | None]:
    """Load multiple jobs by their IDs."""
    return await job_repo.get_many_by_ids(
        job_ids=list(map(ObjectId, job_ids)),
    )

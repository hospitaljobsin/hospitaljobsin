from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId

from app.jobs.repositories import JobRepo

from .documents import Job


@inject
async def load_job_by_id(
    job_ids: list[str],
    job_repo: Annotated[JobRepo, Inject],
) -> list[Job | None]:
    """Load multiple jobs by their IDs."""
    valid_ids = [ObjectId(job_id) for job_id in job_ids if ObjectId.is_valid(job_id)]
    # Map invalid IDs to `None` for a consistent response structure
    id_to_job_map = {
        str(job_id): job
        for job_id, job in zip(valid_ids, await job_repo.get_many_by_ids(valid_ids))
    }
    return [id_to_job_map.get(job_id, None) for job_id in job_ids]

from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId

from app.jobs.repositories import JobRepo, SavedJobRepo

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


@inject
async def load_job_by_slug(
    job_slugs: list[str],
    job_repo: Annotated[JobRepo, Inject],
) -> list[Job | None]:
    """Load multiple jobs by their slugs."""
    slug_to_company_map = {
        slug: company
        for slug, company in zip(
            job_slugs,
            await job_repo.get_many_by_slugs(job_slugs),
        )
    }

    return [slug_to_company_map.get(slug, None) for slug in job_slugs]


@inject
async def load_saved_job_by_id(
    job_ids: list[tuple[str, str]],
    saved_job_repo: Annotated[SavedJobRepo, Inject],
) -> list[Job | None]:
    """Load multiple saved jobs by their IDs."""
    valid_ids = [
        (ObjectId(account_id), ObjectId(job_id))
        for (account_id, job_id) in job_ids
        if ObjectId.is_valid(account_id) and ObjectId.is_valid(job_id)
    ]
    # Map invalid IDs to `None` for a consistent response structure
    id_to_job_map = {
        (str(account_id), str(job_id)): job
        for (account_id, job_id), job in zip(
            valid_ids, await saved_job_repo.get_many_by_ids(valid_ids)
        )
    }

    return [
        id_to_job_map.get((account_id, job_id), None)
        for (account_id, job_id) in job_ids
    ]

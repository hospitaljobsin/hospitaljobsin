from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.core.dataloaders import load_many_entities, transform_valid_object_id
from app.jobs.repositories import JobRepo, SavedJobRepo

from .documents import Job


@inject
async def load_job_by_id(
    job_ids: list[str],
    job_repo: Annotated[JobRepo, Inject],
) -> list[Job | None]:
    """Load multiple jobs by their IDs."""
    return await load_many_entities(
        keys=job_ids,
        repo_method=job_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


@inject
async def load_job_by_slug(
    job_slugs: list[str],
    job_repo: Annotated[JobRepo, Inject],
) -> list[Job | None]:
    """Load multiple jobs by their slugs."""
    return await load_many_entities(
        keys=job_slugs,
        repo_method=job_repo.get_many_by_slugs,
    )


@inject
async def load_saved_job_by_id(
    job_ids: list[tuple[str, str]],
    saved_job_repo: Annotated[SavedJobRepo, Inject],
) -> list[Job | None]:
    """Load multiple saved jobs by their IDs."""
    return await load_many_entities(
        keys=job_ids,
        repo_method=saved_job_repo.get_many_by_ids,
        key_transform=lambda saved_job_key: (
            transform_valid_object_id(saved_job_key[0]),
            transform_valid_object_id(saved_job_key[1]),
        ),
    )

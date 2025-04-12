from strawberry.dataloader import DataLoader

from app.core.dataloaders import (
    create_dataloader,
    transform_default,
    transform_valid_object_id,
    transform_valid_object_id_tuple,
)
from app.jobs.repositories import JobApplicationFormRepo, JobRepo, SavedJobRepo

from .documents import Job, JobApplicationForm

type JobByIdLoader = DataLoader[str, Job | None]


async def create_job_by_id_dataloader(
    job_repo: JobRepo,
) -> JobByIdLoader:
    """Create a dataloader to load jobs by their IDs."""
    return create_dataloader(
        repo_method=job_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


type JobApplicationFormByIdLoader = DataLoader[str, JobApplicationForm | None]


async def create_job_application_form_by_id_dataloader(
    job_application_form_repo: JobApplicationFormRepo,
) -> JobApplicationFormByIdLoader:
    """Create a dataloader to load jobs by their IDs."""
    return create_dataloader(
        repo_method=job_application_form_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


type JobBySlugLoader = DataLoader[str, Job | None]


async def create_job_by_slug_dataloader(
    job_repo: JobRepo,
) -> JobBySlugLoader:
    """Create a dataloader to load jobs by their slugs."""
    return create_dataloader(
        repo_method=job_repo.get_many_by_slugs,
        key_transform=transform_default,
    )


type SavedJobByIdLoader = DataLoader[tuple[str, str], Job | None]


async def create_saved_job_by_id_dataloader(
    saved_job_repo: SavedJobRepo,
) -> SavedJobByIdLoader:
    """Create a dataloader to load saved jobs by their IDs."""
    return create_dataloader(
        repo_method=saved_job_repo.get_many_by_ids,
        key_transform=transform_valid_object_id_tuple,
    )

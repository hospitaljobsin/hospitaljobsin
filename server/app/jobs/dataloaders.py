from bson import ObjectId
from strawberry.dataloader import DataLoader

from app.core.dataloaders import (
    create_dataloader,
    transform_default,
    transform_valid_object_id,
    transform_valid_object_id_tuple,
)
from app.jobs.repositories import (
    JobApplicantRepo,
    JobApplicationFormRepo,
    JobRepo,
    SavedJobRepo,
)

from .documents import Job, JobApplicant, JobApplicationForm, SavedJob

type JobByIdLoader = DataLoader[str, Job | None]


async def create_job_by_id_dataloader(
    job_repo: JobRepo,
) -> JobByIdLoader:
    """Create a dataloader to load jobs by their IDs."""
    return create_dataloader(
        repo_method=job_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


type JobApplicantByIdLoader = DataLoader[str, JobApplicant | None]


async def create_job_applicant_by_id_dataloader(
    job_applicant_repo: JobApplicantRepo,
) -> JobApplicantByIdLoader:
    """Create a dataloader to load job applicants by their IDs."""
    return create_dataloader(
        repo_method=job_applicant_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


type JobApplicantBySlugLoader = DataLoader[str, JobApplicant | None]


async def create_job_applicant_by_slug_dataloader(
    job_applicant_repo: JobApplicantRepo,
) -> JobApplicantBySlugLoader:
    """Create a dataloader to load job applicants by their slugs."""
    return create_dataloader(
        repo_method=job_applicant_repo.get_many_by_slugs,
        key_transform=transform_default,
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


type ApplicantCountByJobIdLoader = DataLoader[str, dict[str, int] | None]


async def create_applicant_count_by_job_id_dataloader(
    job_applicant_repo: JobApplicantRepo,
) -> ApplicantCountByJobIdLoader:
    """Create a dataloader to load jobs by their IDs."""
    return create_dataloader(
        repo_method=job_applicant_repo.get_many_counts_by_job_id,
        key_transform=transform_valid_object_id,
    )


def transform_valid_object_id_str_tuple(
    key: tuple[str, str],
) -> tuple[ObjectId, str] | None:
    """Check if a string tuple is a valid ObjectId and string tuple."""
    if len(key) == 2 and ObjectId.is_valid(key[0]):  # noqa: PLR2004
        return (ObjectId(key[0]), key[1])
    return None


type JobBySlugLoader = DataLoader[tuple[str, str], Job | None]


# TODO: maybe because of this loader its erroring?
async def create_job_by_slug_dataloader(
    job_repo: JobRepo,
) -> JobBySlugLoader:
    """Create a dataloader to load jobs by their slugs."""
    return create_dataloader(
        repo_method=job_repo.get_many_by_slugs,
        key_transform=transform_valid_object_id_str_tuple,
    )


type SavedJobByIdLoader = DataLoader[tuple[str, str], SavedJob | None]


async def create_saved_job_by_id_dataloader(
    saved_job_repo: SavedJobRepo,
) -> SavedJobByIdLoader:
    """Create a dataloader to load saved jobs by their IDs."""
    return create_dataloader(
        repo_method=saved_job_repo.get_many_by_ids,
        key_transform=transform_valid_object_id_tuple,
    )

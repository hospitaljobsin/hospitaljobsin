import dataclasses
from typing import Annotated

from aioinject import Inject

from app.accounts.dataloaders import AccountByIdLoader, ProfileByIdLoader
from app.jobs.dataloaders import JobByIdLoader, JobBySlugLoader, SavedJobByIdLoader
from app.organizations.dataloaders import (
    OrganizationByIdLoader,
    OrganizationBySlugLoader,
)


@dataclasses.dataclass(slots=True, kw_only=True)
class Dataloaders:
    job_by_id: JobByIdLoader
    job_by_slug: JobBySlugLoader
    saved_job_by_id: SavedJobByIdLoader
    organization_by_id: OrganizationByIdLoader
    organization_by_slug: OrganizationBySlugLoader
    account_by_id: AccountByIdLoader
    profile_by_id: ProfileByIdLoader


def create_dataloaders(
    account_by_id: Annotated[
        AccountByIdLoader,
        Inject,
    ],
    profile_by_id: Annotated[
        ProfileByIdLoader,
        Inject,
    ],
    job_by_id: Annotated[
        JobByIdLoader,
        Inject,
    ],
    job_by_slug: Annotated[
        JobBySlugLoader,
        Inject,
    ],
    saved_job_by_id: Annotated[
        SavedJobByIdLoader,
        Inject,
    ],
    organization_by_id: Annotated[
        OrganizationByIdLoader,
        Inject,
    ],
    organization_by_slug: Annotated[
        OrganizationBySlugLoader,
        Inject,
    ],
) -> Dataloaders:
    """Create dataloaders for the current context."""
    return Dataloaders(
        job_by_id=job_by_id,
        job_by_slug=job_by_slug,
        saved_job_by_id=saved_job_by_id,
        organization_by_id=organization_by_id,
        organization_by_slug=organization_by_slug,
        account_by_id=account_by_id,
        profile_by_id=profile_by_id,
    )

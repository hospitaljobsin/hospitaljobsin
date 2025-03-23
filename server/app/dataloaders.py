import dataclasses

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
    account_by_id: AccountByIdLoader,
    profile_by_id: ProfileByIdLoader,
    job_by_id: JobByIdLoader,
    job_by_slug: JobBySlugLoader,
    saved_job_by_id: SavedJobByIdLoader,
    organization_by_id: OrganizationByIdLoader,
    organization_by_slug: OrganizationBySlugLoader,
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

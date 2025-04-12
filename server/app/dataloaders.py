import dataclasses

from app.accounts.dataloaders import AccountByIdLoader, ProfileByIdLoader
from app.jobs.dataloaders import (
    JobApplicationFormByIdLoader,
    JobByIdLoader,
    JobBySlugLoader,
    SavedJobByIdLoader,
)
from app.organizations.dataloaders import (
    OrganizationByIdLoader,
    OrganizationBySlugLoader,
    OrganizationInviteByTokenLoader,
)


@dataclasses.dataclass(slots=True, kw_only=True)
class Dataloaders:
    job_by_id: JobByIdLoader
    job_by_slug: JobBySlugLoader
    job_application_form_by_id: JobApplicationFormByIdLoader
    saved_job_by_id: SavedJobByIdLoader
    organization_by_id: OrganizationByIdLoader
    organization_by_slug: OrganizationBySlugLoader
    account_by_id: AccountByIdLoader
    profile_by_id: ProfileByIdLoader
    organization_invite_by_token: OrganizationInviteByTokenLoader


def create_dataloaders(
    account_by_id: AccountByIdLoader,
    profile_by_id: ProfileByIdLoader,
    job_by_id: JobByIdLoader,
    job_by_slug: JobBySlugLoader,
    job_application_form_by_id: JobApplicationFormByIdLoader,
    saved_job_by_id: SavedJobByIdLoader,
    organization_by_id: OrganizationByIdLoader,
    organization_by_slug: OrganizationBySlugLoader,
    organization_invite_by_token: OrganizationInviteByTokenLoader,
) -> Dataloaders:
    """Create dataloaders for the current context."""
    return Dataloaders(
        job_by_id=job_by_id,
        job_by_slug=job_by_slug,
        job_application_form_by_id=job_application_form_by_id,
        saved_job_by_id=saved_job_by_id,
        organization_by_id=organization_by_id,
        organization_by_slug=organization_by_slug,
        account_by_id=account_by_id,
        profile_by_id=profile_by_id,
        organization_invite_by_token=organization_invite_by_token,
    )

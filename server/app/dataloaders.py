import dataclasses

from bson import ObjectId
from strawberry.dataloader import DataLoader

from app.accounts.dataloaders import load_account_by_id, load_profile_by_id
from app.accounts.documents import Account, Profile
from app.jobs.dataloaders import (
    load_job_by_id,
    load_job_by_slug,
    load_saved_job_by_id,
)
from app.jobs.documents import Job
from app.organizations.dataloaders import (
    load_organization_by_id,
    load_organization_by_slug,
)
from app.organizations.documents import Organization


@dataclasses.dataclass(slots=True, kw_only=True)
class Dataloaders:
    job_by_id: DataLoader[ObjectId, Job | None]
    job_by_slug: DataLoader[str, Job | None]
    saved_job_by_id: DataLoader[tuple[ObjectId, ObjectId], Job | None]
    organization_by_id: DataLoader[ObjectId, Organization | None]
    organization_by_slug: DataLoader[str, Organization | None]
    account_by_id: DataLoader[ObjectId, Account | None]
    profile_by_id: DataLoader[ObjectId, Profile | None]


def create_dataloaders() -> Dataloaders:
    return Dataloaders(
        job_by_id=DataLoader(
            load_fn=load_job_by_id,  # type: ignore[arg-type]
        ),
        job_by_slug=DataLoader(
            load_fn=load_job_by_slug,  # type: ignore[arg-type]
        ),
        saved_job_by_id=DataLoader(
            load_fn=load_saved_job_by_id,  # type: ignore[arg-type]
        ),
        organization_by_id=DataLoader(
            load_fn=load_organization_by_id,  # type: ignore[arg-type]
        ),
        organization_by_slug=DataLoader(
            load_fn=load_organization_by_slug,  # type: ignore[arg-type]
        ),
        account_by_id=DataLoader(
            load_fn=load_account_by_id,  # type: ignore[arg-type]
        ),
        profile_by_id=DataLoader(
            load_fn=load_profile_by_id,  # type: ignore[arg-type]
        ),
    )

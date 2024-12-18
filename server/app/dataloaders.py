import dataclasses

from bson import ObjectId
from strawberry.dataloader import DataLoader

from app.accounts.dataloaders import load_account_by_id, load_profile_by_id
from app.accounts.documents import Account, Profile
from app.companies.dataloaders import (
    load_company_by_id,
    load_company_by_slug,
    load_job_by_id,
    load_saved_job_by_id,
)
from app.companies.documents import Company, Job


@dataclasses.dataclass(slots=True, kw_only=True)
class Dataloaders:
    job_by_id: DataLoader[ObjectId, Job | None]
    saved_job_by_id: DataLoader[tuple[ObjectId, ObjectId], Job | None]
    company_by_id: DataLoader[ObjectId, Company | None]
    company_by_slug: DataLoader[str, Company | None]
    account_by_id: DataLoader[ObjectId, Account | None]
    profile_by_id: DataLoader[ObjectId, Profile | None]


def create_dataloaders() -> Dataloaders:
    return Dataloaders(
        job_by_id=DataLoader(
            load_fn=load_job_by_id,  # type: ignore[arg-type]
        ),
        saved_job_by_id=DataLoader(
            load_fn=load_saved_job_by_id,  # type: ignore[arg-type]
        ),
        company_by_id=DataLoader(
            load_fn=load_company_by_id,  # type: ignore[arg-type]
        ),
        company_by_slug=DataLoader(
            load_fn=load_company_by_slug,  # type: ignore[arg-type]
        ),
        account_by_id=DataLoader(
            load_fn=load_account_by_id,  # type: ignore[arg-type]
        ),
        profile_by_id=DataLoader(
            load_fn=load_profile_by_id,  # type: ignore[arg-type]
        ),
    )

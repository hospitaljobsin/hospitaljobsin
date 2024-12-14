import dataclasses

from bson import ObjectId
from strawberry.dataloader import DataLoader

from app.accounts.dataloaders import load_account_by_id, load_profile_by_id
from app.accounts.documents import Account, Profile
from app.companies.dataloaders import load_company_by_id, load_job_by_id
from app.companies.documents import Company, Job


@dataclasses.dataclass(slots=True, kw_only=True)
class Dataloaders:
    job_by_id: DataLoader[ObjectId, Job | None]
    company_by_id: DataLoader[ObjectId, Company | None]
    account_by_id: DataLoader[ObjectId, Account | None]
    profile_by_id: DataLoader[ObjectId, Profile | None]


def create_dataloaders() -> Dataloaders:
    return Dataloaders(
        job_by_id=DataLoader(
            load_fn=load_job_by_id,  # type: ignore[arg-type]
        ),
        company_by_id=DataLoader(
            load_fn=load_company_by_id,  # type: ignore[arg-type]
        ),
        account_by_id=DataLoader(
            load_fn=load_account_by_id,  # type: ignore[arg-type]
        ),
        profile_by_id=DataLoader(
            load_fn=load_profile_by_id,  # type: ignore[arg-type]
        ),
    )

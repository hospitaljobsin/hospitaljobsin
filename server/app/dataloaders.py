import dataclasses

from strawberry.dataloader import DataLoader

from app.companies.dataloaders import load_company_by_id
from app.companies.documents import Company
from app.jobs.dataloaders import load_job_by_id
from app.jobs.documents import Job


@dataclasses.dataclass(slots=True, kw_only=True)
class Dataloaders:
    job_by_id: DataLoader[str, Job | None]
    company_by_id: DataLoader[str, Company | None]


def create_dataloaders() -> Dataloaders:
    return Dataloaders(
        job_by_id=DataLoader(
            load_fn=load_job_by_id,  # type: ignore[arg-type]
        ),
        company_by_id=DataLoader(
            load_fn=load_company_by_id,  # type: ignore[arg-type]
        ),
    )

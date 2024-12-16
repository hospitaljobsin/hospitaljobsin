from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId

from app.companies.repositories import CompanyRepo, JobRepo

from .documents import Company, Job


@inject
async def load_company_by_id(
    company_ids: list[str],
    company_repo: Annotated[
        CompanyRepo,
        Inject,
    ],
) -> list[Company | None]:
    """Load multiple companies by their IDs."""
    valid_ids = [
        ObjectId(company_id)
        for company_id in company_ids
        if ObjectId.is_valid(company_id)
    ]
    # Map invalid IDs to `None` for a consistent response structure
    id_to_company_map = {
        company_id: company
        for company_id, company in zip(
            valid_ids, await company_repo.get_many_by_ids(valid_ids)
        )
    }

    return [id_to_company_map.get(company_id, None) for company_id in company_ids]


@inject
async def load_job_by_id(
    job_ids: list[str],
    job_repo: Annotated[JobRepo, Inject],
) -> list[Job | None]:
    """Load multiple jobs by their IDs."""
    valid_ids = [ObjectId(job_id) for job_id in job_ids if ObjectId.is_valid(job_id)]
    # Map invalid IDs to `None` for a consistent response structure
    id_to_job_map = {
        job_id: job
        for job_id, job in zip(valid_ids, await job_repo.get_many_by_ids(valid_ids))
    }
    return [id_to_job_map.get(job_id, None) for job_id in job_ids]

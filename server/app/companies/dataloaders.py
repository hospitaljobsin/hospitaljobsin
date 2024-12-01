from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.companies.repositories import CompanyRepo

from .documents import Company


@inject
async def load_company_by_id(
    company_ids: list[str],
    company_repo: Annotated[
        CompanyRepo,
        Inject,
    ],
) -> list[Company | None]:
    """Load multiple companies by their IDs."""
    return await company_repo.get_many_by_ids(
        company_ids=company_ids,
    )

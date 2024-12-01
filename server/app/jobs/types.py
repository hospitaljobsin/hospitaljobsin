from collections.abc import Iterable
from datetime import date
from typing import Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry import relay

from app.base.types import BaseNodeType
from app.companies.repositories import CompanyRepo
from app.companies.types import CompanyType
from app.context import Info
from app.database.paginator import PaginatedResult
from app.jobs.documents import Job


@strawberry.type(name="Job")
class JobType(BaseNodeType[Job]):
    title: str
    description: str
    location: str
    salary: str
    closing_date: date

    company_id: strawberry.Private[str]

    @classmethod
    def from_orm(cls, job: Job) -> Self:
        """Construct a node from an ORM instance."""
        return cls(
            id=str(job.id),
            title=job.title,
            description=job.description,
            location=job.location,
            salary=job.salary,
            closing_date=job.closing_date,
            company_id=job.company_id,
        )

    @strawberry.field
    @inject
    async def company(
        self,
        info: Info,
        company_repo: Annotated[
            CompanyRepo,
            Inject,
        ],
    ) -> CompanyType | None:
        company = await info.context["loaders"].company_by_id.load(self.company_id)

        if company is None:
            return None
        return CompanyType.from_orm(company)

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        jobs = await info.context["loaders"].job_by_id.load_many(node_ids)
        return [cls.from_orm(job) if job is not None else job for job in jobs]


@strawberry.type(name="JobConnection")
class JobConnectionType(relay.Connection[JobType]):
    @classmethod
    def from_paginated_result(cls, paginated_result: PaginatedResult[Job, str]) -> Self:
        return cls(
            page_info=relay.PageInfo(
                has_next_page=paginated_result.page_info.has_next_page,
                has_previous_page=paginated_result.page_info.has_previous_page,
                start_cursor=relay.to_base64(
                    JobType,
                    paginated_result.page_info.start_cursor,
                )
                if paginated_result.page_info.start_cursor
                else None,
                end_cursor=relay.to_base64(
                    JobType,
                    paginated_result.page_info.end_cursor,
                )
                if paginated_result.page_info.end_cursor
                else None,
            ),
            edges=[
                relay.Edge(
                    node=JobType.from_orm(job),
                    cursor=relay.to_base64(JobType, job.id),
                )
                for job in paginated_result.entities
            ],
        )

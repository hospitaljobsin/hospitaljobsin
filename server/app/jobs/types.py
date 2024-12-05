from collections.abc import Iterable
from datetime import date, datetime
from typing import Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
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

    created_at: datetime

    company_id: strawberry.Private[str]

    @classmethod
    def marshal(cls, job: Job) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(job.id),
            created_at=job.id.generation_time,
            title=job.title,
            description=job.description,
            location=job.location,
            salary=job.salary,
            closing_date=job.closing_date,
            company_id=job.company.ref.id,
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
        return CompanyType.marshal(company)

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        jobs = await info.context["loaders"].job_by_id.load_many(node_ids)
        return [cls.marshal(job) if job is not None else job for job in jobs]


@strawberry.type(name="JobConnection")
class JobConnectionType(relay.Connection[JobType]):
    @classmethod
    def from_paginated_result(
        cls, paginated_result: PaginatedResult[Job, ObjectId]
    ) -> Self:
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
                    node=JobType.marshal(job),
                    cursor=relay.to_base64(JobType, job.id),
                )
                for job in paginated_result.entities
            ],
        )

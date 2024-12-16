from collections.abc import Iterable
from datetime import datetime
from enum import Enum
from typing import Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import relay

from app.base.types import AddressType, BaseNodeType
from app.companies.documents import Company, Job
from app.companies.repositories import CompanyRepo, JobRepo

# from app.companies.types import CompanyType
from app.context import Info
from app.database.paginator import PaginatedResult


@strawberry.type(name="Company")
class CompanyType(BaseNodeType[Company]):
    name: str
    description: str
    address: AddressType
    phone: str
    website: str
    email: str
    logo_url: str | None

    @classmethod
    def marshal(cls, company: Company) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(company.id),
            name=company.name,
            description=company.description,
            address=AddressType.marshal(company.address),
            phone=company.phone,
            website=company.website,
            email=company.email,
            logo_url=company.logo_url,
        )

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        companies = await info.context["loaders"].company_by_id.load_many(node_ids)
        return [
            cls.marshal(company) if company is not None else company
            for company in companies
        ]

    @strawberry.field
    @inject
    async def jobs(
        self,
        job_repo: Annotated[
            JobRepo,
            Inject,
        ],
        before: relay.GlobalID | None = None,
        after: relay.GlobalID | None = None,
        first: int | None = None,
        last: int | None = None,
    ) -> Annotated["JobConnectionType", strawberry.lazy("app.companies.types")]:
        """Return a paginated connection of jobs for the company."""
        paginated_jobs = await job_repo.get_all_by_company_id(
            company_id=ObjectId(self.id),
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        # Convert to JobConnectionType
        return JobConnectionType.from_paginated_result(paginated_jobs)


@strawberry.type(name="CompanyConnection")
class CompanyConnectionType(relay.Connection[CompanyType]):
    @classmethod
    def from_paginated_result(
        cls, paginated_result: PaginatedResult[Company, str]
    ) -> Self:
        return cls(
            page_info=relay.PageInfo(
                has_next_page=paginated_result.page_info.has_next_page,
                has_previous_page=paginated_result.page_info.has_previous_page,
                start_cursor=relay.to_base64(
                    CompanyType,
                    paginated_result.page_info.start_cursor,
                )
                if paginated_result.page_info.start_cursor
                else None,
                end_cursor=relay.to_base64(
                    CompanyType,
                    paginated_result.page_info.end_cursor,
                )
                if paginated_result.page_info.end_cursor
                else None,
            ),
            edges=[
                relay.Edge(
                    node=CompanyType.marshal(company),
                    cursor=relay.to_base64(CompanyType, company.id),
                )
                for company in paginated_result.entities
            ],
        )


@strawberry.enum(name="JobType")
class JobTypeEnum(Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    INTERNSHIP = "internship"
    CONTRACT = "contract"


@strawberry.enum(name="WorkMode")
class WorkModeEnum(Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    OFFICE = "office"


@strawberry.enum(name="Currency")
class CurrencyEnum(Enum):
    INR = "INR"


@strawberry.type(name="Job")
class JobType(BaseNodeType[Job]):
    title: str
    description: str | None
    category: str
    type: JobTypeEnum
    work_mode: WorkModeEnum

    address: AddressType
    application: str
    skills: list[str]

    currency: CurrencyEnum

    has_salary_range: bool
    min_salary: int | None
    max_salary: int | None

    has_experience_range: bool
    min_experience: int | None
    max_experience: int | None

    updated_at: datetime
    expires_at: datetime | None

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
            category=job.category,
            type=JobTypeEnum[job.type.upper()],
            work_mode=WorkModeEnum[job.work_mode.upper()],
            address=AddressType.marshal(job.address),
            application=job.application,
            skills=job.skills,
            currency=CurrencyEnum[job.currency.upper()],
            has_salary_range=job.has_salary_range,
            min_salary=job.min_salary,
            max_salary=job.max_salary,
            has_experience_range=job.has_experience_range,
            min_experience=job.min_experience,
            max_experience=job.max_experience,
            updated_at=job.updated_at,
            expires_at=job.expires_at,
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

        print("company: ", company)
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

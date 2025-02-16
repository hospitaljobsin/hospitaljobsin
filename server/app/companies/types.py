from collections.abc import Iterable
from datetime import datetime
from enum import Enum
from typing import Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import relay

from app.base.types import (
    AddressType,
    BaseConnectionType,
    BaseEdgeType,
    BaseErrorType,
    BaseNodeType,
)
from app.companies.documents import Company, Job, SavedJob
from app.companies.repositories import JobRepo
from app.context import Info


@strawberry.type(name="Company")
class CompanyType(BaseNodeType[Company]):
    name: str
    slug: str
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
            slug=company.slug,
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
        return JobConnectionType.marshal(paginated_jobs)


@strawberry.type(name="CompanyEdge")
class CompanyEdgeType(BaseEdgeType[CompanyType, Company]):
    @classmethod
    def marshal(cls, company: Company) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=CompanyType.marshal(company),
            cursor=relay.to_base64(CompanyType, company.id),
        )


@strawberry.type(name="CompanyConnection")
class CompanyConnectionType(BaseConnectionType[CompanyType, CompanyEdgeType]):
    node_type = CompanyType
    edge_type = CompanyEdgeType


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
    slug: str
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

    is_saved: bool

    company_id: strawberry.Private[str]

    @classmethod
    def marshal(cls, job: Job) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(job.id),
            slug=job.slug,
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
            company_id=str(job.company.ref.id),
        )

    @strawberry.field
    async def is_saved(self, info: Info) -> bool:
        current_user_id = info.context["current_user_id"]
        if current_user_id is None:
            return False

        saved_job = await info.context["loaders"].saved_job_by_id.load(
            (str(current_user_id), str(self.id))
        )
        return saved_job is not None

    @strawberry.field
    @inject
    async def company(self, info: Info) -> CompanyType | None:
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


@strawberry.type(name="JobEdge")
class JobEdgeType(BaseEdgeType[JobType, Job]):
    @classmethod
    def marshal(cls, job: Job) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=JobType.marshal(job),
            cursor=relay.to_base64(JobType, job.id),
        )


@strawberry.type(name="JobConnection")
class JobConnectionType(BaseConnectionType[JobType, JobEdgeType]):
    node_type = JobType
    edge_type = JobEdgeType


@strawberry.type(name="SavedJobEdge")
class SavedJobEdgeType(BaseEdgeType[JobType, SavedJob]):
    saved_at: datetime

    @classmethod
    def marshal(cls, saved_job: SavedJob) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=JobType.marshal(saved_job.job),
            cursor=relay.to_base64(JobType, saved_job.job.id),
            saved_at=saved_job.id.generation_time,
        )


@strawberry.type(name="SavedJobConnection")
class SavedJobConnectionType(BaseConnectionType[JobType, SavedJobEdgeType]):
    node_type = JobType
    edge_type = SavedJobEdgeType


@strawberry.type
class SaveJobResult:
    saved_job_edge: SavedJobEdgeType


@strawberry.type
class UnsaveJobResult:
    saved_job_edge: SavedJobEdgeType


@strawberry.type(name="JobNotFoundError")
class JobNotFoundErrorType(BaseErrorType):
    message: str = "Job not found!"


@strawberry.type(name="SavedJobNotFoundError")
class SavedJobNotFoundErrorType(BaseErrorType):
    message: str = "Saved job not found!"


@strawberry.type(name="CompanyNotFoundError")
class CompanyNotFoundErrorType(BaseErrorType):
    message: str = "Company not found!"


SaveJobPayload = Annotated[
    SaveJobResult | JobNotFoundErrorType,
    strawberry.union(name="SaveJobPayload"),
]

UnsaveJobPayload = Annotated[
    UnsaveJobResult | SavedJobNotFoundErrorType,
    strawberry.union(name="UnsaveJobPayload"),
]


CompanyPayload = Annotated[
    CompanyType | CompanyNotFoundErrorType,
    strawberry.union(name="CompanyPayload"),
]

JobPayload = Annotated[
    JobType | JobNotFoundErrorType,
    strawberry.union("JobPayload"),
]

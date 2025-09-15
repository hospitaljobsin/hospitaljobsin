from enum import Enum
from typing import Annotated, Self

import strawberry

from app.base.types import BaseConnectionType, BaseEdgeType, BaseNodeType
from app.job_alerts.documents import JobAlert
from app.job_alerts.models import AlertFilters
from app.jobs.types import JobTypeFilterEnum, WorkModeEnum


@strawberry.enum(
    name="JobAlertFrequency",
    description="Job alert frequency type.",
)
class JobAlertFrequencyEnum(Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


@strawberry.input(
    name="AlertFiltersInput",
    description="Filters for the job alert.",
)
class AlertFiltersInput:
    search_term: str | None = strawberry.field(
        default=None,
        description="Search term to filter job listings.",
    )
    location: str | None = strawberry.field(
        default=None,
        description="Location to filter job listings.",
    )
    min_experience: int | None = strawberry.field(
        default=None,
        description="Minimum experience to filter job listings.",
    )
    max_experience: int | None = strawberry.field(
        default=None,
        description="Maximum experience to filter job listings.",
    )
    min_salary: int | None = strawberry.field(
        default=None,
        description="Minimum salary to filter job listings.",
    )
    max_salary: int | None = strawberry.field(
        default=None,
        description="Maximum salary to filter job listings.",
    )
    job_type: list[JobTypeFilterEnum] | None = strawberry.field(
        default=None,
        description="Job types to filter job listings.",
    )
    work_mode: list[WorkModeEnum] | None = strawberry.field(
        default=None,
        description="Work modes to filter job listings.",
    )

    @classmethod
    def to_document(cls, field: Self) -> AlertFilters:
        """Convert to a document."""
        return AlertFilters(
            search_term=field.search_term,
            location=field.location,
            min_experience=field.min_experience,
            max_experience=field.max_experience,
            min_salary=field.min_salary,
            max_salary=field.max_salary,
            job_type=[item.value for item in field.job_type]
            if field.job_type is not None
            else None,
            work_mode=[item.value for item in field.work_mode]
            if field.work_mode is not None
            else None,
        )


@strawberry.type(
    name="AlertFilters",
    description="Filters for the job alert.",
)
class AlertFilters:
    search_term: str | None = strawberry.field(
        default=None,
        description="Search term to filter job listings.",
    )
    location: str | None = strawberry.field(
        default=None,
        description="Location to filter job listings.",
    )
    min_experience: int | None = strawberry.field(
        default=None,
        description="Minimum experience to filter job listings.",
    )
    max_experience: int | None = strawberry.field(
        default=None,
        description="Maximum experience to filter job listings.",
    )
    min_salary: int | None = strawberry.field(
        default=None,
        description="Minimum salary to filter job listings.",
    )
    max_salary: int | None = strawberry.field(
        default=None,
        description="Maximum salary to filter job listings.",
    )
    job_type: list[JobTypeFilterEnum] | None = strawberry.field(
        default=None,
        description="Job types to filter job listings.",
    )
    work_mode: list[WorkModeEnum] | None = strawberry.field(
        default=None,
        description="Work modes to filter job listings.",
    )

    @classmethod
    def marshal(cls, field: AlertFilters) -> Self:
        """Convert to a document."""
        return cls(
            search_term=field.search_term,
            location=field.location,
            min_experience=field.min_experience,
            max_experience=field.max_experience,
            min_salary=field.min_salary,
            max_salary=field.max_salary,
            job_type=[JobTypeFilterEnum(item) for item in field.job_type]
            if field.job_type is not None
            else None,
            work_mode=[WorkModeEnum(item) for item in field.work_mode]
            if field.work_mode is not None
            else None,
        )


@strawberry.type(
    name="JobAlert",
    description="A job alert.",
)
class JobAlertType(BaseNodeType[JobAlert]):
    filters: AlertFilters = strawberry.field(
        description="The filters for the job alert."
    )
    frequency: JobAlertFrequencyEnum = strawberry.field(
        description="The frequency of the job alert."
    )

    @classmethod
    def marshal(cls, data: JobAlert) -> Self:
        return cls(
            id=str(data.id),
            filters=AlertFilters.marshal(data.filters),
            frequency=JobAlertFrequencyEnum(data.frequency),
        )


@strawberry.type(
    name="JobAlertAlreadyExistsError",
    description="Error when the job alert already exists.",
)
class JobAlertAlreadyExistsErrorType:
    message: str = strawberry.field(
        description="The error message.",
        default="A job alert with the same parameters already exists for the user.",
    )


CreateJobAlertPayload = Annotated[
    JobAlertType | JobAlertAlreadyExistsErrorType,
    strawberry.union(
        name="CreateJobAlertPayload",
        description="The create job alert payload.",
    ),
]


@strawberry.type(name="JobAlertEdge")
class JobAlertEdgeType(BaseEdgeType[JobAlertType, JobAlert]):
    pass


@strawberry.type(name="JobAlertConnection")
class JobAlertConnectionType(BaseConnectionType[JobAlertType, JobAlertEdgeType]):
    pass

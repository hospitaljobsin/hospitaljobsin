from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Annotated, Self

import strawberry

from app.base.types import BaseConnectionType, BaseEdgeType, BaseErrorType, BaseNodeType
from app.job_alerts.documents import JobAlert, RecommendedJobAlert
from app.job_alerts.models import AlertFilters
from app.jobs.types import JobTypeFilterEnum, WorkModeEnum

if TYPE_CHECKING:
    from app.accounts.types import AccountType


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
    search_term: str = strawberry.field(
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
class AlertFiltersType:
    search_term: str = strawberry.field(
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
    filters: AlertFiltersType = strawberry.field(
        description="The filters for the job alert."
    )
    frequency: JobAlertFrequencyEnum = strawberry.field(
        description="The frequency of the job alert."
    )
    created_at: datetime = strawberry.field(
        description="The creation time of the job alert."
    )

    last_sent_at: datetime | None = strawberry.field(
        description="The last time the job alert was sent.",
    )

    @classmethod
    def marshal(cls, data: JobAlert) -> Self:
        return cls(
            id=str(data.id),
            filters=AlertFiltersType.marshal(data.filters),
            frequency=JobAlertFrequencyEnum(data.frequency),
            created_at=data.id.generation_time,
            last_sent_at=data.last_sent_at,
        )


@strawberry.type(
    name="RecommendedJobAlert",
    description="A recommended job alert.",
)
class RecommendedJobAlertType(BaseNodeType[RecommendedJobAlert]):
    filters: AlertFiltersType = strawberry.field(
        description="The filters for the job alert."
    )

    @classmethod
    def marshal(cls, data: RecommendedJobAlert) -> Self:
        return cls(
            filters=AlertFiltersType.marshal(data.filters),
        )


@strawberry.type(
    name="JobAlertAlreadyExistsError",
    description="Error when the job alert already exists.",
)
class JobAlertAlreadyExistsErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="The error message.",
        default="A job alert with the same parameters already exists for the user.",
    )


@strawberry.type(
    name="JobAlertNotFoundError",
    description="Error when the job alert is not found.",
)
class JobAlertNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="The error message.",
        default="The job alert was not found.",
    )


@strawberry.type(
    name="MaxJobAlertsReachedError",
    description="Error when the maximum number of job alerts is reached.",
)
class MaxJobAlertsReachedErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="The error message.",
        default="The maximum number of job alerts for the account has been reached.",
    )


CreateJobAlertPayload = Annotated[
    JobAlertType | JobAlertAlreadyExistsErrorType | MaxJobAlertsReachedErrorType,
    strawberry.union(
        name="CreateJobAlertPayload",
        description="The create job alert payload.",
    ),
]


UpdateJobAlertPayload = Annotated[
    JobAlertType | JobAlertAlreadyExistsErrorType | JobAlertNotFoundErrorType,
    strawberry.union(
        name="UpdateJobAlertPayload",
        description="The update job alert payload.",
    ),
]

DeleteJobAlertPayload = Annotated[
    JobAlertType | JobAlertNotFoundErrorType,
    strawberry.union(
        name="DeleteJobAlertPayload",
        description="The delete job alert payload.",
    ),
]


@strawberry.type(name="JobAlertEdge")
class JobAlertEdgeType(BaseEdgeType[JobAlertType, JobAlert]):
    @classmethod
    def marshal(cls, job_alert: JobAlert) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=JobAlertType.marshal(job_alert),
            cursor=strawberry.relay.to_base64(JobAlertType, job_alert.id),
        )


@strawberry.type(name="JobAlertConnection")
class JobAlertConnectionType(BaseConnectionType[JobAlertType, JobAlertEdgeType]):
    pass


@strawberry.type(name="RecommendedJobAlertEdge")
class RecommendedJobAlertEdgeType(
    BaseEdgeType[RecommendedJobAlertType, RecommendedJobAlert]
):
    @classmethod
    def marshal(cls, job_alert: RecommendedJobAlert) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=RecommendedJobAlertType.marshal(job_alert),
            cursor=strawberry.relay.to_base64(JobAlertType, job_alert.id),
        )


@strawberry.type(name="RecommendedJobAlertConnection")
class RecommendedJobAlertConnectionType(
    BaseConnectionType[RecommendedJobAlertType, RecommendedJobAlertEdgeType]
):
    pass


@strawberry.type(
    name="RecommendedJobAlertsNotFoundError",
    description="Error when no recommended job alerts are found for the user.",
)
class RecommendedJobAlertsNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="The error message.",
        default="No recommended job alerts found for the user.",
    )


EnableRecommendedJobAlertsPayload = Annotated[
    Annotated["AccountType", strawberry.lazy("app.accounts.types")]
    | RecommendedJobAlertsNotFoundErrorType,
    strawberry.union(
        name="EnableRecommendedJobAlertsPayload",
        description="The enable recommended job alerts payload.",
    ),
]

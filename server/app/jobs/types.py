from collections.abc import Iterable
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Annotated, Any, Self

import strawberry
from aioinject import Inject, Injected
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import Private, relay
from strawberry.permission import PermissionExtension

from app.accounts.documents import Account
from app.accounts.types import AccountType
from app.auth.permissions import IsAuthenticated
from app.base.types import (
    BaseConnectionType,
    BaseEdgeType,
    BaseErrorType,
    BaseNodeType,
)
from app.context import Info
from app.jobs.documents import (
    ApplicantField,
    ApplicationField,
    Job,
    JobApplicant,
    JobApplicationForm,
    SavedJob,
)
from app.jobs.repositories import JobApplicantRepo, JobMetricRepo
from app.organizations.types import (
    OrganizationAuthorizationErrorType,
    OrganizationNotFoundErrorType,
)

if TYPE_CHECKING:
    from app.organizations.types import OrganizationType


@strawberry.enum(
    name="JobType",
    description="The type of job.",
)
class JobTypeEnum(Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    INTERNSHIP = "internship"
    CONTRACT = "contract"


@strawberry.enum(
    name="WorkMode",
    description="The work mode of the job.",
)
class WorkModeEnum(Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    OFFICE = "office"


@strawberry.enum(
    name="Currency",
    description="The currency of the amount.",
)
class CurrencyEnum(Enum):
    INR = "INR"


@strawberry.input(
    name="ApplicationFieldInput",
    description="An application field belonging to a job application form input.",
)
class ApplicationFieldInputType:
    field_name: str = strawberry.field(
        description="The name of the field.",
    )
    default_value: str | None = strawberry.field(
        description="The default value of the field.",
    )
    is_required: bool = strawberry.field(
        description="Whether the field is required.",
        default=False,
    )

    @classmethod
    def to_document(cls, field: Self) -> ApplicationField:
        """Convert to a document."""
        return ApplicationField(
            field_name=field.field_name,
            default_value=field.default_value,
            is_required=field.is_required,
        )


@strawberry.type(
    name="ApplicationField",
    description="An application field belonging to a job application form.",
)
class ApplicationFieldType:
    field_name: str = strawberry.field(
        description="The name of the field.",
    )
    default_value: str | None = strawberry.field(
        description="The default value of the field.",
    )
    is_required: bool = strawberry.field(
        description="Whether the field is required.",
        default=False,
    )

    @classmethod
    def marshal(cls, field: ApplicationField) -> Self:
        """Marshal into a node instance."""
        return cls(
            field_name=field.field_name,
            default_value=field.default_value,
            is_required=field.is_required,
        )


@strawberry.input(
    name="ApplicantFieldInput",
    description="An applicant field belonging to a job applicant input.",
)
class ApplicantFieldInputType:
    field_name: str = strawberry.field(
        description="The name of the field.",
    )
    field_value: str = strawberry.field(
        description="The value of the field.",
    )

    @classmethod
    def to_document(cls, field: Self) -> ApplicantField:
        """Convert to a document."""
        return ApplicantField(
            field_name=field.field_name,
            field_value=field.field_value,
        )


@strawberry.type(
    name="ApplicantField",
    description="An applicant field belonging to a job applicant.",
)
class ApplicantFieldType:
    field_name: str = strawberry.field(
        description="The name of the field.",
    )
    field_value: str = strawberry.field(
        description="The value of the field.",
    )

    @classmethod
    def marshal(cls, applicant_field: ApplicantField) -> Self:
        """Convert to a document."""
        return cls(
            field_name=applicant_field.field_name,
            field_value=applicant_field.field_value,
        )


@strawberry.type(
    name="JobApplicationForm",
    description="A custom application form belonging to a job posting.",
)
class JobApplicationFormType(BaseNodeType[JobApplicationForm]):
    fields: list[ApplicationFieldType] = strawberry.field(
        description="The fields of the application form.",
    )

    @classmethod
    def marshal(cls, application_form: JobApplicationForm) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(application_form.id),
            fields=[
                ApplicationFieldType.marshal(field) for field in application_form.fields
            ],
        )


@strawberry.enum(
    name="JobApplicantStatus",
    description="The status of the job application.",
)
class JobApplicantStatusEnum(Enum):
    APPLIED = "APPLIED"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEWED = "INTERVIEWED"
    ONHOLD = "ONHOLD"
    OFFERED = "OFFERED"


@strawberry.type(
    name="JobApplicant",
    description="A job application for a posting.",
)
class JobApplicantType(BaseNodeType[JobApplicant]):
    status: JobApplicantStatusEnum = strawberry.field(
        description="The status of the job application.",
    )
    slug: str = strawberry.field(
        description="The slug of the job application.",
    )
    applicant_fields: list[ApplicantFieldType] = strawberry.field(
        description="The fields of the job application.",
    )

    resume_url: str = strawberry.field(
        description="The URL of the resume.",
    )

    _account: Private[Account | ObjectId]

    _job: Private[Job | ObjectId]

    @strawberry.field(  # type: ignore[misc]
        description="The account of the job applicant.",
    )
    @inject
    async def account(self, info: Info) -> AccountType | None:
        if isinstance(self._account, ObjectId):
            account = await info.context["loaders"].account_by_id.load(
                str(self._account)
            )

            if account is None:
                return None
            return AccountType.marshal(account)
        return AccountType.marshal(self._account)

    @strawberry.field(  # type: ignore[misc]
        description="The job of the job applicant.",
    )
    @inject
    async def job(
        self, info: Info
    ) -> Annotated["JobType", strawberry.lazy("app.jobs.types")] | None:
        if isinstance(self._job, ObjectId):
            job = await info.context["loaders"].job_by_id.load(str(self._job))

            if job is None:
                return None
            return JobType.marshal(job)
        return JobType.marshal(self._job)

    @classmethod
    def marshal_with_links(cls, job_applicant: JobApplicant) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(job_applicant.id),
            _account=job_applicant.account,
            _job=job_applicant.job,
            slug=job_applicant.slug,
            status=JobApplicantStatusEnum[job_applicant.status.upper()],
            applicant_fields=[
                ApplicantFieldType.marshal(field)
                for field in job_applicant.applicant_fields
            ],
            resume_url=job_applicant.resume_url,
        )

    @classmethod
    def marshal(cls, job_applicant: JobApplicant) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(job_applicant.id),
            _account=job_applicant.account.ref.id,
            _job=job_applicant.job.ref.id,
            slug=job_applicant.slug,
            status=JobApplicantStatusEnum[job_applicant.status.upper()],
            applicant_fields=[
                ApplicantFieldType.marshal(field)
                for field in job_applicant.applicant_fields
            ],
            resume_url=job_applicant.resume_url,
        )

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        job_applicants = await info.context["loaders"].job_applicant_by_id.load_many(
            node_ids
        )
        return [
            cls.marshal(job_applicant) if job_applicant is not None else job_applicant
            for job_applicant in job_applicants
        ]


@strawberry.type(name="JobApplicantEdge")
class JobApplicantEdgeType(BaseEdgeType[JobApplicantType, JobApplicant]):
    @classmethod
    def marshal(cls, job_applicant: JobApplicant) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=JobApplicantType.marshal_with_links(job_applicant),
            cursor=relay.to_base64(JobApplicantType, job_applicant.id),
        )


@strawberry.type(name="JobApplicantConnection")
class JobApplicantConnectionType(
    BaseConnectionType[JobApplicantType, JobApplicantEdgeType]
):
    pass


@strawberry.type(
    name="JobApplicantNotFoundError",
    description="Used when the job applicant is not found.",
)
class JobApplicantNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Job applicant not found!",
    )


@strawberry.type(
    name="JobMetricPoint",
    description="A metric point belonging to a series of job metrics.",
)
class JobMetricPointType:
    timestamp: datetime = strawberry.field(
        description="The timestamp of the job metric point."
    )
    count: int = strawberry.field(
        description="The count of the job metric point.",
    )

    @classmethod
    def marshal(cls, metric_point: dict[str, Any]) -> Self:
        return cls(
            timestamp=metric_point.get("timestamp"),
            count=metric_point.get("count"),
        )


@strawberry.type(
    name="JobApplicantCount",
    description="Application count data of a job.",
)
class JobApplicantCountType:
    applied: int = strawberry.field(
        description="The number of applicants in applied status for the job.",
    )
    shortlisted: int = strawberry.field(
        description="The number of applicants in shortlisted status for the job.",
    )
    interviewed: int = strawberry.field(
        description="The number of applicants in interviewed status for the job.",
    )
    on_hold: int = strawberry.field(
        description="The number of applicants in onhold status for the job.",
    )
    offered: int = strawberry.field(
        description="The number of applicants in offered status for the job.",
    )

    @classmethod
    def marshal(cls, metric_point: dict[str, int]) -> Self:
        return cls(
            applied=metric_point.get("applied", 0),
            shortlisted=metric_point.get("shortlisted", 0),
            interviewed=metric_point.get("interviewed", 0),
            on_hold=metric_point.get("on_hold", 0),
            offered=metric_point.get("offered", 0),
        )


@strawberry.type(
    name="Job",
    description="A job posting.",
)
class JobType(BaseNodeType[Job]):
    title: str = strawberry.field(
        description="The title of the job.",
    )
    slug: str = strawberry.field(
        description="The slug of the job.",
    )
    description: str | None = strawberry.field(
        description="The description of the job.",
    )
    vacancies: int | None = strawberry.field(
        description="The number of vacancies for the job.",
    )
    type: JobTypeEnum | None = strawberry.field(
        description="The type of the job.",
    )
    work_mode: WorkModeEnum | None = strawberry.field(
        description="The work mode of the job.",
    )

    location: str | None = strawberry.field(
        description="The location of the job.",
    )

    skills: list[str] = strawberry.field(
        description="The skills required for the job.",
    )

    currency: CurrencyEnum = strawberry.field(
        description="The currency of the salary.",
    )

    min_salary: int | None = strawberry.field(
        description="The minimum salary of the job.",
    )
    max_salary: int | None = strawberry.field(
        description="The maximum salary of the job.",
    )

    min_experience: int | None = strawberry.field(
        description="The minimum experience required for the job.",
    )
    max_experience: int | None = strawberry.field(
        description="The maximum experience required for the job.",
    )

    is_active: bool = strawberry.field(
        description="Whether the job is active.",
    )

    updated_at: datetime = strawberry.field(
        description="When the job was last updated at.",
    )
    expires_at: datetime | None = strawberry.field(
        description="The expiry time of the job.",
    )

    created_at: datetime = strawberry.field(
        description="When the job was created at.",
    )

    external_application_url: str | None = strawberry.field(
        description="The external application URL for the job.",
    )

    organization_id: strawberry.Private[str]

    @classmethod
    def marshal(cls, job: Job) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(job.id),
            slug=job.slug,
            created_at=job.id.generation_time,
            title=job.title,
            description=job.description,
            vacancies=job.vacancies,
            type=JobTypeEnum[job.type.upper()] if job.type else None,
            work_mode=WorkModeEnum[job.work_mode.upper()] if job.work_mode else None,
            location=job.location,
            skills=job.skills,
            currency=CurrencyEnum[job.currency.upper()],
            min_salary=job.min_salary,
            max_salary=job.max_salary,
            min_experience=job.min_experience,
            max_experience=job.max_experience,
            updated_at=job.updated_at,
            expires_at=job.expires_at,
            is_active=job.is_active,
            external_application_url=job.external_application_url,
            organization_id=str(job.organization.ref.id),
        )

    @strawberry.field(  # type: ignore[misc]
        description="Whether the job has a salary range.",
    )
    def has_salary_range(self) -> bool:
        return self.min_salary is not None and self.max_salary is not None

    @strawberry.field(  # type: ignore[misc]
        description="Whether the job has an experience range.",
    )
    def has_experience_range(self) -> bool:
        return self.min_experience is not None and self.max_experience is not None

    @strawberry.field(  # type: ignore[misc]
        description="The applicants for the job.",
    )
    @inject
    async def applicants(
        self,
        job_applicant_repo: Annotated[
            JobApplicantRepo,
            Inject,
        ],
        search_term: Annotated[
            str | None,
            strawberry.argument(
                description="The search (query) term",
            ),
        ] = None,
        status: Annotated[JobApplicantStatusEnum | None, strawberry.argument()] = None,
        before: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items after the given cursor.",
            ),
        ] = None,
        first: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return after the cursor?",
            ),
        ] = None,
        last: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return before the cursor?",
            ),
        ] = None,
    ) -> JobApplicantConnectionType:
        """Return a paginated connection of invites for the organization."""
        paginated_invites = await job_applicant_repo.get_all_by_job_id(
            job_id=ObjectId(self.id),
            search_term=search_term,
            status=status.value.lower() if status else None,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        return JobApplicantConnectionType.marshal(paginated_invites)

    @strawberry.field(  # type: ignore[misc]
        description="Viewer count for the job, filtered by time.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    # TODO: ensure only org members can view this field
                ]
            )
        ],
    )
    @inject
    async def view_count(
        self,
        job_metric_repo: Injected[JobMetricRepo],
        start_date: Annotated[
            datetime | None,
            strawberry.argument(
                description="Start date for filtering the view count.",
            ),
        ] = None,
        end_date: Annotated[
            datetime | None,
            strawberry.argument(
                description="End date for filtering the view count.",
            ),
        ] = None,
    ) -> int:
        return await job_metric_repo.get_count(
            job_id=ObjectId(self.id),
            event_type="view",
            start_date=start_date,
            end_date=end_date,
        )

    @strawberry.field(  # type: ignore[misc]
        description="View metric points for the job, filtered by time.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    # TODO: ensure only org members can view this field
                ]
            )
        ],
    )
    @inject
    async def view_metric_points(
        self,
        job_metric_repo: Injected[JobMetricRepo],
    ) -> list[JobMetricPointType]:
        metric_points = await job_metric_repo.get_metric_points(
            job_id=ObjectId(self.id),
            event_type="view",
        )
        return [JobMetricPointType.marshal(point) for point in metric_points]

    @strawberry.field(  # type: ignore[misc]
        description="Whether the job is saved by the current user.",
    )
    async def is_saved(self, info: Info) -> bool:
        current_user = info.context["current_user"]
        if current_user is None:
            return False

        saved_job = await info.context["loaders"].saved_job_by_id.load(
            (str(current_user.id), str(self.id))
        )
        return saved_job is not None

    @strawberry.field(  # type: ignore[misc]
        description="Whether the current user has applied to the job already.",
    )
    @inject
    async def is_applied(
        self, info: Info, job_applicant_repo: Injected[JobApplicantRepo]
    ) -> bool:
        """Get the number of applications for the job."""
        current_user = info.context["current_user"]
        if current_user is None:
            return False

        return (
            await job_applicant_repo.get(
                account_id=current_user.id, job_id=ObjectId(self.id)
            )
            is not None
        )

    @strawberry.field(  # type: ignore[misc]
        description="The number of applications for the job.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    # TODO: ensure only org members can view this field
                ]
            )
        ],
    )
    @inject
    async def applicant_count(
        self,
        info: Info,
    ) -> JobApplicantCountType | None:
        """Get the number of applications for the job."""
        applicant_count = await info.context["loaders"].applicant_count_by_job_id.load(
            str(self.id)
        )

        if not applicant_count:
            return None

        return JobApplicantCountType.marshal(applicant_count)

    @strawberry.field(  # type: ignore[misc]
        description="The custom application form for the job.",
    )
    async def application_form(self, info: Info) -> JobApplicationFormType | None:
        """Get the custom application form for the job."""
        application_form = await info.context[
            "loaders"
        ].job_application_form_by_id.load(str(self.id))
        if not application_form:
            return None
        return JobApplicationFormType.marshal(application_form)

    @strawberry.field(  # type: ignore[misc]
        description="Get a job applicant by slug.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    # TODO: ensure only org members can view this field
                ]
            )
        ],
    )
    @inject
    async def job_applicant(
        self,
        info: Info,
        slug: Annotated[
            str,
            strawberry.argument(
                description="The slug of the job applicant.",
            ),
        ],
    ) -> JobApplicantType | JobApplicantNotFoundErrorType:
        job_applicant = await info.context["loaders"].job_applicant_by_slug.load(slug)

        if job_applicant is None or job_applicant.job.ref.id != ObjectId(self.id):
            # ensure the job applicant belongs to the job
            return JobApplicantNotFoundErrorType()
        return JobApplicantType.marshal(job_applicant)

    @strawberry.field(  # type: ignore[misc]
        description="The organization of the job.",
    )
    @inject
    async def organization(
        self, info: Info
    ) -> (
        Annotated[
            "OrganizationType",
            strawberry.lazy("app.organizations.types"),
        ]
        | None
    ):
        from app.organizations.types import OrganizationType

        organization = await info.context["loaders"].organization_by_id.load(
            self.organization_id
        )

        if organization is None:
            return None
        return OrganizationType.marshal(organization)

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
    pass


@strawberry.type(name="SavedJobEdge")
class SavedJobEdgeType(BaseEdgeType[JobType, SavedJob]):
    saved_at: datetime = strawberry.field(
        description="When the job was saved at by the current user.",
    )

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
    pass


@strawberry.type(
    description="Save job success.",
)
class SaveJobSuccess:
    saved_job_edge: SavedJobEdgeType = strawberry.field(
        description="The edge of the saved job.",
    )


@strawberry.type(
    description="Unsave job success.",
)
class UnsaveJobSuccess:
    saved_job_edge: SavedJobEdgeType = strawberry.field(
        description="The edge of the unsaved job.",
    )


@strawberry.type(
    name="JobNotFoundError",
    description="Used when the job is not found.",
)
class JobNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Job not found!",
    )


@strawberry.type(
    name="SavedJobNotFoundError",
    description="Used when a saved job is not found.",
)
class SavedJobNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Saved job not found!",
    )


@strawberry.type(
    name="JobIsExternalError",
    description="Used when the job is externally handled.",
)
class JobIsExternalErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Job is externally handled!",
    )


SaveJobPayload = Annotated[
    SaveJobSuccess | JobNotFoundErrorType,
    strawberry.union(
        name="SaveJobPayload",
        description="The save job payload.",
    ),
]

UnsaveJobPayload = Annotated[
    UnsaveJobSuccess | SavedJobNotFoundErrorType,
    strawberry.union(
        name="UnsaveJobPayload",
        description="The unsave job payload.",
    ),
]


@strawberry.type(
    name="CreateJobSuccess",
    description="Used when the job is created successfully.",
)
class CreateJobSuccessType:
    job_edge: JobEdgeType = strawberry.field(
        description="The edge of the created job.",
    )


CreateJobPayload = Annotated[
    CreateJobSuccessType
    | OrganizationNotFoundErrorType
    | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="CreateJobPayload",
        description="The create job payload.",
    ),
]


@strawberry.type(
    name="UpdateJobApplicationFormSuccess",
    description="Used when the job application form is updated successfully.",
)
class UpdateJobApplicationFormSuccessType:
    job: JobType = strawberry.field(
        description="The updated job.",
    )
    job_application_form: JobApplicationFormType = strawberry.field(
        description="The updated job application form.",
    )


UpdateJobApplicationFormPayload = Annotated[
    UpdateJobApplicationFormSuccessType
    | JobNotFoundErrorType
    | OrganizationAuthorizationErrorType
    | JobIsExternalErrorType,
    strawberry.union(
        name="UpdateJobApplicationFormPayload",
        description="The update job application form payload.",
    ),
]

JobPayloadType = strawberry.union(
    "JobPayload",
    types=(JobType, JobNotFoundErrorType),
    description="The job payload.",
)


@strawberry.type(
    name="JobApplicationFormNotFoundError",
    description="Used when the job application form is not found.",
)
class JobApplicationFormNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Job application form not found!",
    )


PublishJobPayload = Annotated[
    JobType
    | JobNotFoundErrorType
    | OrganizationAuthorizationErrorType
    | JobApplicationFormNotFoundErrorType,
    strawberry.union(
        name="PublishJobPayload",
        description="The publish job payload.",
    ),
]


@strawberry.type(
    name="JobNotPublishedError",
    description="Used when the job is not yet published.",
)
class JobNotPublishedErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Job is not yet published!",
    )


UnpublishJobPayload = Annotated[
    JobType
    | JobNotFoundErrorType
    | OrganizationAuthorizationErrorType
    | JobNotPublishedErrorType,
    strawberry.union(
        name="UnpublishJobPayload",
        description="The unpublish job payload.",
    ),
]


@strawberry.type(
    name="UpdateJobSuccess",
    description="Used when the job is updated successfully.",
)
class UpdateJobSuccessType:
    job: JobType = strawberry.field(
        description="The updated job.",
    )


UpdateJobPayload = Annotated[
    UpdateJobSuccessType | JobNotFoundErrorType | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="UpdateJobPayload",
        description="The update job payload.",
    ),
]


@strawberry.type(
    name="CreateJobApplicantSuccess",
    description="Used when a job application is created successfully.",
)
class CreateJobApplicantSuccessType:
    job_applicant: JobApplicantType = strawberry.field(
        description="The created job application.",
    )


@strawberry.type(
    name="JobApplicantAlreadyExistsError",
    description="Used when the job applicant already exists.",
)
class JobApplicantAlreadyExistsErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Job applicant already exists!",
    )


CreateJobApplicantPayload = Annotated[
    CreateJobApplicantSuccessType
    | JobNotFoundErrorType
    | JobNotPublishedErrorType
    | JobApplicantAlreadyExistsErrorType
    | JobIsExternalErrorType,
    strawberry.union(
        name="CreateJobApplicantPayload",
        description="The create job application payload.",
    ),
]


DeleteJobPayload = Annotated[
    JobType | JobNotFoundErrorType | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="DeleteJobPayload",
        description="The delete job payload.",
    ),
]


@strawberry.type(
    name="CreateJobApplicantResumePresignedURLPayload",
    description="The payload for creating a presigned URL for uploading the job applicant's resume.",
)
class CreateJobApplicantResumePresignedURLPayloadType:
    presigned_url: str = strawberry.field(
        description="The presigned URL for uploading the job applicant's resume.",
    )

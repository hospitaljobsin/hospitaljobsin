from datetime import datetime
from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from result import Err, Ok
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.accounts.exceptions import AccountProfileIncompleteError
from app.auth.permissions import IsAuthenticated, RequiresSudoMode
from app.context import AuthInfo, Info
from app.jobs.exceptions import (
    AccountProfileNotFoundError,
    InsufficientActiveVacanciesError,
    InvalidApplicantLocationsError,
    InvalidLocationError,
    JobApplicantAlreadyExistsError,
    JobApplicantsNotFoundError,
    JobIsExternalError,
    JobNotFoundError,
    JobNotPublishedError,
    OrganizationNotFoundError,
    SavedJobNotFoundError,
)
from app.jobs.services import (
    JobApplicantService,
    JobApplicationFormService,
    JobService,
    SavedJobService,
)
from app.organizations.exceptions import (
    OrganizationAuthorizationError,
)
from app.organizations.types import (
    OrganizationAuthorizationErrorType,
    OrganizationNotFoundErrorType,
)

from .types import (
    AccountProfileIncompleteErrorType,
    AccountProfileNotFoundErrorType,
    ApplicantFieldInputType,
    ApplicationFieldInputType,
    CreateJobApplicantPayload,
    CreateJobApplicantResumePresignedURLPayloadType,
    CreateJobApplicantSuccessType,
    CreateJobPayload,
    CreateJobSuccessType,
    DeleteJobPayload,
    InsufficientActiveVacanciesErrorType,
    InvalidApplicantLocationsErrorType,
    InvalidLocationErrorType,
    JobApplicantAlreadyExistsErrorType,
    JobApplicantsNotFoundErrorType,
    JobApplicantStatusEnum,
    JobApplicantType,
    JobApplicationFormType,
    JobEdgeType,
    JobIsExternalErrorType,
    JobNotFoundErrorType,
    JobNotPublishedErrorType,
    JobType,
    JobTypeEnum,
    LogJobViewPayloadType,
    PublishJobPayload,
    SavedJobEdgeType,
    SavedJobNotFoundErrorType,
    SaveJobPayload,
    SaveJobSuccess,
    UnpublishJobPayload,
    UnsaveJobPayload,
    UnsaveJobSuccess,
    UpdateJobApplicantsStatusPayload,
    UpdateJobApplicantsStatusSuccessType,
    UpdateJobApplicationFormPayload,
    UpdateJobApplicationFormSuccessType,
    UpdateJobPayload,
    UpdateJobSuccessType,
    WorkModeEnum,
)


@strawberry.type
class JobMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=SaveJobPayload,
        description="Save a job.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def save_job(
        self,
        info: AuthInfo,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to save.",
            ),
        ],
        saved_job_service: Annotated[SavedJobService, Inject],
    ) -> SaveJobPayload:
        """Save a job."""
        match await saved_job_service.save_job(
            account_id=info.context["current_user"].id,
            job_id=job_id.node_id,
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case JobNotFoundError():
                        return JobNotFoundErrorType()
            case Ok(saved_job):
                return SaveJobSuccess(
                    saved_job_edge=SavedJobEdgeType.marshal(
                        saved_job,
                    ),
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UnsaveJobPayload,
        description="Save a job.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def unsave_job(
        self,
        info: AuthInfo,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to unsave.",
            ),
        ],
        saved_job_service: Annotated[SavedJobService, Inject],
    ) -> UnsaveJobPayload:
        """Save a job."""
        match await saved_job_service.unsave_job(
            account_id=info.context["current_user"].id,
            job_id=job_id.node_id,
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case SavedJobNotFoundError():
                        return SavedJobNotFoundErrorType()
            case Ok(saved_job):
                return UnsaveJobSuccess(
                    saved_job_edge=SavedJobEdgeType.marshal(
                        saved_job,
                    ),
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateJobPayload,
        description="Create a new job.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def create_job(
        self,
        info: AuthInfo,
        job_service: Annotated[JobService, Inject],
        *,
        organization_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the organization to create the job under.",
            ),
        ],
        title: Annotated[
            str,
            strawberry.argument(
                description="The title of the job.",
            ),
        ],
        description: Annotated[
            str,
            strawberry.argument(
                description="The description of the job.",
            ),
        ],
        skills: Annotated[
            list[str],
            strawberry.argument(
                description="The skills required for the job.",
            ),
        ],
        location: Annotated[
            str | None,
            strawberry.argument(
                description="The location of the job.",
            ),
        ],
        applicant_locations: Annotated[
            list[str],
            strawberry.argument(
                description="The applicant locations for the job.",
            ),
        ],
        external_application_url: Annotated[
            str | None,
            strawberry.argument(
                description="The external application URL for the job.",
            ),
        ] = None,
        vacancies: Annotated[
            int | None,
            strawberry.argument(
                description="The number of vacancies for the job.",
            ),
        ] = None,
        min_salary: Annotated[
            int | None,
            strawberry.argument(
                description="The minimum salary of the job.",
            ),
        ] = None,
        max_salary: Annotated[
            int | None,
            strawberry.argument(
                description="The maximum salary of the job.",
            ),
        ] = None,
        is_salary_negotiable: Annotated[
            bool,
            strawberry.argument(
                description="Whether the salary is negotiable.",
            ),
        ] = False,
        min_experience: Annotated[
            int | None,
            strawberry.argument(
                description="The minimum experience of the job.",
            ),
        ] = None,
        max_experience: Annotated[
            int | None,
            strawberry.argument(
                description="The maximum experience of the job.",
            ),
        ] = None,
        expires_at: Annotated[
            datetime | None,
            strawberry.argument(
                description="The expiration date of the job.",
            ),
        ] = None,
        job_type: Annotated[
            JobTypeEnum | None,
            strawberry.argument(
                description="The type of the job.",
            ),
        ] = None,
        work_mode: Annotated[
            WorkModeEnum | None,
            strawberry.argument(
                description="The work mode of the job.",
            ),
        ] = None,
        currency: Annotated[
            str,
            strawberry.argument(
                description="The currency of the job.",
            ),
        ] = "INR",
    ) -> CreateJobPayload:
        """Create a new job."""
        match await job_service.create(
            account=info.context["current_user"],
            organization_id=organization_id.node_id,
            title=title,
            description=description,
            location=location,
            applicant_locations=applicant_locations,
            vacancies=vacancies,
            min_salary=min_salary,
            max_salary=max_salary,
            is_salary_negotiable=is_salary_negotiable,
            min_experience=min_experience,
            max_experience=max_experience,
            expires_at=expires_at,
            job_type=job_type.value if job_type else None,
            work_mode=work_mode.value if work_mode else None,
            skills=skills,
            currency=currency,
            external_application_url=external_application_url,
        ):
            case Err(error):
                match error:
                    case OrganizationNotFoundError():
                        return OrganizationNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
                    case InvalidLocationError():
                        return InvalidLocationErrorType()
                    case InvalidApplicantLocationsError():
                        return InvalidApplicantLocationsErrorType()
            case Ok(job):
                return CreateJobSuccessType(
                    job_edge=JobEdgeType.marshal(job),
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateJobPayload,
        description="Update a job.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_job(
        self,
        info: AuthInfo,
        job_service: Annotated[JobService, Inject],
        *,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to update.",
            ),
        ],
        title: Annotated[
            str,
            strawberry.argument(
                description="The title of the job.",
            ),
        ],
        description: Annotated[
            str,
            strawberry.argument(
                description="The description of the job.",
            ),
        ],
        location: Annotated[
            str | None,
            strawberry.argument(
                description="The location of the job.",
            ),
        ],
        skills: Annotated[
            list[str],
            strawberry.argument(
                description="The skills required for the job.",
            ),
        ],
        applicant_locations: Annotated[
            list[str],
            strawberry.argument(
                description="The applicant locations for the job.",
            ),
        ],
        vacancies: Annotated[
            int | None,
            strawberry.argument(
                description="The number of vacancies for the job.",
            ),
        ] = None,
        min_salary: Annotated[
            int | None,
            strawberry.argument(
                description="The minimum salary of the job.",
            ),
        ] = None,
        max_salary: Annotated[
            int | None,
            strawberry.argument(
                description="The maximum salary of the job.",
            ),
        ] = None,
        is_salary_negotiable: Annotated[
            bool,
            strawberry.argument(
                description="Whether the salary is negotiable.",
            ),
        ] = False,
        min_experience: Annotated[
            int | None,
            strawberry.argument(
                description="The minimum experience of the job.",
            ),
        ] = None,
        max_experience: Annotated[
            int | None,
            strawberry.argument(
                description="The maximum experience of the job.",
            ),
        ] = None,
        expires_at: Annotated[
            datetime | None,
            strawberry.argument(
                description="The expiration date of the job.",
            ),
        ] = None,
        job_type: Annotated[
            JobTypeEnum | None,
            strawberry.argument(
                description="The type of the job.",
            ),
        ] = None,
        work_mode: Annotated[
            WorkModeEnum | None,
            strawberry.argument(
                description="The work mode of the job.",
            ),
        ] = None,
        currency: Annotated[
            str,
            strawberry.argument(
                description="The currency of the job.",
            ),
        ] = "INR",
    ) -> UpdateJobPayload:
        """Update a job."""
        match await job_service.update(
            account=info.context["current_user"],
            job_id=job_id.node_id,
            title=title,
            description=description,
            location=location,
            applicant_locations=applicant_locations,
            vacancies=vacancies,
            min_salary=min_salary,
            max_salary=max_salary,
            is_salary_negotiable=is_salary_negotiable,
            min_experience=min_experience,
            max_experience=max_experience,
            expires_at=expires_at,
            job_type=job_type.value if job_type else None,
            work_mode=work_mode.value if work_mode else None,
            skills=skills,
            currency=currency,
        ):
            case Err(error):
                match error:
                    case JobNotFoundError():
                        return JobNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
                    case InvalidLocationError():
                        return InvalidLocationErrorType()
                    case InvalidApplicantLocationsError():
                        return InvalidApplicantLocationsErrorType()
            case Ok(job):
                return UpdateJobSuccessType(
                    job=JobType.marshal(job),
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateJobApplicationFormPayload,
        description="Update job application form.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_job_application_form(
        self,
        info: AuthInfo,
        job_application_form_service: Annotated[JobApplicationFormService, Inject],
        *,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to update the application form for.",
            ),
        ],
        fields: Annotated[
            list[ApplicationFieldInputType],
            strawberry.argument(
                description="The fields required for the job application form.",
            ),
        ],
    ) -> UpdateJobApplicationFormPayload:
        """Update job application form."""
        match await job_application_form_service.update(
            account=info.context["current_user"],
            job_id=job_id.node_id,
            fields=[ApplicationFieldInputType.to_document(field) for field in fields],
        ):
            case Err(error):
                match error:
                    case JobNotFoundError():
                        return JobNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
                    case JobIsExternalError():
                        return JobIsExternalErrorType()
            case Ok(result):
                (job_application_form, job) = result
                return UpdateJobApplicationFormSuccessType(
                    job=JobType.marshal(job),
                    job_application_form=JobApplicationFormType.marshal(
                        job_application_form
                    ),
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=PublishJobPayload,
        description="Make a job active.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def publish_job(
        self,
        info: AuthInfo,
        job_service: Annotated[JobService, Inject],
        *,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to activate.",
            ),
        ],
    ) -> PublishJobPayload:
        """Make a job active."""
        match await job_service.publish(
            account=info.context["current_user"],
            job_id=job_id.node_id,
        ):
            case Err(error):
                match error:
                    case JobNotFoundError():
                        return JobNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
                    case InsufficientActiveVacanciesError():
                        return InsufficientActiveVacanciesErrorType()
            case Ok(job):
                return JobType.marshal(job)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UnpublishJobPayload,
        description="Make a job inactive.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def unpublish_job(
        self,
        info: AuthInfo,
        job_service: Annotated[JobService, Inject],
        *,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to activate.",
            ),
        ],
    ) -> UnpublishJobPayload:
        """Make a job inactive."""
        match await job_service.unpublish(
            account=info.context["current_user"],
            job_id=job_id.node_id,
        ):
            case Err(error):
                match error:
                    case JobNotFoundError():
                        return JobNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
                    case JobNotPublishedError():
                        return JobNotPublishedErrorType()
            case Ok(job):
                return JobType.marshal(job)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateJobApplicantPayload,
        description="Create a job applicant.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def create_job_application(
        self,
        info: AuthInfo,
        job_application_service: Annotated[JobApplicantService, Inject],
        *,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to apply for.",
            ),
        ],
        applicant_fields: Annotated[
            list[ApplicantFieldInputType],
            strawberry.argument(
                description="The fields required by the job's application form.",
            ),
        ],
    ) -> CreateJobApplicantPayload:
        """Create a job applicant."""
        match await job_application_service.create(
            account=info.context["current_user"],
            job_id=job_id.node_id,
            applicant_fields=[
                ApplicantFieldInputType.to_document(field) for field in applicant_fields
            ],
            request=info.context["request"],
        ):
            case Err(error):
                match error:
                    case JobNotFoundError():
                        return JobNotFoundErrorType()
                    case JobNotPublishedError():
                        return JobNotPublishedErrorType()
                    case JobApplicantAlreadyExistsError():
                        return JobApplicantAlreadyExistsErrorType()
                    case JobIsExternalError():
                        return JobIsExternalErrorType()
                    case AccountProfileNotFoundError():
                        return AccountProfileNotFoundErrorType()
                    case AccountProfileIncompleteError():
                        return AccountProfileIncompleteErrorType()
            case Ok(job_application):
                return CreateJobApplicantSuccessType(
                    job_applicant=JobApplicantType.marshal(job_application)
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateJobApplicantsStatusPayload,
        description="Bulk update status of job applicants.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_job_applicants_status(
        self,
        info: AuthInfo,
        job_application_service: Annotated[JobApplicantService, Inject],
        *,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to apply for.",
            ),
        ],
        job_applicant_ids: Annotated[
            list[relay.GlobalID],
            strawberry.argument(
                description="The IDs of the job applicants to update the status of.",
            ),
        ],
        status: Annotated[
            JobApplicantStatusEnum,
            strawberry.argument(
                description="The status to update the job applicants to.",
            ),
        ],
    ) -> UpdateJobApplicantsStatusPayload:
        """Bulk update status of job applicants."""
        match await job_application_service.bulk_update_status(
            account=info.context["current_user"],
            job_id=job_id.node_id,
            job_applicant_ids=[
                job_applicant_id.node_id for job_applicant_id in job_applicant_ids
            ],
            status=status.value.lower(),
        ):
            case Err(error):
                match error:
                    case JobNotFoundError():
                        return JobNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
                    case JobIsExternalError():
                        return JobIsExternalErrorType()
                    case JobApplicantsNotFoundError() as err:
                        return JobApplicantsNotFoundErrorType(
                            not_found_ids=err.not_found_ids,
                        )
            case Ok(job_applicants):
                return UpdateJobApplicantsStatusSuccessType(
                    job_applicants=[
                        JobApplicantType.marshal(job_applicant)
                        for job_applicant in job_applicants
                    ]
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DeleteJobPayload,
        description="Delete a job.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def delete_job(
        self,
        info: AuthInfo,
        job_service: Annotated[JobService, Inject],
        *,
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to delete.",
            ),
        ],
    ) -> DeleteJobPayload:
        """Delete a job."""
        match await job_service.delete(
            account=info.context["current_user"],
            job_id=job_id.node_id,
        ):
            case Err(error):
                match error:
                    case JobNotFoundError():
                        return JobNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
            case Ok(job):
                return JobType.marshal(job)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateJobApplicantResumePresignedURLPayloadType,
        description="Create a presigned URL for a job applicant's resume.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def create_job_applicant_resume_presigned_url(
        self,
        job_applicant_service: Annotated[JobApplicantService, Inject],
    ) -> CreateJobApplicantResumePresignedURLPayloadType:
        """Create a job applicant resume presigned url."""
        result = await job_applicant_service.create_resume_presigned_url()
        return CreateJobApplicantResumePresignedURLPayloadType(presigned_url=result)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=LogJobViewPayloadType,
        description="Log a job view start.",
    )
    @inject
    async def log_job_view_start(
        self,
        info: Info,
        job_service: Annotated[JobService, Inject],
        impression_id: Annotated[
            str,
            strawberry.argument(
                description="The ID of the impression to log the view start for.",
            ),
        ],
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to log the view start for.",
            ),
        ],
    ) -> LogJobViewPayloadType:
        """Log a job view start."""
        await job_service.log_view_start(
            request=info.context["request"],
            job_id=ObjectId(job_id.node_id),
            impression_id=impression_id,
            account_id=info.context["current_user"].id
            if info.context["current_user"]
            else None,
        )
        return LogJobViewPayloadType()

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=LogJobViewPayloadType,
        description="Log a job view end.",
    )
    @inject
    async def log_job_view_end(
        self,
        info: Info,
        job_service: Annotated[JobService, Inject],
        impression_id: Annotated[
            str,
            strawberry.argument(
                description="The ID of the impression to log the view start for.",
            ),
        ],
        job_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the job to log the view start for.",
            ),
        ],
    ) -> LogJobViewPayloadType:
        """Log a job view end."""
        await job_service.log_view_end(
            request=info.context["request"],
            job_id=ObjectId(job_id.node_id),
            impression_id=impression_id,
            account_id=info.context["current_user"].id
            if info.context["current_user"]
            else None,
        )
        return LogJobViewPayloadType()

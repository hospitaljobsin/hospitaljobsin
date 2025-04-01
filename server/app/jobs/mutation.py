from datetime import datetime
from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err, Ok
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.base.types import AddressInputType
from app.context import AuthInfo
from app.jobs.exceptions import (
    JobNotFoundError,
    OrganizationNotFoundError,
    SavedJobNotFoundError,
)
from app.jobs.services import JobService, SavedJobService
from app.organizations.types import OrganizationNotFoundErrorType

from .types import (
    CreateJobPayload,
    CreateJobSuccess,
    JobEdgeType,
    JobNotFoundErrorType,
    JobTypeEnum,
    SavedJobEdgeType,
    SavedJobNotFoundErrorType,
    SaveJobPayload,
    SaveJobSuccess,
    UnsaveJobPayload,
    UnsaveJobSuccess,
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
        address: Annotated[
            AddressInputType,
            strawberry.argument(
                description="The address of the job.",
            ),
        ],
        skills: Annotated[
            list[str],
            strawberry.argument(
                description="The skills required for the job.",
            ),
        ],
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
            account_id=info.context["current_user"].id,
            organization_id=organization_id.node_id,
            title=title,
            description=description,
            address=AddressInputType.to_document(address),
            min_salary=min_salary,
            max_salary=max_salary,
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
                    case OrganizationNotFoundError():
                        return OrganizationNotFoundErrorType()
            case Ok(job):
                return CreateJobSuccess(
                    job_edge=JobEdgeType.marshal(job),
                )
            case _ as unreachable:
                assert_never(unreachable)

from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err, Ok
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo
from app.jobs.exceptions import JobNotFoundError, SavedJobNotFoundError
from app.jobs.services import SavedJobService

from .types import (
    JobNotFoundErrorType,
    SavedJobEdgeType,
    SavedJobNotFoundErrorType,
    SaveJobPayload,
    SaveJobSuccess,
    UnsaveJobPayload,
    UnsaveJobSuccess,
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

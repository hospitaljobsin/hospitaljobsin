from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err
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
    SaveJobResult,
    UnsaveJobPayload,
    UnsaveJobResult,
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
        result = await saved_job_service.save_job(
            account_id=info.context["current_user"].id,
            job_id=job_id.node_id,
        )

        if isinstance(result, Err):
            match result.err_value:
                case JobNotFoundError():
                    return JobNotFoundErrorType()

        return SaveJobResult(
            saved_job_edge=SavedJobEdgeType.marshal(
                result.ok_value,
            ),
        )

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
        result = await saved_job_service.unsave_job(
            account_id=info.context["current_user"].id,
            job_id=job_id.node_id,
        )

        if isinstance(result, Err):
            match result.err_value:
                case SavedJobNotFoundError():
                    return SavedJobNotFoundErrorType()

        return UnsaveJobResult(
            saved_job_edge=SavedJobEdgeType.marshal(
                result.ok_value,
            ),
        )

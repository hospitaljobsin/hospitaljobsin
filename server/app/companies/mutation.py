from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.companies.exceptions import JobNotFoundError
from app.companies.services import JobService
from app.context import AuthInfo

from .types import (
    JobNotFoundErrorType,
    JobType,
    SaveJobPayload,
)


@strawberry.type
class CompanyMutation:
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
        job_service: Annotated[JobService, Inject],
    ) -> SaveJobPayload:
        """Save a job."""
        current_user = await info.context.current_user()
        result = await job_service.save_job(
            account=current_user,
            job_id=job_id.node_id,
        )

        if isinstance(result, Err):
            match result.err_value:
                case JobNotFoundError():
                    return JobNotFoundErrorType()

        return relay.Edge(
            node=JobType.from_orm(result.ok_value),
            cursor=relay.to_base64(
                JobType,
                result.ok_value.id,
            ),
        )

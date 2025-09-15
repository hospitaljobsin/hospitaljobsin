from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err, Ok
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo
from app.job_alerts.exceptions import JobAlertAlreadyExistsError
from app.job_alerts.services import JobAlertService

from .types import (
    AlertFiltersInput,
    CreateJobAlertPayload,
    JobAlertAlreadyExistsErrorType,
    JobAlertFrequencyEnum,
    JobAlertType,
)


@strawberry.type
class JobAlertMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateJobAlertPayload,
        description="Create a job alert.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def create_job_alert(
        self,
        info: AuthInfo,
        job_alert_service: Annotated[JobAlertService, Inject],
        filters: Annotated[
            AlertFiltersInput,
            strawberry.argument(description="The filters for the job alert."),
        ],
        frequency: Annotated[
            JobAlertFrequencyEnum,
            strawberry.argument(description="The frequency of the job alert."),
        ],
    ) -> CreateJobAlertPayload:
        """Create a job alert."""
        match await job_alert_service.create(
            account=info.context["current_user"],
            filters=filters.to_document(filters),
            frequency=frequency.value,
        ):
            case Err(error):
                match error:
                    case JobAlertAlreadyExistsError():
                        return JobAlertAlreadyExistsErrorType()
            case Ok(organization):
                return JobAlertType.marshal(organization)
            case _ as unreachable:
                assert_never(unreachable)

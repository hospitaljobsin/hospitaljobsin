from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err, Ok
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo
from app.job_alerts.exceptions import (
    JobAlertAlreadyExistsError,
    JobAlertNotFoundError,
    MaxJobAlertsReachedError,
    RecommendedJobAlertsNotFoundError,
)
from app.job_alerts.services import JobAlertService

from .types import (
    AlertFiltersInput,
    CreateJobAlertPayload,
    DeleteJobAlertPayload,
    EnableRecommendedJobAlertsPayload,
    EnableRecommendedJobAlertsSuccessType,
    JobAlertAlreadyExistsErrorType,
    JobAlertEdgeType,
    JobAlertFrequencyEnum,
    JobAlertNotFoundErrorType,
    JobAlertType,
    MaxJobAlertsReachedErrorType,
    RecommendedJobAlertsNotFoundErrorType,
    RemoveRecommendedJobAlertsPayload,
    UpdateJobAlertPayload,
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
                    case MaxJobAlertsReachedError():
                        return MaxJobAlertsReachedErrorType()
            case Ok(organization):
                return JobAlertType.marshal(organization)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateJobAlertPayload,
        description="Update a job alert.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_job_alert(
        self,
        info: AuthInfo,
        job_alert_service: Annotated[JobAlertService, Inject],
        job_alert_id: Annotated[
            strawberry.relay.GlobalID,
            strawberry.argument(description="The ID of the job alert to update."),
        ],
        filters: Annotated[
            AlertFiltersInput,
            strawberry.argument(description="The filters for the job alert."),
        ],
        frequency: Annotated[
            JobAlertFrequencyEnum,
            strawberry.argument(description="The frequency of the job alert."),
        ],
    ) -> UpdateJobAlertPayload:
        """Update a job alert."""
        match await job_alert_service.update(
            account=info.context["current_user"],
            job_alert_id=job_alert_id.node_id,
            filters=filters.to_document(filters),
            frequency=frequency.value,
        ):
            case Err(error):
                match error:
                    case JobAlertAlreadyExistsError():
                        return JobAlertAlreadyExistsErrorType()
                    case JobAlertNotFoundError():
                        return JobAlertNotFoundErrorType()
            case Ok(organization):
                return JobAlertType.marshal(organization)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DeleteJobAlertPayload,
        description="Delete a job alert.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def delete_job_alert(
        self,
        info: AuthInfo,
        job_alert_service: Annotated[JobAlertService, Inject],
        job_alert_id: Annotated[
            strawberry.relay.GlobalID,
            strawberry.argument(description="The ID of the job alert to delete."),
        ],
    ) -> DeleteJobAlertPayload:
        """Delete a job alert."""
        match await job_alert_service.delete(
            account=info.context["current_user"],
            job_alert_id=job_alert_id.node_id,
        ):
            case Err(error):
                match error:
                    case JobAlertNotFoundError():
                        return JobAlertNotFoundErrorType()
            case Ok(organization):
                return JobAlertType.marshal(organization)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=EnableRecommendedJobAlertsPayload,
        description="Enable recommended job alerts for the current user.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def enable_recommended_job_alerts(
        self,
        info: AuthInfo,
        job_alert_service: Annotated[JobAlertService, Inject],
        frequency: Annotated[
            JobAlertFrequencyEnum,
            strawberry.argument(description="The frequency of the job alert."),
        ],
    ) -> EnableRecommendedJobAlertsPayload:
        """Enable recommended job alerts for the current user."""
        match await job_alert_service.enable_recommended_alerts(
            account=info.context["current_user"],
            frequency=frequency.value,
        ):
            case Ok(result):
                alerts, removed_recommended_alerts = result
                return EnableRecommendedJobAlertsSuccessType(
                    job_alert_edges=[
                        JobAlertEdgeType.marshal(job_alert) for job_alert in alerts
                    ],
                    removed_recommended_job_alert_ids=[
                        relay.GlobalID("RecommendedJobAlert", node_id=str(alert.id))
                        for alert in removed_recommended_alerts
                    ],
                )
            case Err(error):
                match error:
                    case RecommendedJobAlertsNotFoundError():
                        return RecommendedJobAlertsNotFoundErrorType()
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RemoveRecommendedJobAlertsPayload,
        description="Remove recommended job alerts for the current user.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def remove_recommended_job_alerts(
        self,
        info: AuthInfo,
        job_alert_service: Annotated[JobAlertService, Inject],
    ) -> RemoveRecommendedJobAlertsPayload:
        """Remove recommended job alerts for the current user."""
        from app.accounts.types import AccountType

        match await job_alert_service.remove_recommended_alerts(
            account=info.context["current_user"],
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case Err(error):
                match error:
                    case RecommendedJobAlertsNotFoundError():
                        return RecommendedJobAlertsNotFoundErrorType()
            case _ as unreachable:
                assert_never(unreachable)

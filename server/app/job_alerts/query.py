from typing import Annotated

import strawberry
from aioinject import Injected
from aioinject.ext.strawberry import inject
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo
from app.job_alerts.repositories import JobAlertRepo

from .types import JobAlertConnectionType


@strawberry.type
class JobAlertQuery:
    @strawberry.field(  # type: ignore[misc]
        description="Get all the job alerts for the current user.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def job_alerts(
        self,
        info: AuthInfo,
        job_alert_repo: Injected[JobAlertRepo],
        before: Annotated[
            strawberry.relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            strawberry.relay.GlobalID | None,
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
    ) -> JobAlertConnectionType:
        results = await job_alert_repo.get_all(
            account_id=info.context["current_user"].id,
            before=before.id if before else None,
            after=after.id if after else None,
            first=first,
            last=last,
        )
        return JobAlertConnectionType.marshal(results)

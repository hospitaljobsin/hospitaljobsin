from email.policy import default
from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry import relay

from .repositories import JobRepo
from .types import JobConnectionType


@strawberry.type
class JobQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=JobConnectionType,
        description="Get all jobs available.",
    )
    @inject
    async def jobs(
        self,
        job_repo: Annotated[JobRepo, Inject],
        search_term: Annotated[
            str | None,
            strawberry.argument(
                description="Search term",
            ),
        ] = None,
        before: relay.GlobalID | None = None,
        after: relay.GlobalID | None = None,
        first: int | None = None,
        last: int | None = None,
    ) -> JobConnectionType:
        paginated_result = await job_repo.get_all(
            search_term=search_term,
            first=first,
            last=last,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
        )

        return JobConnectionType.from_paginated_result(
            paginated_result=paginated_result,
        )

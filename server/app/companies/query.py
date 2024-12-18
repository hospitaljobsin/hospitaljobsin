from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo

from .repositories import CompanyRepo, JobRepo, SavedJobRepo
from .types import (
    CompanyNotFoundErrorType,
    CompanyPayload,
    CompanyType,
    JobConnectionType,
    SavedJobConnectionType,
)


@strawberry.type
class CompanyQuery:
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

    @strawberry.field(  # type: ignore[misc]
        graphql_type=CompanyPayload,
        description="Get company by ID.",
    )
    @inject
    async def company(
        self,
        company_repo: Annotated[CompanyRepo, Inject],
        slug: Annotated[
            str,
            strawberry.argument(
                description="Slug of the company",
            ),
        ],
    ) -> CompanyPayload:
        # TODO: load this via a dataloader
        result = await company_repo.get_by_slug(slug=slug)

        if result is None:
            return CompanyNotFoundErrorType()

        return CompanyType.marshal(result)

    @strawberry.field(
        graphql_type=SavedJobConnectionType,
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def saved_jobs(
        self,
        info: AuthInfo,
        saved_job_repo: Annotated[SavedJobRepo, Inject],
        before: relay.GlobalID | None = None,
        after: relay.GlobalID | None = None,
        first: int | None = None,
        last: int | None = None,
    ) -> SavedJobConnectionType:
        result = await saved_job_repo.get_all_saved(
            account_id=info.context["current_user_id"],
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )
        return SavedJobConnectionType.from_paginated_result(result)

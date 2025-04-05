from typing import Annotated

import strawberry
from aioinject.ext.strawberry import inject

from app.context import Info

from .types import (
    OrganizationInviteNotFoundErrorType,
    OrganizationInvitePayload,
    OrganizationInviteType,
    OrganizationNotFoundErrorType,
    OrganizationPayload,
    OrganizationType,
)


@strawberry.type
class OrganizationQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=OrganizationPayload,
        description="Get organization by slug.",
    )
    @inject
    async def organization(
        self,
        info: Info,
        slug: Annotated[
            str,
            strawberry.argument(
                description="Slug of the organization",
            ),
        ],
    ) -> OrganizationPayload:
        result = await info.context["loaders"].organization_by_slug.load(slug)

        if result is None:
            return OrganizationNotFoundErrorType()

        return OrganizationType.marshal(result)

    @strawberry.field(  # type: ignore[misc]
        graphql_type=OrganizationInvitePayload,
        description="Get organization invite by token.",
    )
    @inject
    async def organization_invite(
        self,
        info: Info,
        invite_token: Annotated[
            str,
            strawberry.argument(
                description="Token of the invite",
            ),
        ],
    ) -> OrganizationInvitePayload:
        result = await info.context["loaders"].organization_invite_by_token.load(
            invite_token
        )

        if result is None:
            return OrganizationInviteNotFoundErrorType()

        return OrganizationInviteType.marshal(result)

from typing import Annotated

import strawberry
from aioinject.ext.strawberry import inject
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo, Info

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
        description="Get a pending organization invite by token.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def organization_invite(
        self,
        info: AuthInfo,
        invite_token: Annotated[
            str,
            strawberry.argument(
                description="Token of the pending invite",
            ),
        ],
    ) -> OrganizationInvitePayload:
        """Get a pending organization invite by token."""
        result = await info.context["loaders"].organization_invite_by_token.load(
            (info.context["current_user"].email, invite_token)
        )

        if result is None:
            return OrganizationInviteNotFoundErrorType()

        return OrganizationInviteType.marshal(result)

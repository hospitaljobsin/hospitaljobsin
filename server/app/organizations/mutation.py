from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo
from app.organizations.services import OrganizationService

from .types import (
    CreateOrganizationPayload,
)


@strawberry.type
class OrganizationMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateOrganizationPayload,
        description="Create an organization.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def create_organization(
        self,
        info: AuthInfo,
        organization_service: Annotated[OrganizationService, Inject],
    ) -> CreateOrganizationPayload:
        """Create an organization."""
        pass

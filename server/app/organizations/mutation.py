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
        full_name: Annotated[
            str, strawberry.argument(description="The full name of the organization.")
        ],
        slug: Annotated[
            str, strawberry.argument(description="The slug of the organization.")
        ],
        website: Annotated[
            str | None,
            strawberry.argument(description="The website of the organization."),
        ] = None,
        email: Annotated[
            str | None,
            strawberry.argument(description="The email of the organization."),
        ] = None,
        description: Annotated[
            str | None,
            strawberry.argument(description="The description of the organization."),
        ] = None,
    ) -> CreateOrganizationPayload:
        """Create an organization."""
        pass

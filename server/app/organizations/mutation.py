from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err, Ok
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo
from app.organizations.exceptions import OrganizationSlugInUseError
from app.organizations.services import OrganizationService

from .types import (
    CreateOrganizationLogoPresignedURLPayloadType,
    CreateOrganizationPayload,
    OrganizationSlugInUseErrorType,
    OrganizationType,
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
        description: Annotated[
            str | None,
            strawberry.argument(description="The description of the organization."),
        ] = None,
        logo_url: Annotated[
            str | None,
            strawberry.argument(description="The logo URL of the organization."),
        ] = None,
    ) -> CreateOrganizationPayload:
        """Create an organization."""
        match await organization_service.create(
            admin_id=info.context["current_user"].id,
            name=full_name,
            slug=slug,
            website=website,
            description=description,
            logo_url=logo_url,
        ):
            case Err(error):
                match error:
                    case OrganizationSlugInUseError():
                        return OrganizationSlugInUseErrorType()
            case Ok(organization):
                return OrganizationType.marshal(organization)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateOrganizationLogoPresignedURLPayloadType,
        description="Create an organization logo presigned URL.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def create_organization_logo_presigned_url(
        self,
        organization_service: Annotated[OrganizationService, Inject],
    ) -> CreateOrganizationLogoPresignedURLPayloadType:
        """Create an organization logo presigned url."""
        result = await organization_service.create_logo_presigned_url()
        return CreateOrganizationLogoPresignedURLPayloadType(presigned_url=result)

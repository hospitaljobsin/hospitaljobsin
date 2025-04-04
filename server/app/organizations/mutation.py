from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from result import Err, Ok
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.base.types import AddressInputType
from app.context import AuthInfo
from app.jobs.exceptions import OrganizationNotFoundError
from app.organizations.exceptions import (
    MemberAlreadyExistsError,
    OrganizationInviteNotFoundError,
    OrganizationSlugInUseError,
)
from app.organizations.services import OrganizationInviteService, OrganizationService

from .types import (
    CreateOrganizationInvitePayload,
    CreateOrganizationLogoPresignedURLPayloadType,
    CreateOrganizationPayload,
    DeleteOrganizationInvitePayload,
    MemberAlreadyExistsErrorType,
    OrganizationInviteEdgeType,
    OrganizationInviteNotFoundErrorType,
    OrganizationInviteType,
    OrganizationNotFoundErrorType,
    OrganizationSlugInUseErrorType,
    OrganizationType,
    UpdateOrganizationPayload,
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

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateOrganizationPayload,
        description="Update an organization.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    # TODO: ensure only organization admins can update the organization
                ],
            )
        ],
    )
    @inject
    async def update_organization(
        self,
        info: AuthInfo,
        organization_service: Annotated[OrganizationService, Inject],
        organization_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the organization to update.",
            ),
        ],
        name: Annotated[
            str, strawberry.argument(description="The name of the organization.")
        ],
        slug: Annotated[
            str, strawberry.argument(description="The slug of the organization.")
        ],
        address: Annotated[
            AddressInputType,
            strawberry.argument(description="The address of the organization."),
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
    ) -> UpdateOrganizationPayload:
        """Update an organization."""
        match await organization_service.update(
            account=info.context["current_user"],
            organization_id=ObjectId(organization_id.node_id),
            name=name,
            slug=slug,
            address=AddressInputType.to_document(address),
            website=website,
            description=description,
            logo_url=logo_url,
        ):
            case Err(error):
                match error:
                    case OrganizationNotFoundError():
                        return OrganizationNotFoundErrorType()
                    case OrganizationSlugInUseError():
                        return OrganizationSlugInUseErrorType()
            case Ok(organization):
                return OrganizationType.marshal(organization)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=CreateOrganizationInvitePayload,
        description="Create an organization invite.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    # TODO: ensure only organization admins can create an invite
                ],
            )
        ],
    )
    @inject
    async def create_organization_invite(
        self,
        info: AuthInfo,
        organization_invite_service: Annotated[OrganizationInviteService, Inject],
        organization_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the organization to create an invite for.",
            ),
        ],
        email: Annotated[
            str, strawberry.argument(description="The email address of the invite.")
        ],
    ) -> CreateOrganizationInvitePayload:
        """Create an organization invite."""
        match await organization_invite_service.create(
            account=info.context["current_user"],
            organization_id=ObjectId(organization_id.node_id),
            email=email,
            background_tasks=info.context["background_tasks"],
        ):
            case Err(error):
                match error:
                    case OrganizationNotFoundError():
                        return OrganizationNotFoundErrorType()
                    case MemberAlreadyExistsError():
                        return MemberAlreadyExistsErrorType()
            case Ok(invite):
                return OrganizationInviteType.marshal(invite)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DeleteOrganizationInvitePayload,
        description="Delete an organization invite.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    # TODO: ensure only organization admins can delete an invite
                ],
            )
        ],
    )
    @inject
    async def delete_organization_invite(
        self,
        info: AuthInfo,
        organization_invite_service: Annotated[OrganizationInviteService, Inject],
        organization_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the organization to delete the invite from.",
            ),
        ],
        invite_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the invite to delete.",
            ),
        ],
    ) -> DeleteOrganizationInvitePayload:
        """Delete an organization invite."""
        match await organization_invite_service.delete(
            account=info.context["current_user"],
            organization_id=ObjectId(organization_id.node_id),
            invite_id=ObjectId(invite_id.node_id),
        ):
            case Err(error):
                match error:
                    case OrganizationNotFoundError():
                        return OrganizationNotFoundErrorType()
                    case OrganizationInviteNotFoundError():
                        return OrganizationInviteNotFoundErrorType()
            case Ok(invite):
                return OrganizationInviteEdgeType.marshal(invite)
            case _ as unreachable:
                assert_never(unreachable)

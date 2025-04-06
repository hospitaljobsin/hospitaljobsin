from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from result import Err, Ok
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.exceptions import InvalidEmailError
from app.auth.permissions import IsAuthenticated, RequiresSudoMode
from app.auth.types import InvalidEmailErrorType
from app.base.types import AddressInputType
from app.context import AuthInfo
from app.jobs.exceptions import OrganizationNotFoundError
from app.organizations.exceptions import (
    InsufficientOrganizationAdminsError,
    MemberAlreadyExistsError,
    OrganizationAuthorizationError,
    OrganizationInviteNotFoundError,
    OrganizationMemberNotFoundError,
    OrganizationSlugInUseError,
)
from app.organizations.services import (
    OrganizationInviteService,
    OrganizationMemberService,
    OrganizationService,
)

from .types import (
    AcceptOrganizationInvitePayload,
    CreateOrganizationInvitePayload,
    CreateOrganizationLogoPresignedURLPayloadType,
    CreateOrganizationPayload,
    DeclineOrganizationInvitePayload,
    DeleteOrganizationInvitePayload,
    DemoteOrganizationMemberPayload,
    DemoteOrganizationMemberSuccessType,
    InsufficientOrganizationAdminsErrorType,
    MemberAlreadyExistsErrorType,
    OrganizationAuthorizationErrorType,
    OrganizationInviteEdgeType,
    OrganizationInviteNotFoundErrorType,
    OrganizationInviteType,
    OrganizationMemberEdgeType,
    OrganizationMemberNotFoundErrorType,
    OrganizationNotFoundErrorType,
    OrganizationSlugInUseErrorType,
    OrganizationType,
    PromoteOrganizationMemberPayload,
    PromoteOrganizationMemberSuccessType,
    RemoveOrganizationMemberPayload,
    RemoveOrganizationMemberSuccessType,
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
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
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
                    case InvalidEmailError() as err:
                        return InvalidEmailErrorType(message=err.message)
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
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
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
            case Ok(invite):
                return OrganizationInviteEdgeType.marshal(invite)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=AcceptOrganizationInvitePayload,
        description="Accept an organization invite.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def accept_organization_invite(
        self,
        info: AuthInfo,
        organization_invite_service: Annotated[OrganizationInviteService, Inject],
        invite_token: Annotated[
            str,
            strawberry.argument(
                description="The token of the invite to accept.",
            ),
        ],
    ) -> AcceptOrganizationInvitePayload:
        """Accept an organization invite."""
        match await organization_invite_service.accept(
            account=info.context["current_user"],
            invite_token=invite_token,
        ):
            case Err(error):
                match error:
                    case OrganizationInviteNotFoundError():
                        return OrganizationInviteNotFoundErrorType()
            case Ok(invite):
                return OrganizationInviteEdgeType.marshal(invite)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DeclineOrganizationInvitePayload,
        description="Decline an organization invite.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def decline_organization_invite(
        self,
        info: AuthInfo,
        organization_invite_service: Annotated[OrganizationInviteService, Inject],
        invite_token: Annotated[
            str,
            strawberry.argument(
                description="The token of the invite to decline.",
            ),
        ],
    ) -> DeclineOrganizationInvitePayload:
        """Decline an organization invite."""
        match await organization_invite_service.decline(
            account=info.context["current_user"],
            invite_token=invite_token,
        ):
            case Err(error):
                match error:
                    case OrganizationInviteNotFoundError():
                        return OrganizationInviteNotFoundErrorType()
            case Ok(invite):
                return OrganizationInviteEdgeType.marshal(invite)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RemoveOrganizationMemberPayload,
        description="Remove an organization member.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def remove_organization_member(
        self,
        info: AuthInfo,
        organization_member_service: Annotated[OrganizationMemberService, Inject],
        organization_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the organization to remove the member from.",
            ),
        ],
        account_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the account to remove from the organization.",
            ),
        ],
    ) -> RemoveOrganizationMemberPayload:
        """Remove an organization member."""
        match await organization_member_service.remove_member(
            account=info.context["current_user"],
            organization_id=ObjectId(organization_id.node_id),
            member_account_id=ObjectId(account_id.node_id),
        ):
            case Err(error):
                match error:
                    case OrganizationNotFoundError():
                        return OrganizationNotFoundErrorType()
                    case OrganizationMemberNotFoundError():
                        return OrganizationMemberNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
            case Ok(result):
                (member, organization) = result
                return RemoveOrganizationMemberSuccessType(
                    organization=OrganizationType.marshal(organization),
                    organization_member_edge=OrganizationMemberEdgeType.marshal(member),
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=PromoteOrganizationMemberPayload,
        description="Promote an organization member.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def promote_organization_member(
        self,
        info: AuthInfo,
        organization_member_service: Annotated[OrganizationMemberService, Inject],
        organization_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the organization to promote the member from.",
            ),
        ],
        account_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the account to promote in the organization.",
            ),
        ],
    ) -> PromoteOrganizationMemberPayload:
        """Promote an organization member."""
        match await organization_member_service.promote_member(
            account=info.context["current_user"],
            organization_id=ObjectId(organization_id.node_id),
            member_account_id=ObjectId(account_id.node_id),
        ):
            case Err(error):
                match error:
                    case OrganizationNotFoundError():
                        return OrganizationNotFoundErrorType()
                    case OrganizationMemberNotFoundError():
                        return OrganizationMemberNotFoundErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
            case Ok(result):
                (member, organization) = result
                return PromoteOrganizationMemberSuccessType(
                    organization=OrganizationType.marshal(organization),
                    organization_member_edge=OrganizationMemberEdgeType.marshal(member),
                )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=DemoteOrganizationMemberPayload,
        description="Demote an organization member.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def demote_organization_member(
        self,
        info: AuthInfo,
        organization_member_service: Annotated[OrganizationMemberService, Inject],
        organization_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the organization to promote the member from.",
            ),
        ],
        account_id: Annotated[
            relay.GlobalID,
            strawberry.argument(
                description="The ID of the account to promote in the organization.",
            ),
        ],
    ) -> DemoteOrganizationMemberPayload:
        """Demote an organization member."""
        match await organization_member_service.demote_member(
            account=info.context["current_user"],
            organization_id=ObjectId(organization_id.node_id),
            member_account_id=ObjectId(account_id.node_id),
        ):
            case Err(error):
                match error:
                    case OrganizationNotFoundError():
                        return OrganizationNotFoundErrorType()
                    case OrganizationMemberNotFoundError():
                        return OrganizationMemberNotFoundErrorType()
                    case InsufficientOrganizationAdminsError():
                        return InsufficientOrganizationAdminsErrorType()
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
            case Ok(result):
                (member, organization) = result
                return DemoteOrganizationMemberSuccessType(
                    organization=OrganizationType.marshal(organization),
                    organization_member_edge=OrganizationMemberEdgeType.marshal(member),
                )
            case _ as unreachable:
                assert_never(unreachable)

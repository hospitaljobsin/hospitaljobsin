from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization, OrganizationInvite
from app.organizations.repositories import (
    OrganizationInviteRepo,
    OrganizationMemberRepo,
    OrganizationRepo,
)
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email
from tests.utils.slugs import generate_test_slug

DELETE_ORGANIZATION_INVITE_MUTATION = """
mutation DeleteOrganizationInviteMutation(
    $organizationId: ID!
    $inviteId: ID!
) {
    deleteOrganizationInvite(
        organizationId: $organizationId
        inviteId: $inviteId
    ) {
        __typename
        ... on OrganizationInviteEdge {
            node {
                id
                email
                status
                createdAt
                expiresAt
                organization {
                    id
                    name
                    slug
                }
            }
        }
        ... on OrganizationNotFoundError {
            __typename
            message
        }
        ... on OrganizationInviteNotFoundError {
            __typename
            message
        }
        ... on OrganizationAuthorizationError {
            __typename
            message
        }
    }
}
"""


@pytest.fixture
async def admin_organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create an organization where the user is an admin."""
    org = await organization_repo.create(
        name="Admin Org",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


@pytest.fixture
async def member_organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create an organization where the user is a member (not admin)."""
    org = await organization_repo.create(
        name="Member Org",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="member",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


@pytest.fixture
async def foreign_organization(
    foreign_password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create an organization where the user is not a member."""
    org = await organization_repo.create(
        name="Foreign Org",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


@pytest.fixture
async def pending_invite(
    admin_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    password_account: Account,
) -> AsyncGenerator[OrganizationInvite]:
    """Create a pending invite for the admin organization."""
    invite, token = await organization_invite_repo.create(
        organization=admin_organization,
        email=generate_test_email(),
        account=password_account,
        member_role="member",
    )
    yield invite
    await organization_invite_repo.delete(invite)


async def test_delete_organization_invite_successful(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    pending_invite: OrganizationInvite,
) -> None:
    """Test successful deletion of an organization invite."""
    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", pending_invite.id),
        },
    )

    data = response["data"]["deleteOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteEdge"
    assert data["node"]["id"] == relay.to_base64(
        "OrganizationInvite", pending_invite.id
    )
    assert data["node"]["email"] == pending_invite.email
    assert data["node"]["status"] == "PENDING"
    assert data["node"]["organization"]["id"] == relay.to_base64(
        "Organization", admin_organization.id
    )


async def test_delete_organization_invite_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
    pending_invite: OrganizationInvite,
) -> None:
    """Test deletion with non-existent organization ID."""
    invalid_org_id = relay.to_base64("Organization", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": invalid_org_id,
            "inviteId": relay.to_base64("OrganizationInvite", pending_invite.id),
        },
    )

    data = response["data"]["deleteOrganizationInvite"]
    assert data["__typename"] == "OrganizationNotFoundError"
    assert "not found" in data["message"].lower()


async def test_delete_organization_invite_invite_not_found(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test deletion with non-existent invite ID."""
    invalid_invite_id = relay.to_base64(
        "OrganizationInvite", "507f1f77bcf86cd799439011"
    )

    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": invalid_invite_id,
        },
    )

    data = response["data"]["deleteOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"
    assert "not found" in data["message"].lower()


async def test_delete_organization_invite_authorization_error_not_admin(
    password_auth_graphql_client: GraphQLClient,
    member_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    password_account: Account,
) -> None:
    """Test deletion fails when user is not an admin."""
    invite, token = await organization_invite_repo.create(
        organization=member_organization,
        email=generate_test_email(),
        account=password_account,
        member_role="member",
    )

    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", member_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", invite.id),
        },
    )

    data = response["data"]["deleteOrganizationInvite"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]

    await organization_invite_repo.delete(invite)


async def test_delete_organization_invite_authorization_error_not_member(
    password_auth_graphql_client: GraphQLClient,
    foreign_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
) -> None:
    """Test deletion fails when user is not a member of the organization."""
    invite, token = await organization_invite_repo.create(
        organization=foreign_organization,
        email=generate_test_email(),
        account=foreign_password_account,
        member_role="member",
    )

    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", foreign_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", invite.id),
        },
    )

    data = response["data"]["deleteOrganizationInvite"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]

    await organization_invite_repo.delete(invite)


async def test_delete_organization_invite_wrong_organization(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    foreign_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
) -> None:
    """Test deletion fails when invite belongs to different organization."""
    invite, token = await organization_invite_repo.create(
        organization=foreign_organization,
        email=generate_test_email(),
        account=foreign_password_account,
        member_role="member",
    )

    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", invite.id),
        },
    )

    data = response["data"]["deleteOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

    await organization_invite_repo.delete(invite)


async def test_delete_organization_invite_unauthenticated(
    graphql_client: GraphQLClient,
    admin_organization: Organization,
    pending_invite: OrganizationInvite,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", pending_invite.id),
        },
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_delete_organization_invite_invalid_organization_id_format(
    password_auth_graphql_client: GraphQLClient,
    pending_invite: OrganizationInvite,
) -> None:
    """Test deletion with malformed organization ID."""
    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": "invalid-id-format",
            "inviteId": relay.to_base64("OrganizationInvite", pending_invite.id),
        },
    )

    assert "errors" in response


async def test_delete_organization_invite_invalid_invite_id_format(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test deletion with malformed invite ID."""
    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": "invalid-id-format",
        },
    )

    assert "errors" in response


async def test_delete_organization_invite_empty_organization_id(
    password_auth_graphql_client: GraphQLClient,
    pending_invite: OrganizationInvite,
) -> None:
    """Test deletion with empty organization ID."""
    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": "",
            "inviteId": relay.to_base64("OrganizationInvite", pending_invite.id),
        },
    )

    assert "errors" in response


async def test_delete_organization_invite_empty_invite_id(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test deletion with empty invite ID."""
    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": "",
        },
    )

    assert "errors" in response


async def test_delete_organization_invite_twice(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    pending_invite: OrganizationInvite,
) -> None:
    """Test deleting the same invite twice fails on second attempt."""
    # First deletion should succeed
    response1 = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", pending_invite.id),
        },
    )

    data1 = response1["data"]["deleteOrganizationInvite"]
    assert data1["__typename"] == "OrganizationInviteEdge"

    # Second deletion should fail
    response2 = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", pending_invite.id),
        },
    )

    data2 = response2["data"]["deleteOrganizationInvite"]
    assert data2["__typename"] == "OrganizationInviteNotFoundError"


async def test_delete_organization_invite_multiple_invites(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    password_account: Account,
) -> None:
    """Test deleting one invite doesn't affect other invites."""
    invite1, _ = await organization_invite_repo.create(
        organization=admin_organization,
        email=generate_test_email(),
        account=password_account,
        member_role="member",
    )
    invite2, _ = await organization_invite_repo.create(
        organization=admin_organization,
        email=generate_test_email(),
        account=password_account,
        member_role="member",
    )

    # Delete first invite
    response1 = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", invite1.id),
        },
    )

    data1 = response1["data"]["deleteOrganizationInvite"]
    assert data1["__typename"] == "OrganizationInviteEdge"
    assert data1["node"]["id"] == relay.to_base64("OrganizationInvite", invite1.id)

    # Second invite should still be deletable
    response2 = await password_auth_graphql_client(
        DELETE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "inviteId": relay.to_base64("OrganizationInvite", invite2.id),
        },
    )

    data2 = response2["data"]["deleteOrganizationInvite"]
    assert data2["__typename"] == "OrganizationInviteEdge"
    assert data2["node"]["id"] == relay.to_base64("OrganizationInvite", invite2.id)

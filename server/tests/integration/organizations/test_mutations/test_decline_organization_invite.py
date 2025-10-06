from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization, OrganizationInvite
from app.organizations.repositories import (
    OrganizationInviteRepo,
    OrganizationMemberRepo,
    OrganizationRepo,
)

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email
from tests.utils.slugs import generate_test_slug

DECLINE_ORGANIZATION_INVITE_MUTATION = """
mutation DeclineOrganizationInviteMutation($inviteToken: String!) {
    declineOrganizationInvite(inviteToken: $inviteToken) {
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
        ... on OrganizationInviteNotFoundError {
            __typename
            message
        }
    }
}
"""


@pytest.fixture
async def test_organization(
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    foreign_password_account: Account,
) -> AsyncGenerator[Organization]:
    """Create a test organization."""
    org = await organization_repo.create(
        name="Test Org",
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
async def pending_invite_for_password_account(
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
    password_account: Account,
) -> AsyncGenerator[tuple[OrganizationInvite, str]]:
    """Create a pending invite for the password account."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=password_account.email,
        account=foreign_password_account,
        member_role="member",
    )
    yield invite, token
    await organization_invite_repo.delete(invite)


async def test_decline_organization_invite_successful(
    password_auth_graphql_client: GraphQLClient,
    pending_invite_for_password_account: tuple[OrganizationInvite, str],
    organization_member_repo: OrganizationMemberRepo,
    test_organization: Organization,
    password_account: Account,
) -> None:
    """Test successful decline of an organization invite."""
    invite, token = pending_invite_for_password_account

    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": token},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteEdge"
    assert data["node"]["email"] == invite.email
    assert data["node"]["status"] == "DECLINED"
    assert data["node"]["expiresAt"] is None

    # Verify member was NOT created
    member = await organization_member_repo.get(
        organization_id=test_organization.id,
        account_id=password_account.id,
    )
    assert member is None


async def test_decline_organization_invite_admin_role(
    password_auth_graphql_client: GraphQLClient,
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    organization_member_repo: OrganizationMemberRepo,
    foreign_password_account: Account,
    password_account: Account,
) -> None:
    """Test declining an invite with admin role."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=password_account.email,
        account=foreign_password_account,
        member_role="admin",
    )

    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": token},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteEdge"
    assert data["node"]["status"] == "DECLINED"

    # Verify member was NOT created
    member = await organization_member_repo.get(
        organization_id=test_organization.id,
        account_id=password_account.id,
    )
    assert member is None

    await organization_invite_repo.delete(invite)


async def test_decline_organization_invite_invalid_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test declining an invite with invalid token."""
    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": "invalid-token-12345"},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"
    assert "not found" in data["message"].lower()


async def test_decline_organization_invite_wrong_email(
    password_auth_graphql_client: GraphQLClient,
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
) -> None:
    """Test declining an invite with wrong email."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=generate_test_email(),
        account=foreign_password_account,
        member_role="member",
    )

    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": token},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

    await organization_invite_repo.delete(invite)


async def test_decline_organization_invite_already_declined(
    password_auth_graphql_client: GraphQLClient,
    pending_invite_for_password_account: tuple[OrganizationInvite, str],
) -> None:
    """Test declining an already declined invite."""
    invite, token = pending_invite_for_password_account

    # Decline first time
    response1 = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": token},
    )
    assert (
        response1["data"]["declineOrganizationInvite"]["__typename"]
        == "OrganizationInviteEdge"
    )

    # Try to decline again
    response2 = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": token},
    )

    data = response2["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"


async def test_decline_organization_invite_accepted_invite(
    password_auth_graphql_client: GraphQLClient,
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
    password_account: Account,
) -> None:
    """Test declining an accepted invite."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=password_account.email,
        account=foreign_password_account,
        member_role="member",
    )

    # Accept the invite
    await organization_invite_repo.update(invite, status="accepted", expires_at=None)

    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": token},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

    await organization_invite_repo.delete(invite)


async def test_decline_organization_invite_unauthenticated(
    graphql_client: GraphQLClient,
    pending_invite_for_password_account: tuple[OrganizationInvite, str],
) -> None:
    """Test that unauthenticated requests are rejected."""
    _, token = pending_invite_for_password_account

    response = await graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": token},
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_decline_organization_invite_empty_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test declining an invite with empty token."""
    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": ""},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"


async def test_decline_organization_invite_whitespace_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test declining an invite with whitespace token."""
    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": "   "},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"


async def test_decline_organization_invite_special_characters_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test declining an invite with special characters in token."""
    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": "!@#$%^&*()"},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"


async def test_decline_organization_invite_case_sensitive_token(
    password_auth_graphql_client: GraphQLClient,
    pending_invite_for_password_account: tuple[OrganizationInvite, str],
) -> None:
    """Test that invite tokens are case-sensitive."""
    _, token = pending_invite_for_password_account

    # Try with uppercase token
    response = await password_auth_graphql_client(
        DECLINE_ORGANIZATION_INVITE_MUTATION,
        variables={"inviteToken": token.upper()},
    )

    data = response["data"]["declineOrganizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

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

ORGANIZATION_INVITE_QUERY = """
query OrganizationInviteQuery($inviteToken: String!) {
    organizationInvite(inviteToken: $inviteToken) {
        __typename
        ... on OrganizationInvite {
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
        name="Test Organization",
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


async def test_organization_invite_query_successful(
    password_auth_graphql_client: GraphQLClient,
    pending_invite: tuple[OrganizationInvite, str],
    test_organization: Organization,
) -> None:
    """Test successful organization invite query."""
    invite, token = pending_invite

    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": token},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == invite.email
    assert data["status"] == "PENDING"
    assert data["expiresAt"] is not None
    assert data["organization"]["id"] is not None
    assert data["organization"]["name"] == test_organization.name
    assert data["organization"]["slug"] == test_organization.slug


async def test_organization_invite_query_invalid_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization invite query with invalid token."""
    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": "invalid-token-12345"},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"
    assert "not found" in data["message"].lower()


async def test_organization_invite_query_wrong_email(
    password_auth_graphql_client: GraphQLClient,
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
) -> None:
    """Test organization invite query with wrong email."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=generate_test_email(),
        account=foreign_password_account,
        member_role="member",
    )

    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": token},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

    await organization_invite_repo.delete(invite)


async def test_organization_invite_query_accepted_invite(
    password_auth_graphql_client: GraphQLClient,
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
    password_account: Account,
) -> None:
    """Test organization invite query with accepted invite."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=password_account.email,
        account=foreign_password_account,
        member_role="member",
    )

    # Mark as accepted
    await organization_invite_repo.update(invite, status="accepted", expires_at=None)

    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": token},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

    await organization_invite_repo.delete(invite)


async def test_organization_invite_query_declined_invite(
    password_auth_graphql_client: GraphQLClient,
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
    password_account: Account,
) -> None:
    """Test organization invite query with declined invite."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=password_account.email,
        account=foreign_password_account,
        member_role="member",
    )

    # Mark as declined
    await organization_invite_repo.update(invite, status="declined", expires_at=None)

    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": token},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

    await organization_invite_repo.delete(invite)


async def test_organization_invite_query_unauthenticated(
    graphql_client: GraphQLClient,
    pending_invite: tuple[OrganizationInvite, str],
) -> None:
    """Test that unauthenticated requests are rejected."""
    _, token = pending_invite

    response = await graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": token},
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_organization_invite_query_empty_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization invite query with empty token."""
    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": ""},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"


async def test_organization_invite_query_whitespace_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization invite query with whitespace token."""
    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": "   "},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"


async def test_organization_invite_query_special_characters_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization invite query with special characters in token."""
    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": "!@#$%^&*()"},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"


async def test_organization_invite_query_case_sensitive_token(
    password_auth_graphql_client: GraphQLClient,
    pending_invite: tuple[OrganizationInvite, str],
) -> None:
    """Test that invite tokens are case-sensitive."""
    _, token = pending_invite

    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": token.upper()},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"


async def test_organization_invite_query_hidden_invite(
    password_auth_graphql_client: GraphQLClient,
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
    password_account: Account,
) -> None:
    """Test organization invite query with hidden invite."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=password_account.email,
        account=foreign_password_account,
        member_role="member",
    )

    # Mark as hidden
    invite.is_hidden = True
    await invite.save()

    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": token},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

    await organization_invite_repo.delete(invite)


async def test_organization_invite_query_admin_role(
    password_auth_graphql_client: GraphQLClient,
    test_organization: Organization,
    organization_invite_repo: OrganizationInviteRepo,
    foreign_password_account: Account,
    password_account: Account,
) -> None:
    """Test organization invite query with admin role."""
    invite, token = await organization_invite_repo.create(
        organization=test_organization,
        email=password_account.email,
        account=foreign_password_account,
        member_role="admin",
    )

    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": token},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == invite.email

    await organization_invite_repo.delete(invite)


async def test_organization_invite_query_very_long_token(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization invite query with very long token."""
    long_token = "a" * 500

    response = await password_auth_graphql_client(
        ORGANIZATION_INVITE_QUERY,
        variables={"inviteToken": long_token},
    )

    data = response["data"]["organizationInvite"]
    assert data["__typename"] == "OrganizationInviteNotFoundError"

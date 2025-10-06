from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization, OrganizationMember
from app.organizations.repositories import (
    OrganizationMemberRepo,
    OrganizationRepo,
)
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

PROMOTE_ORGANIZATION_MEMBER_MUTATION = """
mutation PromoteOrganizationMemberMutation(
    $organizationId: ID!
    $accountId: ID!
) {
    promoteOrganizationMember(
        organizationId: $organizationId
        accountId: $accountId
    ) {
        __typename
        ... on PromoteOrganizationMemberSuccess {
            organization {
                id
                name
                slug
            }
            organizationMemberEdge {
                node {
                    id
                    fullName
                    email
                }
            }
        }
        ... on OrganizationNotFoundError {
            __typename
            message
        }
        ... on OrganizationMemberNotFoundError {
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
async def target_member(
    admin_organization: Organization,
    foreign_password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[OrganizationMember]:
    """Create a member to be promoted in the admin organization."""
    member = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=admin_organization.id,
        role="member",
    )
    yield member
    await organization_member_repo.delete(member)


async def test_promote_organization_member_successful(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    target_member: OrganizationMember,
    foreign_password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test successful promotion of an organization member."""
    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["promoteOrganizationMember"]
    assert data["__typename"] == "PromoteOrganizationMemberSuccess"
    assert data["organization"]["id"] == relay.to_base64(
        "Organization", admin_organization.id
    )
    assert data["organizationMemberEdge"]["node"]["id"] == relay.to_base64(
        "Account", foreign_password_account.id
    )

    # Verify member role was updated
    updated_member = await organization_member_repo.get(
        account_id=foreign_password_account.id,
        organization_id=admin_organization.id,
    )
    assert updated_member is not None
    assert updated_member.role == "admin"


async def test_promote_organization_member_organization_not_found(
    password_auth_sudo_graphql_client: GraphQLClient,
    foreign_password_account: Account,
) -> None:
    """Test promotion with non-existent organization ID."""
    invalid_org_id = relay.to_base64("Organization", "507f1f77bcf86cd799439011")

    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": invalid_org_id,
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["promoteOrganizationMember"]
    assert data["__typename"] == "OrganizationNotFoundError"
    assert "not found" in data["message"].lower()


async def test_promote_organization_member_member_not_found(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test promotion with non-existent member account ID."""
    invalid_account_id = relay.to_base64("Account", "507f1f77bcf86cd799439011")

    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": invalid_account_id,
        },
    )

    data = response["data"]["promoteOrganizationMember"]
    assert data["__typename"] == "OrganizationMemberNotFoundError"
    assert "not found" in data["message"].lower()


async def test_promote_organization_member_authorization_error_not_admin(
    password_auth_sudo_graphql_client: GraphQLClient,
    member_organization: Organization,
    foreign_password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test promotion fails when user is not an admin."""
    member = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=member_organization.id,
        role="member",
    )

    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", member_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["promoteOrganizationMember"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]

    await organization_member_repo.delete(member)


async def test_promote_organization_member_authorization_error_not_member(
    password_auth_sudo_graphql_client: GraphQLClient,
    foreign_organization: Organization,
    foreign_password_account: Account,
) -> None:
    """Test promotion fails when user is not a member of the organization."""
    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", foreign_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["promoteOrganizationMember"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]


async def test_promote_organization_member_already_admin(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    foreign_password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test promoting a member who is already an admin."""
    admin_member = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=admin_organization.id,
        role="admin",
    )

    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["promoteOrganizationMember"]
    assert data["__typename"] == "PromoteOrganizationMemberSuccess"

    # Verify member is still admin
    updated_member = await organization_member_repo.get(
        account_id=foreign_password_account.id,
        organization_id=admin_organization.id,
    )
    assert updated_member is not None
    assert updated_member.role == "admin"

    await organization_member_repo.delete(admin_member)


async def test_promote_organization_member_unauthenticated(
    graphql_client: GraphQLClient,
    admin_organization: Organization,
    target_member: OrganizationMember,
    foreign_password_account: Account,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_promote_organization_member_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    target_member: OrganizationMember,
    foreign_password_account: Account,
) -> None:
    """Test that promotion requires sudo mode."""
    response = await password_auth_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    assert "errors" in response
    assert any(
        "sudo" in str(error).lower() or "permission" in str(error).lower()
        for error in response["errors"]
    )


async def test_promote_organization_member_invalid_organization_id_format(
    password_auth_sudo_graphql_client: GraphQLClient,
    foreign_password_account: Account,
) -> None:
    """Test promotion with malformed organization ID."""
    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": "invalid-id-format",
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    assert "errors" in response


async def test_promote_organization_member_invalid_account_id_format(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test promotion with malformed account ID."""
    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": "invalid-id-format",
        },
    )

    assert "errors" in response


async def test_promote_organization_member_empty_organization_id(
    password_auth_sudo_graphql_client: GraphQLClient,
    foreign_password_account: Account,
) -> None:
    """Test promotion with empty organization ID."""
    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": "",
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    assert "errors" in response


async def test_promote_organization_member_empty_account_id(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test promotion with empty account ID."""
    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": "",
        },
    )

    assert "errors" in response


async def test_promote_organization_member_from_wrong_organization(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    foreign_organization: Organization,
    foreign_password_account: Account,
) -> None:
    """Test promoting a member from wrong organization fails."""
    # foreign_password_account is a member of foreign_organization, not admin_organization
    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["promoteOrganizationMember"]
    assert data["__typename"] == "OrganizationMemberNotFoundError"


async def test_promote_organization_member_self(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    password_account: Account,
) -> None:
    """Test that an admin can promote themselves (idempotent operation)."""
    response = await password_auth_sudo_graphql_client(
        PROMOTE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", password_account.id),
        },
    )

    data = response["data"]["promoteOrganizationMember"]
    assert data["__typename"] == "PromoteOrganizationMemberSuccess"

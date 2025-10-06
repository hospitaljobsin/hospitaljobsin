from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.accounts.repositories import AccountRepo
from app.organizations.documents import Organization, OrganizationMember
from app.organizations.repositories import (
    OrganizationMemberRepo,
    OrganizationRepo,
)
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email
from tests.utils.slugs import generate_test_slug

REMOVE_ORGANIZATION_MEMBER_MUTATION = """
mutation RemoveOrganizationMemberMutation(
    $organizationId: ID!
    $accountId: ID!
) {
    removeOrganizationMember(
        organizationId: $organizationId
        accountId: $accountId
    ) {
        __typename
        ... on RemoveOrganizationMemberSuccess {
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
    """Create a member to be removed from the admin organization."""
    member = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=admin_organization.id,
        role="member",
    )
    yield member
    await organization_member_repo.delete(member)


@pytest.fixture
async def target_admin_member(
    admin_organization: Organization,
    foreign_password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[OrganizationMember]:
    """Create an admin member in the admin organization."""
    member = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=admin_organization.id,
        role="admin",
    )
    yield member
    await organization_member_repo.delete(member)


@pytest.fixture
async def third_account(
    account_repo: AccountRepo,
) -> AsyncGenerator[Account]:
    """Create a third account for testing multiple members."""
    account = await account_repo.create(
        email=generate_test_email(),
        full_name="Third User",
        password="Password123!",
        auth_providers=["password"],
    )
    yield account
    await account_repo.delete(account)


async def test_remove_organization_member_successful(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    target_member: OrganizationMember,
    foreign_password_account: Account,
) -> None:
    """Test successful removal of an organization member."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["removeOrganizationMember"]
    assert data["__typename"] == "RemoveOrganizationMemberSuccess"
    assert data["organization"]["id"] == relay.to_base64(
        "Organization", admin_organization.id
    )
    assert data["organizationMemberEdge"]["node"]["id"] == relay.to_base64(
        "Account", foreign_password_account.id
    )


async def test_remove_organization_member_organization_not_found(
    password_auth_sudo_graphql_client: GraphQLClient,
    foreign_password_account: Account,
) -> None:
    """Test removal with non-existent organization ID."""
    invalid_org_id = relay.to_base64("Organization", "507f1f77bcf86cd799439011")

    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": invalid_org_id,
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["removeOrganizationMember"]
    assert data["__typename"] == "OrganizationNotFoundError"
    assert "not found" in data["message"].lower()


async def test_remove_organization_member_member_not_found(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test removal with non-existent member account ID."""
    invalid_account_id = relay.to_base64("Account", "507f1f77bcf86cd799439011")

    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": invalid_account_id,
        },
    )

    data = response["data"]["removeOrganizationMember"]
    assert data["__typename"] == "OrganizationMemberNotFoundError"
    assert "not found" in data["message"].lower()


async def test_remove_organization_member_authorization_error_not_admin(
    password_auth_sudo_graphql_client: GraphQLClient,
    member_organization: Organization,
    foreign_password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test removal fails when user is not an admin."""
    member = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=member_organization.id,
        role="member",
    )

    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", member_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["removeOrganizationMember"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]

    await organization_member_repo.delete(member)


async def test_remove_organization_member_authorization_error_not_member(
    password_auth_sudo_graphql_client: GraphQLClient,
    foreign_organization: Organization,
    foreign_password_account: Account,
) -> None:
    """Test removal fails when user is not a member of the organization."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", foreign_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["removeOrganizationMember"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]


async def test_remove_organization_member_cannot_remove_admin(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    target_admin_member: OrganizationMember,
    foreign_password_account: Account,
) -> None:
    """Test that admins cannot remove other admins."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["removeOrganizationMember"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]


async def test_remove_organization_member_unauthenticated(
    graphql_client: GraphQLClient,
    admin_organization: Organization,
    target_member: OrganizationMember,
    foreign_password_account: Account,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
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


async def test_remove_organization_member_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    target_member: OrganizationMember,
    foreign_password_account: Account,
) -> None:
    """Test that removal requires sudo mode."""
    response = await password_auth_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
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


async def test_remove_organization_member_invalid_organization_id_format(
    password_auth_sudo_graphql_client: GraphQLClient,
    foreign_password_account: Account,
) -> None:
    """Test removal with malformed organization ID."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": "invalid-id-format",
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    assert "errors" in response


async def test_remove_organization_member_invalid_account_id_format(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test removal with malformed account ID."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": "invalid-id-format",
        },
    )

    assert "errors" in response


async def test_remove_organization_member_empty_organization_id(
    password_auth_sudo_graphql_client: GraphQLClient,
    foreign_password_account: Account,
) -> None:
    """Test removal with empty organization ID."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": "",
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    assert "errors" in response


async def test_remove_organization_member_empty_account_id(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test removal with empty account ID."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": "",
        },
    )

    assert "errors" in response


async def test_remove_organization_member_twice(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    target_member: OrganizationMember,
    foreign_password_account: Account,
) -> None:
    """Test removing the same member twice fails on second attempt."""
    # First removal should succeed
    response1 = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data1 = response1["data"]["removeOrganizationMember"]
    assert data1["__typename"] == "RemoveOrganizationMemberSuccess"

    # Second removal should fail
    response2 = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data2 = response2["data"]["removeOrganizationMember"]
    assert data2["__typename"] == "OrganizationMemberNotFoundError"


async def test_remove_organization_member_multiple_members(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    organization_member_repo: OrganizationMemberRepo,
    foreign_password_account: Account,
    third_account: Account,
) -> None:
    """Test removing one member doesn't affect other members."""
    member1 = await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=admin_organization.id,
        role="member",
    )

    member2 = await organization_member_repo.create(
        account=third_account,
        organization_id=admin_organization.id,
        role="member",
    )

    # Remove first member
    response1 = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data1 = response1["data"]["removeOrganizationMember"]
    assert data1["__typename"] == "RemoveOrganizationMemberSuccess"

    # Second member should still be removable
    response2 = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", third_account.id),
        },
    )

    data2 = response2["data"]["removeOrganizationMember"]
    assert data2["__typename"] == "RemoveOrganizationMemberSuccess"

    await organization_member_repo.delete(member1)
    await organization_member_repo.delete(member2)


async def test_remove_organization_member_from_wrong_organization(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    foreign_organization: Organization,
    foreign_password_account: Account,
) -> None:
    """Test removing a member from wrong organization fails."""
    # foreign_password_account is a member of foreign_organization, not admin_organization
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", foreign_password_account.id),
        },
    )

    data = response["data"]["removeOrganizationMember"]
    assert data["__typename"] == "OrganizationMemberNotFoundError"


async def test_remove_organization_member_cannot_remove_self(
    password_auth_sudo_graphql_client: GraphQLClient,
    admin_organization: Organization,
    password_account: Account,
) -> None:
    """Test that an admin cannot remove themselves if they are the only admin."""
    response = await password_auth_sudo_graphql_client(
        REMOVE_ORGANIZATION_MEMBER_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "accountId": relay.to_base64("Account", password_account.id),
        },
    )

    data = response["data"]["removeOrganizationMember"]
    assert data["__typename"] == "OrganizationAuthorizationError"

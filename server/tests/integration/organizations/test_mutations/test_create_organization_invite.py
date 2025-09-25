from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.emails import generate_test_email
from tests.utils.slugs import generate_test_slug

CREATE_ORGANIZATION_INVITE_MUTATION = """
mutation CreateOrganizationInviteMutation(
    $organizationId: ID!
    $email: String!
    $memberRole: OrganizationMemberRole = MEMBER
) {
    createOrganizationInvite(
        organizationId: $organizationId
        email: $email
        memberRole: $memberRole
    ) {
        __typename
        ... on OrganizationInvite {
            id
            email
            status
            createdAt
            expiresAt
            createdBy {
                id
                email
                fullName
            }
            organization {
                id
                name
                slug
            }
        }
        ... on OrganizationNotFoundError {
            __typename
            message
        }
        ... on MemberAlreadyExistsError {
            __typename
            message
        }
        ... on InvalidEmailError {
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


async def test_create_organization_invite_successful_default_role(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test successful invite creation with default member role."""
    email = generate_test_email()

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": email,
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == email
    assert data["status"] == "PENDING"
    assert data["createdAt"] is not None
    assert data["expiresAt"] is not None
    assert data["createdBy"]["email"] is not None
    assert data["organization"]["id"] == relay.to_base64(
        "Organization", admin_organization.id
    )
    assert data["organization"]["name"] == admin_organization.name
    assert data["organization"]["slug"] == admin_organization.slug


async def test_create_organization_invite_successful_admin_role(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test successful invite creation with admin role."""
    email = generate_test_email()

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": email,
            "memberRole": "ADMIN",
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == email
    assert data["status"] == "PENDING"


async def test_create_organization_invite_successful_member_role(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test successful invite creation with explicit member role."""
    email = generate_test_email()

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": email,
            "memberRole": "MEMBER",
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == email
    assert data["status"] == "PENDING"


async def test_create_organization_invite_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test invite creation with non-existent organization ID."""
    invalid_org_id = relay.to_base64("Organization", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": invalid_org_id,
            "email": generate_test_email(),
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationNotFoundError"
    assert "not found" in data["message"].lower()


async def test_create_organization_invite_authorization_error_not_admin(
    password_auth_graphql_client: GraphQLClient,
    member_organization: Organization,
) -> None:
    """Test invite creation fails when user is not an admin."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", member_organization.id),
            "email": generate_test_email(),
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]


async def test_create_organization_invite_authorization_error_not_member(
    password_auth_graphql_client: GraphQLClient,
    foreign_organization: Organization,
) -> None:
    """Test invite creation fails when user is not a member of the organization."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", foreign_organization.id),
            "email": generate_test_email(),
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationAuthorizationError"
    assert "sufficient role privileges" in data["message"]


async def test_create_organization_invite_member_already_exists(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    foreign_password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test invite creation fails when user is already a member."""
    # Add the foreign account as a member
    await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=admin_organization.id,
        role="member",
    )

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": foreign_password_account.email,
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "MemberAlreadyExistsError"
    assert "already a member" in data["message"]


@pytest.mark.parametrize(
    ("email", "expected_error"),
    [
        ("", "InvalidEmailError"),
        ("invalid-email", "InvalidEmailError"),
        ("@example.com", "InvalidEmailError"),
        ("test@", "InvalidEmailError"),
        ("test..test@example.com", "InvalidEmailError"),
        ("test@example", "InvalidEmailError"),
        ("test@.com", "InvalidEmailError"),
    ],
)
async def test_create_organization_invite_invalid_email(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    email: str,
    expected_error: str,
) -> None:
    """Test invite creation with various invalid email formats."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": email,
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == expected_error


@pytest.mark.parametrize(
    "email",
    [
        "test@gmail.com",
        "user.name@yahoo.com",
        "test+tag@outlook.com",
        "123@hotmail.com",
        "test_user@protonmail.com",
    ],
)
async def test_create_organization_invite_valid_email_formats(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
    email: str,
) -> None:
    """Test invite creation with various valid email formats."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": email,
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == email.lower()  # Email should be normalized


async def test_create_organization_invite_unauthenticated(
    graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": generate_test_email(),
        },
    )

    # Should return an authentication error
    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_create_organization_invite_multiple_invites_same_email(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test creating multiple invites for the same email (should succeed)."""
    email = generate_test_email()

    # Create first invite
    response1 = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": email,
        },
    )

    data1 = response1["data"]["createOrganizationInvite"]
    assert data1["__typename"] == "OrganizationInvite"

    # Create second invite for same email (should succeed)
    response2 = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": email,
        },
    )

    data2 = response2["data"]["createOrganizationInvite"]
    assert data2["__typename"] == "OrganizationInvite"
    assert data2["email"] == email
    # Should be different invite IDs
    assert data1["id"] != data2["id"]


async def test_create_organization_invite_case_insensitive_email(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test that email normalization works correctly."""
    base_email = "test@gmail.com"
    upper_email = "TEST@GMAIL.COM"

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": upper_email,
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == base_email.lower()


async def test_create_organization_invite_long_email(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test invite creation with very long email address."""
    # Create a long but valid email with deliverable domain
    long_local = "a" * 50  # Reasonable length for testing
    long_email = f"{long_local}@gmail.com"

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": long_email,
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == long_email


async def test_create_organization_invite_special_characters_email(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test invite creation with special characters in email."""
    special_email = "test+special.chars_123@gmail.com"

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": special_email,
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    assert data["email"] == special_email


async def test_create_organization_invite_invalid_organization_id_format(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test invite creation with malformed organization ID."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": "invalid-id-format",
            "email": generate_test_email(),
        },
    )

    # Should return a GraphQL error for invalid ID format
    assert "errors" in response


async def test_create_organization_invite_empty_organization_id(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test invite creation with empty organization ID."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": "",
            "email": generate_test_email(),
        },
    )

    # Should return a GraphQL error for empty ID
    assert "errors" in response


async def test_create_organization_invite_whitespace_email(
    password_auth_graphql_client: GraphQLClient,
    admin_organization: Organization,
) -> None:
    """Test invite creation with whitespace in email."""
    email_with_spaces = "  test@gmail.com  "

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_INVITE_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", admin_organization.id),
            "email": email_with_spaces,
        },
    )

    data = response["data"]["createOrganizationInvite"]
    assert data["__typename"] == "OrganizationInvite"
    # Email should be normalized (trimmed)
    assert data["email"] == "test@gmail.com"

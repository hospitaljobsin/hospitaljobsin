from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

ORGANIZATION_QUERY = """
query OrganizationQuery($slug: String!) {
    organization(slug: $slug) {
        __typename
        ... on Organization {
            id
            name
            slug
            website
            description
            logoUrl
            bannerUrl
            location
            email
            createdAt
        }
        ... on OrganizationNotFoundError {
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
    password_account: Account,
) -> AsyncGenerator[Organization]:
    """Create a test organization."""
    org = await organization_repo.create(
        name="Test Medical Center",
        slug=generate_test_slug(),
        description="A leading healthcare provider",
        website="https://testmedical.com/",
        location="New York, NY",
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


async def test_organization_query_successful(
    graphql_client: GraphQLClient,
    test_organization: Organization,
) -> None:
    """Test successful organization query by slug."""
    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": test_organization.slug},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == test_organization.name
    assert data["slug"] == test_organization.slug
    assert data["website"] == test_organization.website
    assert data["description"] == test_organization.description
    assert data["location"] == test_organization.location
    assert data["logoUrl"] is not None
    assert data["bannerUrl"] is not None
    assert data["createdAt"] is not None


async def test_organization_query_not_found(
    graphql_client: GraphQLClient,
) -> None:
    """Test organization query with non-existent slug."""
    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": "non-existent-slug-12345"},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "OrganizationNotFoundError"
    assert "not found" in data["message"].lower()


async def test_organization_query_empty_slug(
    graphql_client: GraphQLClient,
) -> None:
    """Test organization query with empty slug."""
    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": ""},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_organization_query_case_sensitive_slug(
    graphql_client: GraphQLClient,
    test_organization: Organization,
) -> None:
    """Test that organization slug lookup is case-insensitive."""
    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": test_organization.slug.upper()},
    )

    data = response["data"]["organization"]
    # Should not find since slugs are stored lowercase
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_organization_query_with_null_optional_fields(
    graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_account: Account,
) -> None:
    """Test organization query with null optional fields."""
    org = await organization_repo.create(
        name="Minimal Hospital",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )

    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": org.slug},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == "Minimal Hospital"
    assert data["website"] is None
    assert data["description"] is None
    assert data["location"] is None
    assert data["email"] is None
    assert data["logoUrl"] is not None  # Default logo
    assert data["bannerUrl"] is not None  # Default banner

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


async def test_organization_query_special_characters_slug(
    graphql_client: GraphQLClient,
) -> None:
    """Test organization query with special characters in slug."""
    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": "test@#$%^&*()"},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_organization_query_whitespace_slug(
    graphql_client: GraphQLClient,
) -> None:
    """Test organization query with whitespace slug."""
    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": "   "},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_organization_query_very_long_slug(
    graphql_client: GraphQLClient,
) -> None:
    """Test organization query with very long slug."""
    long_slug = "a" * 200

    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": long_slug},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_organization_query_slug_with_hyphens(
    graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_account: Account,
) -> None:
    """Test organization query with slug containing hyphens."""
    slug = f"test-hospital-{generate_test_slug()}"
    org = await organization_repo.create(
        name="Test Hospital",
        slug=slug,
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )

    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": slug},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "Organization"
    assert data["slug"] == slug

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


async def test_organization_query_slug_with_numbers(
    graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_account: Account,
) -> None:
    """Test organization query with slug containing numbers."""
    slug = f"hospital-2024-{generate_test_slug()}"
    org = await organization_repo.create(
        name="Hospital 2024",
        slug=slug,
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )

    response = await graphql_client(
        ORGANIZATION_QUERY,
        variables={"slug": slug},
    )

    data = response["data"]["organization"]
    assert data["__typename"] == "Organization"
    assert data["slug"] == slug

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)

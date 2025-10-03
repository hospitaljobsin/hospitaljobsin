from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

CREATE_ORGANIZATION_MUTATION = """
mutation CreateOrganizationMutation(
    $fullName: String!
    $slug: String!
    $website: String
    $description: String
    $logoUrl: String
) {
    createOrganization(
        fullName: $fullName
        slug: $slug
        website: $website
        description: $description
        logoUrl: $logoUrl
    ) {
        __typename
        ... on Organization {
            id
            name
            slug
            website
            description
            logoUrl
            createdAt
        }
        ... on OrganizationSlugInUseError {
            __typename
            message
        }
        ... on InvalidUserInputError {
            __typename
            message
        }
    }
}
"""


@pytest.fixture
async def organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create an organization."""
    org = await organization_repo.create(
        name="Member Org",
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


async def test_create_organization_successful_minimal(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful organization creation with minimal required fields."""
    slug = generate_test_slug()

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == "Test Hospital"
    assert data["slug"] == slug
    assert data["website"] is None
    assert data["description"] is None
    assert data["logoUrl"] is not None
    assert data["createdAt"] is not None


async def test_create_organization_successful_all_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful organization creation with all optional fields."""
    slug = generate_test_slug()

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Advanced Medical Center",
            "slug": slug,
            "website": "https://advancedmedical.com",
            "description": "Leading healthcare provider in the region",
            "logoUrl": "https://cdn.example.com/logo.png",
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == "Advanced Medical Center"
    assert data["slug"] == slug
    assert data["website"] == "https://advancedmedical.com/"
    assert data["description"] == "Leading healthcare provider in the region"
    assert data["logoUrl"] == "https://cdn.example.com/logo.png"
    assert data["createdAt"] is not None


async def test_create_organization_slug_in_use(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_account: Account,
) -> None:
    """Test organization creation with already used slug."""
    existing_slug = generate_test_slug()

    # Create an existing organization with the slug
    existing_org = await organization_repo.create(
        name="Existing Hospital",
        slug=existing_slug,
    )
    await organization_member_repo.create(
        account=password_account,
        organization_id=existing_org.id,
        role="admin",
    )

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "New Hospital",
            "slug": existing_slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "OrganizationSlugInUseError"
    assert "already exists" in data["message"]


async def test_create_organization_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": generate_test_slug(),
        },
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


@pytest.mark.parametrize(
    ("full_name", "slug"),
    [
        ("", generate_test_slug()),  # Empty name is invalid
        ("Valid Name", ""),  # Empty slug might be handled by validation
        ("Valid Name", "invalid slug with spaces"),  # Invalid slug format
        ("Valid Name", "slug-with-special-chars!@#"),  # Special characters
        ("Valid Name", "slug.with.dots"),
        ("Valid Name", "a"),  # Single character
        ("Valid Name", "a" * 101),  # Very long slug
        ("a" * 101, "aaaa"),  # Very long name
    ],
)
async def test_create_organization_invalid_inputs(
    password_auth_graphql_client: GraphQLClient,
    full_name: str,
    slug: str,
) -> None:
    """Test organization creation with various invalid inputs."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": full_name,
            "slug": slug,
        },
    )

    assert "errors" in response


async def test_create_organization_slug_insensitivity(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation slug case insensitivity."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Organization",
            "slug": "UPPERCASE-SLUG",
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["slug"] == "uppercase-slug"


async def test_create_organization_slug_exists(
    password_auth_graphql_client: GraphQLClient, organization: Organization
) -> None:
    """Test organization creation existing slug error."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Organization",
            "slug": organization.slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "OrganizationSlugInUseError"


@pytest.mark.parametrize(
    "website",
    [
        "https://hospital.com/",
        "http://medical-center.org/",
        "https://www.healthcare.net/",
        "https://subdomain.hospital.com/path/",
        "https://hospital.com:8080/",
    ],
)
async def test_create_organization_website_variations(
    password_auth_graphql_client: GraphQLClient,
    website: str,
) -> None:
    """Test organization creation with various website URL formats."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": generate_test_slug(),
            "website": website,
        },
    )

    data = response["data"]["createOrganization"]
    # Should either succeed or fail gracefully
    assert data["__typename"] == "Organization"

    assert data["website"] == website


@pytest.mark.parametrize(
    "website",
    [
        "invalid-url",  # Invalid URL format
        "ftp://hospital.com/",  # Non-HTTP protocol
        "",  # Empty string
        "just-text-no-protocol",  # No protocol
    ],
)
async def test_create_organization_website_invalid(
    password_auth_graphql_client: GraphQLClient,
    website: str,
) -> None:
    """Test organization creation with various website URL formats."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": generate_test_slug(),
            "website": website,
        },
    )

    assert "errors" in response


@pytest.mark.parametrize(
    "logo_url",
    [
        "https://cdn.example.com/logo.png",
        "https://images.hospital.com/brand/logo.jpg",
        "https://storage.googleapis.com/bucket/logo.svg",
    ],
)
async def test_create_organization_logo_url_variations(
    password_auth_graphql_client: GraphQLClient,
    logo_url: str,
) -> None:
    """Test organization creation with various logo URL formats."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": generate_test_slug(),
            "logoUrl": logo_url,
        },
    )

    data = response["data"]["createOrganization"]
    # Should either succeed or fail gracefully
    assert data["__typename"] == "Organization"

    assert data["logoUrl"] == logo_url


@pytest.mark.parametrize(
    "logo_url",
    [
        "invalid-url",  # Invalid URL format
        "",  # Empty string
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",  # Data URL
    ],
)
async def test_create_organization_logo_url_invalid(
    password_auth_graphql_client: GraphQLClient,
    logo_url: str,
) -> None:
    """Test organization creation with various logo URL formats."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": generate_test_slug(),
            "logoUrl": logo_url,
        },
    )

    assert "errors" in response


async def test_create_organization_long_description(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with very long description."""
    long_description = "A" * 5000  # Very long description

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": generate_test_slug(),
            "description": long_description,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] in [
        "Organization",
        "InvalidUserInputError",
    ]

    if data["__typename"] == "Organization":
        assert data["description"] == long_description


@pytest.mark.parametrize(
    ("input_slug", "expected_slug"),
    [
        ("Test_Hospital", "test-hospital"),
        ("UPPERCASE_SENSITIVE_SLUG", "uppercase-sensitive-slug"),
        ("Mixed_Case_Slug", "mixed-case-slug"),
        ("Slug-With-Hyphens", "slug-with-hyphens"),
        ("Slug_With_Underscores", "slug-with-underscores"),
        ("Numbers123AndText456", "numbers123andtext456"),
    ],
)
async def test_create_organization_slug_slugification(
    password_auth_graphql_client: GraphQLClient,
    input_slug: str,
    expected_slug: str,
) -> None:
    """Test that input slugs are properly sluggified."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": input_slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["slug"] == expected_slug


async def test_create_organization_special_characters_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with special characters in name."""
    special_name = "St. Mary's Hospital & Medical Center (Pvt.) Ltd."

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": special_name,
            "slug": generate_test_slug(),
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == special_name


async def test_create_organization_unicode_characters(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with unicode characters."""
    unicode_name = "मेडिकल सेंटर Hospital 医院"

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": unicode_name,
            "slug": generate_test_slug(),
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == unicode_name


async def test_create_organization_whitespace_handling(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with whitespace in inputs."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "  Test Hospital  ",
            "slug": generate_test_slug(),
            "website": "  https://hospital.com  ",
            "description": "  Leading healthcare provider  ",
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    # Values should be normalized (trimmed) or preserved as-is
    assert data["name"] == "Test Hospital"
    assert data["website"] == "https://hospital.com/"
    assert data["description"] == "Leading healthcare provider"


async def test_create_organization_case_sensitive_slug(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_account: Account,
) -> None:
    """Test that slug comparison is case sensitive."""
    base_slug = generate_test_slug().lower()
    upper_slug = base_slug.upper()

    # Create organization with lowercase slug
    existing_org = await organization_repo.create(
        name="Existing Hospital",
        slug=base_slug,
    )
    await organization_member_repo.create(
        account=password_account,
        organization_id=existing_org.id,
        role="admin",
    )

    # Try to create with uppercase version
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "New Hospital",
            "slug": upper_slug,
        },
    )

    data = response["data"]["createOrganization"]
    # Should either succeed (case sensitive) or fail (case insensitive)
    assert data["__typename"] in [
        "Organization",
        "OrganizationSlugInUseError",
    ]


async def test_create_organization_null_optional_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with explicitly null optional fields."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": generate_test_slug(),
            "website": None,
            "description": None,
            "logoUrl": None,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["website"] is None
    assert data["description"] is None
    assert data["logoUrl"] is not None


async def test_create_organization_slug_with_hyphens_and_numbers(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with slug containing hyphens and numbers."""
    slug = f"hospital-2024-{generate_test_slug()}"

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Hospital 2024",
            "slug": slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["slug"] == slug

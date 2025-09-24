import pytest
from app.accounts.documents import Account
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from bson import ObjectId
from strawberry import relay

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
            description
            website
            logoUrl
            createdAt
        }
        ... on OrganizationSlugInUseError {
            __typename
            message
        }
    }
}
"""


async def test_create_organization_successful_minimal(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful organization creation with minimal required fields."""
    name = "Test Hospital"
    slug = generate_test_slug()

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": name,
            "slug": slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == name
    assert data["slug"] == slug
    assert data["description"] is None
    assert data["website"] is None
    assert data["createdAt"] is not None
    assert data["id"] is not None


async def test_create_organization_successful_all_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test successful organization creation with all optional fields."""
    name = "Complete Medical Center"
    slug = generate_test_slug()
    website = "https://example.com"
    description = "A comprehensive healthcare facility"
    logo_url = "https://example.com/logo.png"

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": name,
            "slug": slug,
            "website": website,
            "description": description,
            "logoUrl": logo_url,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == name
    assert data["slug"] == slug
    assert data["description"] == description
    assert data["website"] == website
    assert data["logoUrl"] == logo_url


async def test_create_organization_slug_in_use(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
) -> None:
    """Test organization creation fails when slug is already in use."""
    existing_slug = generate_test_slug()

    # Create an organization with the slug first
    await organization_repo.create(
        name="Existing Hospital",
        slug=existing_slug,
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


@pytest.mark.parametrize(
    "reserved_slug",
    [
        "www",
        "staging",
        "api",
        "recruiter",
        "seeker",
        "settings",
        "accounts",
        "legal",
        "blog",
        "docs",
    ],
)
async def test_create_organization_reserved_slug(
    password_auth_graphql_client: GraphQLClient,
    reserved_slug: str,
) -> None:
    """Test organization creation fails with reserved slugs."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": reserved_slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "OrganizationSlugInUseError"


async def test_create_organization_creates_admin_member(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test that creating an organization automatically makes the user an admin."""
    name = "Admin Test Hospital"
    slug = generate_test_slug()

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": name,
            "slug": slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"

    # Verify the user is an admin member

    _typen, node_id = relay.from_base64(data["id"])
    org_id = ObjectId(node_id)
    member = await organization_member_repo.get(
        account_id=password_account.id,
        organization_id=org_id,
    )
    assert member is not None
    assert member.role == "admin"


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

    # Should return an authentication error
    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


@pytest.mark.parametrize(
    ("name", "slug"),
    [
        ("", "valid-slug"),  # Empty name
        ("Valid Name", ""),  # Empty slug
        ("", ""),  # Both empty
    ],
)
async def test_create_organization_empty_required_fields(
    password_auth_graphql_client: GraphQLClient,
    name: str,
    slug: str,
) -> None:
    """Test organization creation with empty required fields."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": name,
            "slug": slug,
        },
    )

    # Should return GraphQL validation errors for required fields
    assert "errors" in response


@pytest.mark.parametrize(
    "slug",
    [
        "valid-slug",
        "hospital123",
        "my-medical-center",
        "a",  # Single character
        "test_underscore",
        "UPPERCASE",
        "MixedCase123",
    ],
)
async def test_create_organization_valid_slugs(
    password_auth_graphql_client: GraphQLClient,
    slug: str,
) -> None:
    """Test organization creation with various valid slug formats."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Test Hospital",
            "slug": slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["slug"] == slug


@pytest.mark.parametrize(
    "website",
    [
        "https://example.com",
        "http://hospital.org",
        "https://www.medical-center.co.uk",
        "https://subdomain.example.com/path",
        None,  # No website
    ],
)
async def test_create_organization_website_variations(
    password_auth_graphql_client: GraphQLClient,
    website: str | None,
) -> None:
    """Test organization creation with different website formats."""
    variables = {
        "fullName": "Website Test Hospital",
        "slug": generate_test_slug(),
    }
    if website is not None:
        variables["website"] = website

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables=variables,
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["website"] == website


async def test_create_organization_long_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with very long name."""
    long_name = "A" * 200  # Very long name
    slug = generate_test_slug()

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": long_name,
            "slug": slug,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == long_name


async def test_create_organization_long_description(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with very long description."""
    long_description = (
        "This is a very long description. " * 100
    )  # Very long description

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Description Test Hospital",
            "slug": generate_test_slug(),
            "description": long_description,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    assert data["description"] == long_description


async def test_create_organization_special_characters_name(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with special characters in name."""
    special_name = "St. Mary's Hospital & Medical Center (2024)"

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
    unicode_name = "Hospital São Paulo 医院"

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
    """Test organization creation with whitespace in fields."""
    name_with_spaces = "  Test Hospital  "
    slug_with_spaces = "  test-slug  "

    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": name_with_spaces,
            "slug": slug_with_spaces,
        },
    )

    data = response["data"]["createOrganization"]
    assert data["__typename"] == "Organization"
    # Values should be stored as provided (no automatic trimming in this case)
    assert data["name"] == name_with_spaces
    assert data["slug"] == slug_with_spaces


async def test_create_organization_multiple_organizations_same_user(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test that a user can create multiple organizations."""
    # Create first organization
    response1 = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "First Hospital",
            "slug": generate_test_slug(),
        },
    )

    data1 = response1["data"]["createOrganization"]
    assert data1["__typename"] == "Organization"

    # Create second organization
    response2 = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Second Hospital",
            "slug": generate_test_slug(),
        },
    )

    data2 = response2["data"]["createOrganization"]
    assert data2["__typename"] == "Organization"

    # Should be different organizations
    assert data1["id"] != data2["id"]
    assert data1["slug"] != data2["slug"]


async def test_create_organization_case_sensitive_slugs(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
) -> None:
    """Test that slugs are case sensitive."""
    base_slug = generate_test_slug()

    # Create organization with lowercase slug
    await organization_repo.create(
        name="Lowercase Hospital",
        slug=base_slug.lower(),
    )

    # Try to create with uppercase version
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Uppercase Hospital",
            "slug": base_slug.upper(),
        },
    )

    data = response["data"]["createOrganization"]
    # Should succeed if slugs are case sensitive
    assert data["__typename"] == "Organization"
    assert data["slug"] == base_slug.upper()


async def test_create_organization_null_optional_fields(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with explicitly null optional fields."""
    response = await password_auth_graphql_client(
        CREATE_ORGANIZATION_MUTATION,
        variables={
            "fullName": "Null Fields Hospital",
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


async def test_create_organization_logo_url_variations(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test organization creation with different logo URL formats."""
    logo_urls = [
        "https://example.com/logo.png",
        "https://cdn.example.com/images/logo.jpg",
        "https://storage.googleapis.com/bucket/logo.svg",
        "https://example.com/path/to/logo.webp",
    ]

    for logo_url in logo_urls:
        response = await password_auth_graphql_client(
            CREATE_ORGANIZATION_MUTATION,
            variables={
                "fullName": f"Logo Test Hospital {logo_url[-10:]}",
                "slug": generate_test_slug(),
                "logoUrl": logo_url,
            },
        )

        data = response["data"]["createOrganization"]
        assert data["__typename"] == "Organization"
        assert data["logoUrl"] == logo_url

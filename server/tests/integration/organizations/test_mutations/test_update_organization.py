from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry.relay import to_base64

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

UPDATE_ORGANIZATION_MUTATION = """
mutation UpdateOrganizationMutation(
    $organizationId: ID!
    $name: String!
    $slug: String!
    $location: String
    $website: String
    $description: String
    $logoUrl: String
    $bannerUrl: String
    $homePageBannerUrl: String
    $socialLinks: SocialLinksInput
) {
    updateOrganization(
        organizationId: $organizationId
        name: $name
        slug: $slug
        location: $location
        website: $website
        description: $description
        logoUrl: $logoUrl
        bannerUrl: $bannerUrl
        homePageBannerUrl: $homePageBannerUrl
        socialLinks: $socialLinks
    ) {
        __typename
        ... on Organization {
            id
            name
            slug
            location
            website
            description
            logoUrl
            bannerUrl
            homePageBannerUrl
            socialLinks {
                linkedinUrl
                youtubeUrl
                instagramUrl
                facebookUrl
            }
        }
        ... on OrganizationNotFoundError {
            __typename
            message
        }
        ... on OrganizationSlugInUseError {
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
async def organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create an organization."""
    org = await organization_repo.create(
        name="Test Hospital",
        slug=generate_test_slug(),
        description="Original description",
        website="https://original.com",
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
async def other_organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create another organization."""
    org = await organization_repo.create(
        name="Other Hospital",
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


async def test_update_organization_successful_minimal(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test successful organization update with minimal fields."""
    new_slug = generate_test_slug()

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": "Updated Hospital",
            "slug": new_slug,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == "Updated Hospital"
    assert data["slug"] == new_slug


async def test_update_organization_successful_all_fields(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test successful organization update with all fields."""
    new_slug = generate_test_slug()

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": "Updated Medical Center",
            "slug": new_slug,
            "location": "New York, NY",
            "website": "https://updated.com",
            "description": "Updated description",
            "logoUrl": "https://cdn.example.com/new-logo.png",
            "bannerUrl": "https://cdn.example.com/new-banner.png",
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == "Updated Medical Center"
    assert data["slug"] == new_slug
    assert data["location"] == "New York, NY"
    assert data["website"] == "https://updated.com/"
    assert data["description"] == "Updated description"
    assert data["logoUrl"] == "https://cdn.example.com/new-logo.png"
    assert data["bannerUrl"] == "https://cdn.example.com/new-banner.png"


async def test_update_organization_same_slug(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test updating organization with same slug."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": "Updated Name",
            "slug": organization.slug,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == "Updated Name"
    assert data["slug"] == organization.slug


async def test_update_organization_slug_in_use(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    other_organization: Organization,
) -> None:
    """Test updating organization with slug already in use by another organization."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": "Updated Hospital",
            "slug": other_organization.slug,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "OrganizationSlugInUseError"
    assert "already exists" in data["message"]


async def test_update_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test updating non-existent organization."""
    from bson import ObjectId

    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", fake_id),
            "name": "Updated Hospital",
            "slug": generate_test_slug(),
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_update_organization_unauthorized(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
) -> None:
    """Test updating organization without admin permissions."""
    # Create organization without adding current user as member
    org = await organization_repo.create(
        name="Other Hospital",
        slug=generate_test_slug(),
    )

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "name": "Updated Hospital",
            "slug": generate_test_slug(),
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await organization_repo.delete(org)


async def test_update_organization_unauthenticated(
    graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": "Updated Hospital",
            "slug": generate_test_slug(),
        },
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_update_organization_member_unauthorized(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test that non-admin members cannot update organization."""
    org = await organization_repo.create(
        name="Test Hospital",
        slug=generate_test_slug(),
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="member",
    )

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "name": "Updated Hospital",
            "slug": generate_test_slug(),
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


@pytest.mark.parametrize(
    ("name", "slug"),
    [
        ("", "test"),
        ("Valid Name", ""),
        ("Valid Name", "invalid slug with spaces"),
        ("Valid Name", "slug-with-special-chars!@#"),
        ("Valid Name", "slug.with.dots"),
        ("Valid Name", "a"),
        ("Valid Name", "a" * 101),
        ("a" * 101, "valid-slug"),
    ],
)
async def test_update_organization_invalid_inputs(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    name: str,
    slug: str,
) -> None:
    """Test organization update with various invalid inputs."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": name,
            "slug": slug,
        },
    )

    assert "errors" in response


async def test_update_organization_slug_case_insensitivity(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update slug case insensitivity."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": "Updated Hospital",
            "slug": "UPPERCASE-SLUG",
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["slug"] == "uppercase-slug"


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
async def test_update_organization_website_variations(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    website: str,
) -> None:
    """Test organization update with various website URL formats."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "website": website,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["website"] == website


@pytest.mark.parametrize(
    "website",
    [
        "invalid-url",
        "ftp://hospital.com/",
        "",
        "just-text-no-protocol",
    ],
)
async def test_update_organization_website_invalid(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    website: str,
) -> None:
    """Test organization update with invalid website URLs."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
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
async def test_update_organization_logo_url_variations(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    logo_url: str,
) -> None:
    """Test organization update with various logo URL formats."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "logoUrl": logo_url,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["logoUrl"] == logo_url


@pytest.mark.parametrize(
    "logo_url",
    [
        "invalid-url",
        "",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    ],
)
async def test_update_organization_logo_url_invalid(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    logo_url: str,
) -> None:
    """Test organization update with invalid logo URLs."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "logoUrl": logo_url,
        },
    )

    assert "errors" in response


@pytest.mark.parametrize(
    "banner_url",
    [
        "https://cdn.example.com/banner.png",
        "https://images.hospital.com/brand/banner.jpg",
        "https://storage.googleapis.com/bucket/banner.svg",
    ],
)
async def test_update_organization_banner_url_variations(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    banner_url: str,
) -> None:
    """Test organization update with various banner URL formats."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "bannerUrl": banner_url,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["bannerUrl"] == banner_url


@pytest.mark.parametrize(
    "banner_url",
    [
        "invalid-url",
        "",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    ],
)
async def test_update_organization_banner_url_invalid(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    banner_url: str,
) -> None:
    """Test organization update with invalid banner URLs."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "bannerUrl": banner_url,
        },
    )

    assert "errors" in response


async def test_update_organization_long_description(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with very long description."""
    long_description = "A" * 5000

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "description": long_description,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"

    assert data["description"] == long_description


async def test_update_organization_whitespace_handling(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with whitespace in inputs."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": "  Updated Hospital  ",
            "slug": organization.slug,
            "location": "  New York  ",
            "website": "  https://hospital.com  ",
            "description": "  Updated description  ",
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == "Updated Hospital"
    assert data["location"] == "New York"
    assert data["website"] == "https://hospital.com/"
    assert data["description"] == "Updated description"


async def test_update_organization_null_optional_fields(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with explicitly null optional fields."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": "Updated Hospital",
            "slug": organization.slug,
            "location": None,
            "website": None,
            "description": None,
            "logoUrl": None,
            "bannerUrl": None,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == "Updated Hospital"
    assert data["location"] is None
    assert data["website"] is None
    assert data["description"] is None


async def test_update_organization_special_characters_name(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with special characters in name."""
    special_name = "St. Mary's Hospital & Medical Center (Pvt.) Ltd."

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": special_name,
            "slug": organization.slug,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == special_name


async def test_update_organization_unicode_characters(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with unicode characters."""
    unicode_name = "मेडिकल सेंटर Hospital 医院"

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": unicode_name,
            "slug": organization.slug,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["name"] == unicode_name


async def test_update_organization_location_variations(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with various location formats."""
    locations = [
        "New York, NY",
        "123 Main St, Boston, MA 02101",
        "London, United Kingdom",
        "मुंबई, महाराष्ट्र",
    ]

    for location in locations:
        response = await password_auth_graphql_client(
            UPDATE_ORGANIZATION_MUTATION,
            variables={
                "organizationId": to_base64("Organization", str(organization.id)),
                "name": organization.name,
                "slug": organization.slug,
                "location": location,
            },
        )

        data = response["data"]["updateOrganization"]
        assert data["__typename"] == "Organization"
        assert data["location"] == location


async def test_update_organization_empty_location(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with empty location string."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "location": "",
        },
    )

    assert "errors" in response


async def test_update_organization_very_long_location(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with very long location."""
    long_location = "A" * 201

    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "location": long_location,
        },
    )

    assert "errors" in response


async def test_update_organization_home_page_banner_url(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with home page banner URL."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "homePageBannerUrl": "https://cdn.example.com/home-banner.png",
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["homePageBannerUrl"] == "https://cdn.example.com/home-banner.png"


async def test_update_organization_social_links_all_platforms(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with all social media links."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "socialLinks": {
                "linkedinUrl": "https://linkedin.com/company/test",
                "youtubeUrl": "https://youtube.com/@test",
                "instagramUrl": "https://instagram.com/test",
                "facebookUrl": "https://facebook.com/test",
            },
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["socialLinks"]["linkedinUrl"] == "https://linkedin.com/company/test"
    assert data["socialLinks"]["youtubeUrl"] == "https://youtube.com/@test"
    assert data["socialLinks"]["instagramUrl"] == "https://instagram.com/test"
    assert data["socialLinks"]["facebookUrl"] == "https://facebook.com/test"


async def test_update_organization_social_links_partial(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with partial social media links."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "socialLinks": {
                "linkedinUrl": "https://linkedin.com/company/test",
                "youtubeUrl": None,
                "instagramUrl": None,
                "facebookUrl": None,
            },
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["socialLinks"]["linkedinUrl"] == "https://linkedin.com/company/test"
    assert data["socialLinks"]["youtubeUrl"] is None
    assert data["socialLinks"]["instagramUrl"] is None
    assert data["socialLinks"]["facebookUrl"] is None


async def test_update_organization_social_links_null(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test organization update with null social links."""
    response = await password_auth_graphql_client(
        UPDATE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "name": organization.name,
            "slug": organization.slug,
            "socialLinks": None,
        },
    )

    data = response["data"]["updateOrganization"]
    assert data["__typename"] == "Organization"
    assert data["socialLinks"] is None

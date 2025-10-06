from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from bson import ObjectId
from strawberry.relay import to_base64

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

DELETE_ORGANIZATION_MUTATION = """
mutation DeleteOrganizationMutation($organizationId: ID!) {
    deleteOrganization(organizationId: $organizationId) {
        __typename
        ... on Organization {
            id
            name
            slug
        }
        ... on OrganizationNotFoundError {
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
    )
    org_member = await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


async def test_delete_organization_successful(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    organization_repo: OrganizationRepo,
) -> None:
    """Test successful organization deletion."""
    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
        },
    )

    data = response["data"]["deleteOrganization"]
    assert data["__typename"] == "Organization"
    assert data["id"] == to_base64("Organization", str(organization.id))
    assert data["name"] == organization.name
    assert data["slug"] == organization.slug

    deleted_org = await organization_repo.get(organization_id=organization.id)
    assert deleted_org is None


async def test_delete_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test deleting non-existent organization."""
    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", fake_id),
        },
    )

    data = response["data"]["deleteOrganization"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_delete_organization_unauthorized(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
) -> None:
    """Test deleting organization without admin permissions."""
    org = await organization_repo.create(
        name="Other Hospital",
        slug=generate_test_slug(),
    )

    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
        },
    )

    data = response["data"]["deleteOrganization"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await organization_repo.delete(org)


async def test_delete_organization_unauthenticated(
    graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        DELETE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
        },
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_delete_organization_member_unauthorized(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test that non-admin members cannot delete organization."""
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
        DELETE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
        },
    )

    data = response["data"]["deleteOrganization"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


async def test_delete_organization_invalid_id_format(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test deleting organization with invalid ID format."""
    response = await password_auth_graphql_client(
        DELETE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", "invalid-id"),
        },
    )

    data = response["data"]["deleteOrganization"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_delete_organization_twice(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test deleting the same organization twice."""
    response1 = await password_auth_graphql_client(
        DELETE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
        },
    )

    data1 = response1["data"]["deleteOrganization"]
    assert data1["__typename"] == "Organization"

    response2 = await password_auth_graphql_client(
        DELETE_ORGANIZATION_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
        },
    )

    data2 = response2["data"]["deleteOrganization"]
    assert data2["__typename"] == "OrganizationNotFoundError"

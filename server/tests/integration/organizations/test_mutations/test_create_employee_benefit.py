from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import Organization
from app.organizations.repositories import (
    EmployeeBenefitRepo,
    OrganizationMemberRepo,
    OrganizationRepo,
)
from bson import ObjectId
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

CREATE_EMPLOYEE_BENEFIT_MUTATION = """
mutation CreateEmployeeBenefitMutation(
    $organizationId: ID!
    $title: String!
    $description: String!
    $posterImageUrl: String
) {
    createEmployeeBenefit(
        organizationId: $organizationId
        title: $title
        description: $description
        posterImageUrl: $posterImageUrl
    ) {
        __typename
        ... on CreateEmployeeBenefitSuccess {
            employeeBenefitEdge {
                node {
                    id
                    title
                    description
                    posterImageUrl
                    order
                }
            }
        }
        ... on OrganizationNotFoundError {
            message
        }
        ... on OrganizationAuthorizationError {
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


async def test_create_employee_benefit_successful(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test successful employee benefit creation."""
    response = await password_auth_graphql_client(
        CREATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", str(organization.id)),
            "title": "Health Insurance",
            "description": "Comprehensive health coverage",
            "posterImageUrl": "https://cdn.example.com/health.png",
        },
    )

    data = response["data"]["createEmployeeBenefit"]
    assert data["__typename"] == "CreateEmployeeBenefitSuccess"
    node = data["employeeBenefitEdge"]["node"]
    assert node["title"] == "Health Insurance"
    assert node["description"] == "Comprehensive health coverage"
    assert node["posterImageUrl"] == "https://cdn.example.com/health.png"
    assert node["order"] == 0

    benefit_id = ObjectId(relay.from_base64(node["id"])[1])
    benefit = await employee_benefit_repo.get(
        organization_id=organization.id,
        benefit_id=benefit_id,
    )
    await employee_benefit_repo.delete(benefit)


async def test_create_employee_benefit_without_poster(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test employee benefit creation without poster image."""
    response = await password_auth_graphql_client(
        CREATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", str(organization.id)),
            "title": "Flexible Hours",
            "description": "Work-life balance",
        },
    )

    data = response["data"]["createEmployeeBenefit"]
    assert data["__typename"] == "CreateEmployeeBenefitSuccess"
    node = data["employeeBenefitEdge"]["node"]
    assert node["posterImageUrl"] is None

    benefit_id = ObjectId(relay.from_base64(node["id"])[1])
    benefit = await employee_benefit_repo.get(
        organization_id=organization.id,
        benefit_id=benefit_id,
    )
    await employee_benefit_repo.delete(benefit)


async def test_create_employee_benefit_auto_increment_order(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test that order is auto-incremented."""
    response1 = await password_auth_graphql_client(
        CREATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", str(organization.id)),
            "title": "Benefit 1",
            "description": "First benefit",
        },
    )

    response2 = await password_auth_graphql_client(
        CREATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", str(organization.id)),
            "title": "Benefit 2",
            "description": "Second benefit",
        },
    )

    data1 = response1["data"]["createEmployeeBenefit"]
    data2 = response2["data"]["createEmployeeBenefit"]
    node1 = data1["employeeBenefitEdge"]["node"]
    node2 = data2["employeeBenefitEdge"]["node"]

    assert node1["order"] == 0
    assert node2["order"] == 1

    benefit1_id = ObjectId(relay.from_base64(node1["id"])[1])
    benefit2_id = ObjectId(relay.from_base64(node2["id"])[1])
    benefit1 = await employee_benefit_repo.get(
        organization_id=organization.id,
        benefit_id=benefit1_id,
    )
    benefit2 = await employee_benefit_repo.get(
        organization_id=organization.id,
        benefit_id=benefit2_id,
    )
    await employee_benefit_repo.delete(benefit1)
    await employee_benefit_repo.delete(benefit2)


async def test_create_employee_benefit_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test creating benefit for non-existent organization."""
    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        CREATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", fake_id),
            "title": "Health Insurance",
            "description": "Coverage",
        },
    )

    assert response["data"] is not None
    data = response["data"]["createEmployeeBenefit"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_create_employee_benefit_unauthorized(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
) -> None:
    """Test creating benefit without admin permissions."""
    org = await organization_repo.create(
        name="Other Hospital",
        slug=generate_test_slug(),
    )

    response = await password_auth_graphql_client(
        CREATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", str(org.id)),
            "title": "Health Insurance",
            "description": "Coverage",
        },
    )

    assert response["data"] is not None
    data = response["data"]["createEmployeeBenefit"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await organization_repo.delete(org)


async def test_create_employee_benefit_member_unauthorized(
    password_account: Account,
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> None:
    """Test that non-admin members cannot create benefits."""
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
        CREATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", str(org.id)),
            "title": "Health Insurance",
            "description": "Coverage",
        },
    )

    assert response["data"] is not None
    data = response["data"]["createEmployeeBenefit"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await organization_member_repo.delete(org_member)
    await organization_repo.delete(org)


async def test_create_employee_benefit_unauthenticated(
    graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        CREATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": relay.to_base64("Organization", str(organization.id)),
            "title": "Health Insurance",
            "description": "Coverage",
        },
    )

    assert "errors" in response

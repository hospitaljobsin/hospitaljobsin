from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.organizations.documents import EmployeeBenefit, Organization
from app.organizations.repositories import (
    EmployeeBenefitRepo,
    OrganizationMemberRepo,
    OrganizationRepo,
)
from bson import ObjectId
from strawberry.relay import to_base64

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

UPDATE_EMPLOYEE_BENEFIT_MUTATION = """
mutation UpdateEmployeeBenefitMutation(
    $organizationId: ID!
    $benefitId: ID!
    $title: String
    $description: String
    $posterImageUrl: String
) {
    updateEmployeeBenefit(
        organizationId: $organizationId
        benefitId: $benefitId
        title: $title
        description: $description
        posterImageUrl: $posterImageUrl
    ) {
        __typename
        ... on EmployeeBenefit {
            id
            title
            description
            posterImageUrl
            order
        }
        ... on OrganizationNotFoundError {
            message
        }
        ... on EmployeeBenefitNotFoundError {
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


@pytest.fixture
async def employee_benefit(
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> AsyncGenerator[EmployeeBenefit]:
    """Create an employee benefit."""
    benefit = await employee_benefit_repo.create(
        organization_id=organization.id,
        title="Health Insurance",
        description="Original description",
        poster_image_url="https://cdn.example.com/original.png",
        order=0,
    )
    yield benefit
    await employee_benefit_repo.delete(benefit)


async def test_update_employee_benefit_title(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit: EmployeeBenefit,
) -> None:
    """Test updating benefit title."""
    response = await password_auth_graphql_client(
        UPDATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitId": to_base64("EmployeeBenefit", str(employee_benefit.id)),
            "title": "Updated Health Insurance",
        },
    )

    data = response["data"]["updateEmployeeBenefit"]
    assert data["__typename"] == "EmployeeBenefit"
    assert data["title"] == "Updated Health Insurance"
    assert data["description"] == "Original description"


async def test_update_employee_benefit_all_fields(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit: EmployeeBenefit,
) -> None:
    """Test updating all benefit fields."""
    response = await password_auth_graphql_client(
        UPDATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitId": to_base64("EmployeeBenefit", str(employee_benefit.id)),
            "title": "New Title",
            "description": "New description",
            "posterImageUrl": "https://cdn.example.com/new.png",
        },
    )

    data = response["data"]["updateEmployeeBenefit"]
    assert data["__typename"] == "EmployeeBenefit"
    assert data["title"] == "New Title"
    assert data["description"] == "New description"
    assert data["posterImageUrl"] == "https://cdn.example.com/new.png"


async def test_update_employee_benefit_not_found(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test updating non-existent benefit."""
    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        UPDATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitId": to_base64("EmployeeBenefit", fake_id),
            "title": "Updated Title",
        },
    )

    assert response["data"] is not None
    data = response["data"]["updateEmployeeBenefit"]
    assert data["__typename"] == "EmployeeBenefitNotFoundError"


async def test_update_employee_benefit_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
    employee_benefit: EmployeeBenefit,
) -> None:
    """Test updating benefit for non-existent organization."""
    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        UPDATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", fake_id),
            "benefitId": to_base64("EmployeeBenefit", str(employee_benefit.id)),
            "title": "Updated Title",
        },
    )

    data = response["data"]["updateEmployeeBenefit"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_update_employee_benefit_unauthorized(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test updating benefit without admin permissions."""
    org = await organization_repo.create(
        name="Other Hospital",
        slug=generate_test_slug(),
    )
    benefit = await employee_benefit_repo.create(
        organization_id=org.id,
        title="Benefit",
        description="Description",
        poster_image_url=None,
        order=0,
    )

    response = await password_auth_graphql_client(
        UPDATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "benefitId": to_base64("EmployeeBenefit", str(benefit.id)),
            "title": "Updated",
        },
    )

    data = response["data"]["updateEmployeeBenefit"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await employee_benefit_repo.delete(benefit)
    await organization_repo.delete(org)


async def test_update_employee_benefit_unauthenticated(
    graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit: EmployeeBenefit,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        UPDATE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitId": to_base64("EmployeeBenefit", str(employee_benefit.id)),
            "title": "Updated",
        },
    )

    assert "errors" in response

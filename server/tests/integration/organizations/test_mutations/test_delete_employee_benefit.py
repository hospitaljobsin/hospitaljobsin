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
from strawberry.relay import to_base64

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

DELETE_EMPLOYEE_BENEFIT_MUTATION = """
mutation DeleteEmployeeBenefitMutation(
    $organizationId: ID!
    $benefitId: ID!
) {
    deleteEmployeeBenefit(
        organizationId: $organizationId
        benefitId: $benefitId
    ) {
        __typename
        ... on EmployeeBenefit {
            id
            title
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


async def test_delete_employee_benefit_successful(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test successful benefit deletion."""
    benefit = await employee_benefit_repo.create(
        organization_id=organization.id,
        title="Health Insurance",
        description="Coverage",
        poster_image_url=None,
        order=0,
    )

    response = await password_auth_graphql_client(
        DELETE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitId": to_base64("EmployeeBenefit", str(benefit.id)),
        },
    )

    data = response["data"]["deleteEmployeeBenefit"]
    assert data["__typename"] == "EmployeeBenefit"
    assert data["title"] == "Health Insurance"

    deleted_benefit = await employee_benefit_repo.get(
        organization_id=organization.id,
        benefit_id=benefit.id,
    )
    assert deleted_benefit is None


async def test_delete_employee_benefit_reorders_remaining(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test that remaining benefits are reordered after deletion."""
    benefit1 = await employee_benefit_repo.create(
        organization_id=organization.id,
        title="Benefit 1",
        description="First",
        poster_image_url=None,
        order=0,
    )
    benefit2 = await employee_benefit_repo.create(
        organization_id=organization.id,
        title="Benefit 2",
        description="Second",
        poster_image_url=None,
        order=1,
    )
    benefit3 = await employee_benefit_repo.create(
        organization_id=organization.id,
        title="Benefit 3",
        description="Third",
        poster_image_url=None,
        order=2,
    )

    await password_auth_graphql_client(
        DELETE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitId": to_base64("EmployeeBenefit", str(benefit2.id)),
        },
    )

    remaining = await employee_benefit_repo.get_all_by_organization_id_as_list(
        organization_id=organization.id
    )
    assert len(remaining) == 2
    assert remaining[0].id == benefit1.id
    assert remaining[0].order == 0
    assert remaining[1].id == benefit3.id
    assert remaining[1].order == 1

    await employee_benefit_repo.delete(benefit1)
    await employee_benefit_repo.delete(benefit3)


async def test_delete_employee_benefit_not_found(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test deleting non-existent benefit."""
    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        DELETE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitId": to_base64("EmployeeBenefit", fake_id),
        },
    )

    assert response["data"] is not None
    data = response["data"]["deleteEmployeeBenefit"]
    assert data["__typename"] == "EmployeeBenefitNotFoundError"


async def test_delete_employee_benefit_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
    employee_benefit_repo: EmployeeBenefitRepo,
    organization_repo: OrganizationRepo,
) -> None:
    """Test deleting benefit for non-existent organization."""
    org = await organization_repo.create(
        name="Temp Hospital",
        slug=generate_test_slug(),
    )
    benefit = await employee_benefit_repo.create(
        organization_id=org.id,
        title="Benefit",
        description="Description",
        poster_image_url=None,
        order=0,
    )

    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        DELETE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", fake_id),
            "benefitId": to_base64("EmployeeBenefit", str(benefit.id)),
        },
    )

    data = response["data"]["deleteEmployeeBenefit"]
    assert data["__typename"] == "OrganizationNotFoundError"

    await employee_benefit_repo.delete(benefit)
    await organization_repo.delete(org)


async def test_delete_employee_benefit_unauthorized(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test deleting benefit without admin permissions."""
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
        DELETE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "benefitId": to_base64("EmployeeBenefit", str(benefit.id)),
        },
    )

    data = response["data"]["deleteEmployeeBenefit"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await employee_benefit_repo.delete(benefit)
    await organization_repo.delete(org)


async def test_delete_employee_benefit_unauthenticated(
    graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test that unauthenticated requests are rejected."""
    benefit = await employee_benefit_repo.create(
        organization_id=organization.id,
        title="Benefit",
        description="Description",
        poster_image_url=None,
        order=0,
    )

    response = await graphql_client(
        DELETE_EMPLOYEE_BENEFIT_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitId": to_base64("EmployeeBenefit", str(benefit.id)),
        },
    )

    assert "errors" in response

    await employee_benefit_repo.delete(benefit)

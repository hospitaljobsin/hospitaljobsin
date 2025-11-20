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

REORDER_EMPLOYEE_BENEFITS_MUTATION = """
mutation ReorderEmployeeBenefitsMutation(
    $organizationId: ID!
    $benefitIds: [ID!]!
) {
    reorderEmployeeBenefits(
        organizationId: $organizationId
        benefitIds: $benefitIds
    ) {
        __typename
        ... on ReorderEmployeeBenefitsSuccess {
            employeeBenefits {
                id
                title
                order
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


async def test_reorder_employee_benefits_successful(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test successful benefit reordering."""
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

    response = await password_auth_graphql_client(
        REORDER_EMPLOYEE_BENEFITS_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitIds": [
                to_base64("EmployeeBenefit", str(benefit3.id)),
                to_base64("EmployeeBenefit", str(benefit1.id)),
                to_base64("EmployeeBenefit", str(benefit2.id)),
            ],
        },
    )

    data = response["data"]["reorderEmployeeBenefits"]
    assert data["__typename"] == "ReorderEmployeeBenefitsSuccess"
    benefits = data["employeeBenefits"]
    assert len(benefits) == 3
    assert benefits[0]["title"] == "Benefit 3"
    assert benefits[0]["order"] == 0
    assert benefits[1]["title"] == "Benefit 1"
    assert benefits[1]["order"] == 1
    assert benefits[2]["title"] == "Benefit 2"
    assert benefits[2]["order"] == 2

    await employee_benefit_repo.delete(benefit1)
    await employee_benefit_repo.delete(benefit2)
    await employee_benefit_repo.delete(benefit3)


async def test_reorder_employee_benefits_partial_list(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test reordering with partial list of benefits."""
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

    response = await password_auth_graphql_client(
        REORDER_EMPLOYEE_BENEFITS_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitIds": [
                to_base64("EmployeeBenefit", str(benefit2.id)),
                to_base64("EmployeeBenefit", str(benefit1.id)),
            ],
        },
    )

    data = response["data"]["reorderEmployeeBenefits"]
    assert data["__typename"] == "ReorderEmployeeBenefitsSuccess"

    await employee_benefit_repo.delete(benefit1)
    await employee_benefit_repo.delete(benefit2)
    await employee_benefit_repo.delete(benefit3)


async def test_reorder_employee_benefits_empty_list(
    password_auth_graphql_client: GraphQLClient,
    organization: Organization,
    employee_benefit_repo: EmployeeBenefitRepo,
) -> None:
    """Test reordering with empty list."""
    benefit = await employee_benefit_repo.create(
        organization_id=organization.id,
        title="Benefit",
        description="Description",
        poster_image_url=None,
        order=0,
    )

    response = await password_auth_graphql_client(
        REORDER_EMPLOYEE_BENEFITS_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitIds": [],
        },
    )

    data = response["data"]["reorderEmployeeBenefits"]
    assert data["__typename"] == "ReorderEmployeeBenefitsSuccess"

    await employee_benefit_repo.delete(benefit)


async def test_reorder_employee_benefits_organization_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test reordering for non-existent organization."""
    fake_id = str(ObjectId())

    response = await password_auth_graphql_client(
        REORDER_EMPLOYEE_BENEFITS_MUTATION,
        variables={
            "organizationId": to_base64("Organization", fake_id),
            "benefitIds": [],
        },
    )

    assert response["data"] is not None
    data = response["data"]["reorderEmployeeBenefits"]
    assert data["__typename"] == "OrganizationNotFoundError"


async def test_reorder_employee_benefits_unauthorized(
    password_auth_graphql_client: GraphQLClient,
    organization_repo: OrganizationRepo,
) -> None:
    """Test reordering without admin permissions."""
    org = await organization_repo.create(
        name="Other Hospital",
        slug=generate_test_slug(),
    )

    response = await password_auth_graphql_client(
        REORDER_EMPLOYEE_BENEFITS_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(org.id)),
            "benefitIds": [],
        },
    )

    assert response["data"] is not None
    data = response["data"]["reorderEmployeeBenefits"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    await organization_repo.delete(org)


async def test_reorder_employee_benefits_unauthenticated(
    graphql_client: GraphQLClient,
    organization: Organization,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        REORDER_EMPLOYEE_BENEFITS_MUTATION,
        variables={
            "organizationId": to_base64("Organization", str(organization.id)),
            "benefitIds": [],
        },
    )

    assert "errors" in response

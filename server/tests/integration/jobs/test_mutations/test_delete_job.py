from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry import relay

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

DELETE_JOB_MUTATION = """
mutation DeleteJobMutation($jobId: ID!) {
    deleteJob(jobId: $jobId) {
        __typename
        ... on Job {
            id
            title
        }
        ... on JobNotFoundError {
            __typename
        }
        ... on OrganizationAuthorizationError {
            __typename
        }
    }
}
"""


@pytest.fixture
async def valid_organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    org = await organization_repo.create(
        name="Valid Org",
        slug=generate_test_slug(),
    )
    await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_repo.delete(org)


@pytest.fixture
async def invalid_organization(
    foreign_password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    org = await organization_repo.create(
        name="Invalid Org",
        slug=generate_test_slug(),
    )
    await organization_member_repo.create(
        account=foreign_password_account,
        organization_id=org.id,
        role="admin",
    )
    yield org
    await organization_repo.delete(org)


@pytest.fixture
async def valid_job(
    valid_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    job = await job_repo.create(
        organization=valid_organization,
        title="Software Engineer",
        description="A great software engineering position",
        skills=["Python", "Django"],
        location="Mumbai",
        applicant_locations=[],
    )
    yield job
    await job_repo.delete(job)


async def test_delete_job_successful(
    password_auth_sudo_graphql_client: GraphQLClient,
    valid_job: Job,
    job_repo: JobRepo,
) -> None:
    """Test successful job deletion."""
    response = await password_auth_sudo_graphql_client(
        DELETE_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", valid_job.id)},
    )

    data = response["data"]["deleteJob"]
    assert data["__typename"] == "Job"
    assert data["id"] == relay.to_base64("Job", valid_job.id)
    assert data["title"] == "Software Engineer"

    deleted_job = await job_repo.get(job_id=valid_job.id)
    assert deleted_job is None


async def test_delete_job_not_found(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Test deleting non-existent job."""
    invalid_job_id = relay.to_base64("Job", "507f1f77bcf86cd799439011")

    response = await password_auth_sudo_graphql_client(
        DELETE_JOB_MUTATION,
        variables={"jobId": invalid_job_id},
    )

    data = response["data"]["deleteJob"]
    assert data["__typename"] == "JobNotFoundError"


async def test_delete_job_organization_authorization_error(
    password_auth_sudo_graphql_client: GraphQLClient,
    invalid_organization: Organization,
    job_repo: JobRepo,
) -> None:
    """Test deleting job without authorization."""
    unauthorized_job = await job_repo.create(
        organization=invalid_organization,
        title="Unauthorized Job",
        description="Job description",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
    )

    response = await password_auth_sudo_graphql_client(
        DELETE_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", unauthorized_job.id)},
    )

    data = response["data"]["deleteJob"]
    assert data["__typename"] == "OrganizationAuthorizationError"

    job_still_exists = await job_repo.get(job_id=unauthorized_job.id)
    assert job_still_exists is not None
    await job_repo.delete(unauthorized_job)


async def test_delete_job_unauthenticated(
    graphql_client: GraphQLClient,
    valid_job: Job,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        DELETE_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", valid_job.id)},
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_delete_job_without_sudo_mode(
    password_auth_graphql_client: GraphQLClient,
    valid_job: Job,
) -> None:
    """Test that deletion requires sudo mode."""
    response = await password_auth_graphql_client(
        DELETE_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", valid_job.id)},
    )

    assert "errors" in response
    assert any("sudo" in str(error).lower() for error in response["errors"])


async def test_delete_job_invalid_job_id_format(
    password_auth_sudo_graphql_client: GraphQLClient,
) -> None:
    """Test deleting job with invalid job ID format."""
    response = await password_auth_sudo_graphql_client(
        DELETE_JOB_MUTATION,
        variables={"jobId": "invalid-job-id"},
    )

    assert "errors" in response

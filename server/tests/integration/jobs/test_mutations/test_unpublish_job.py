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

UNPUBLISH_JOB_MUTATION = """
mutation UnpublishJobMutation($jobId: ID!) {
    unpublishJob(jobId: $jobId) {
        __typename
        ... on Job {
            id
            isActive
        }
        ... on JobNotFoundError {
            __typename
        }
        ... on OrganizationAuthorizationError {
            __typename
        }
        ... on JobNotPublishedError {
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
async def published_job(
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
        vacancies=5,
    )
    await job_repo.update_active(job, is_active=True)
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def unpublished_job(
    valid_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    job = await job_repo.create(
        organization=valid_organization,
        title="Unpublished Job",
        description="Job that is not published",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )
    yield job
    await job_repo.delete(job)


async def test_unpublish_job_successful(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
) -> None:
    """Test successful job unpublishing."""
    response = await password_auth_graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", published_job.id)},
    )

    data = response["data"]["unpublishJob"]
    assert data["__typename"] == "Job"
    assert data["id"] == relay.to_base64("Job", published_job.id)
    assert data["isActive"] is False


async def test_unpublish_job_already_inactive(
    password_auth_graphql_client: GraphQLClient,
    unpublished_job: Job,
) -> None:
    """Test unpublishing an already inactive job."""
    response = await password_auth_graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", unpublished_job.id)},
    )

    data = response["data"]["unpublishJob"]
    assert data["__typename"] == "JobNotPublishedError"


async def test_unpublish_job_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test unpublishing non-existent job."""
    invalid_job_id = relay.to_base64("Job", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": invalid_job_id},
    )

    data = response["data"]["unpublishJob"]
    assert data["__typename"] == "JobNotFoundError"


async def test_unpublish_job_organization_authorization_error(
    password_auth_graphql_client: GraphQLClient,
    invalid_organization: Organization,
    job_repo: JobRepo,
) -> None:
    """Test unpublishing job without authorization."""
    unauthorized_job = await job_repo.create(
        organization=invalid_organization,
        title="Unauthorized Job",
        description="Job description",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )
    await job_repo.update_active(unauthorized_job, is_active=True)

    response = await password_auth_graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", unauthorized_job.id)},
    )

    data = response["data"]["unpublishJob"]
    assert data["__typename"] == "OrganizationAuthorizationError"


async def test_unpublish_job_unauthenticated(
    graphql_client: GraphQLClient,
    published_job: Job,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", published_job.id)},
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_unpublish_job_invalid_job_id_format(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test unpublishing job with invalid job ID format."""
    response = await password_auth_graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": "invalid-job-id"},
    )

    assert "errors" in response


async def test_unpublish_job_non_admin_member(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    job_repo: JobRepo,
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test unpublishing job as non-admin member."""
    org = await organization_repo.create(
        name="Test Org",
        slug=generate_test_slug(),
    )
    await organization_member_repo.create(
        account=password_account,
        organization_id=org.id,
        role="member",
    )

    job = await job_repo.create(
        organization=org,
        title="Test Job",
        description="Test description",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )
    await job_repo.update_active(job, is_active=True)

    response = await password_auth_graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", job.id)},
    )

    data = response["data"]["unpublishJob"]
    assert data["__typename"] == "OrganizationAuthorizationError"


async def test_unpublish_job_idempotency_check(
    password_auth_graphql_client: GraphQLClient,
    published_job: Job,
) -> None:
    """Test that unpublishing job twice returns error on second attempt."""
    response1 = await password_auth_graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", published_job.id)},
    )

    response2 = await password_auth_graphql_client(
        UNPUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", published_job.id)},
    )

    data1 = response1["data"]["unpublishJob"]
    data2 = response2["data"]["unpublishJob"]

    assert data1["__typename"] == "Job"
    assert data1["isActive"] is False
    assert data2["__typename"] == "JobNotPublishedError"

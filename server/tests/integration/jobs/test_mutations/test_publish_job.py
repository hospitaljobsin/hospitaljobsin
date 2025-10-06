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

PUBLISH_JOB_MUTATION = """
mutation PublishJobMutation($jobId: ID!) {
    publishJob(jobId: $jobId) {
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
        ... on InsufficientActiveVacanciesError {
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
async def test_job(
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
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def job_with_zero_vacancies(
    valid_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    job = await job_repo.create(
        organization=valid_organization,
        title="Zero Vacancy Job",
        description="Job with zero vacancies",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=0,
    )
    yield job
    await job_repo.delete(job)


@pytest.fixture
async def job_without_vacancies(
    valid_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    job = await job_repo.create(
        organization=valid_organization,
        title="No Vacancy Job",
        description="Job without vacancies field",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=None,
    )
    yield job
    await job_repo.delete(job)


async def test_publish_job_successful(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test successful job publishing."""
    response = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", test_job.id)},
    )

    data = response["data"]["publishJob"]
    assert data["__typename"] == "Job"
    assert data["id"] == relay.to_base64("Job", test_job.id)
    assert data["isActive"] is True


async def test_publish_job_already_active(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
    job_repo: JobRepo,
) -> None:
    """Test publishing an already active job."""
    await job_repo.update_active(test_job, is_active=True)

    response = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", test_job.id)},
    )

    data = response["data"]["publishJob"]
    assert data["__typename"] == "Job"
    assert data["isActive"] is True


async def test_publish_job_not_found(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test publishing non-existent job."""
    invalid_job_id = relay.to_base64("Job", "507f1f77bcf86cd799439011")

    response = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": invalid_job_id},
    )

    data = response["data"]["publishJob"]
    assert data["__typename"] == "JobNotFoundError"


async def test_publish_job_organization_authorization_error(
    password_auth_graphql_client: GraphQLClient,
    invalid_organization: Organization,
    job_repo: JobRepo,
) -> None:
    """Test publishing job without authorization."""
    unauthorized_job = await job_repo.create(
        organization=invalid_organization,
        title="Unauthorized Job",
        description="Job description",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )

    response = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", unauthorized_job.id)},
    )

    data = response["data"]["publishJob"]
    assert data["__typename"] == "OrganizationAuthorizationError"


async def test_publish_job_insufficient_active_vacancies_zero(
    password_auth_graphql_client: GraphQLClient,
    job_with_zero_vacancies: Job,
) -> None:
    """Test publishing job with zero vacancies."""
    response = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", job_with_zero_vacancies.id)},
    )

    data = response["data"]["publishJob"]
    assert data["__typename"] == "InsufficientActiveVacanciesError"


async def test_publish_job_without_vacancies_field(
    password_auth_graphql_client: GraphQLClient,
    job_without_vacancies: Job,
) -> None:
    """Test publishing job without vacancies field."""
    response = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", job_without_vacancies.id)},
    )

    data = response["data"]["publishJob"]
    assert data["__typename"] == "Job"
    assert data["isActive"] is True


async def test_publish_job_unauthenticated(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that unauthenticated requests are rejected."""
    response = await graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", test_job.id)},
    )

    assert "errors" in response
    assert any(
        "permission" in str(error).lower() or "auth" in str(error).lower()
        for error in response["errors"]
    )


async def test_publish_job_invalid_job_id_format(
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test publishing job with invalid job ID format."""
    response = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": "invalid-job-id"},
    )

    assert "errors" in response


async def test_publish_job_non_admin_member(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
    job_repo: JobRepo,
    password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test publishing job as non-admin member."""
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

    response = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", job.id)},
    )

    data = response["data"]["publishJob"]
    assert data["__typename"] == "OrganizationAuthorizationError"


async def test_publish_job_idempotent(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test that publishing job multiple times is idempotent."""
    response1 = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", test_job.id)},
    )

    response2 = await password_auth_graphql_client(
        PUBLISH_JOB_MUTATION,
        variables={"jobId": relay.to_base64("Job", test_job.id)},
    )

    data1 = response1["data"]["publishJob"]
    data2 = response2["data"]["publishJob"]

    assert data1["__typename"] == "Job"
    assert data2["__typename"] == "Job"
    assert data1["isActive"] is True
    assert data2["isActive"] is True

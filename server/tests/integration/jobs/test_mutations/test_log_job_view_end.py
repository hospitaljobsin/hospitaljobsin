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

LOG_JOB_VIEW_END_MUTATION = """
mutation LogJobViewEnd($impressionId: String!, $jobId: ID!) {
    logJobViewEnd(impressionId: $impressionId, jobId: $jobId) {
        __typename
    }
}
"""


@pytest.fixture
async def test_organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    org = await organization_repo.create(
        name="Test Org",
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
async def test_job(
    test_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[Job]:
    job = await job_repo.create(
        organization=test_organization,
        title="Software Engineer",
        description="A great software engineering position",
        skills=["Python", "Django"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )
    yield job
    await job_repo.delete(job)


async def test_log_job_view_end_authenticated(
    password_auth_graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging job view end with authenticated user."""
    response = await password_auth_graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "test-impression-123",
            "jobId": relay.to_base64("Job", test_job.id),
        },
    )

    data = response["data"]["logJobViewEnd"]
    assert data["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_unauthenticated(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging job view end without authentication."""
    response = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "test-impression-456",
            "jobId": relay.to_base64("Job", test_job.id),
        },
    )

    data = response["data"]["logJobViewEnd"]
    assert data["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_invalid_job_id(
    graphql_client: GraphQLClient,
) -> None:
    """Test logging job view end with non-existent job ID."""
    invalid_job_id = relay.to_base64("Job", "507f1f77bcf86cd799439011")

    response = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "test-impression-789",
            "jobId": invalid_job_id,
        },
    )

    data = response["data"]["logJobViewEnd"]
    assert data["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_malformed_job_id(
    graphql_client: GraphQLClient,
) -> None:
    """Test logging job view end with malformed job ID."""
    response = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "test-impression-abc",
            "jobId": "invalid-job-id",
        },
    )

    assert "errors" in response


async def test_log_job_view_end_multiple_impressions(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging multiple job view ends with different impression IDs."""
    impression_ids = ["impression-1", "impression-2", "impression-3"]

    for impression_id in impression_ids:
        response = await graphql_client(
            LOG_JOB_VIEW_END_MUTATION,
            variables={
                "impressionId": impression_id,
                "jobId": relay.to_base64("Job", test_job.id),
            },
        )

        data = response["data"]["logJobViewEnd"]
        assert data["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_same_impression_twice(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging job view end with same impression ID twice."""
    impression_id = "duplicate-impression"
    job_id = relay.to_base64("Job", test_job.id)

    response1 = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": impression_id,
            "jobId": job_id,
        },
    )

    response2 = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": impression_id,
            "jobId": job_id,
        },
    )

    assert response1["data"]["logJobViewEnd"]["__typename"] == "LogJobViewPayload"
    assert response2["data"]["logJobViewEnd"]["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_empty_impression_id(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging job view end with empty impression ID."""
    response = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "",
            "jobId": relay.to_base64("Job", test_job.id),
        },
    )

    data = response["data"]["logJobViewEnd"]
    assert data["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_long_impression_id(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging job view end with very long impression ID."""
    response = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "a" * 1000,
            "jobId": relay.to_base64("Job", test_job.id),
        },
    )

    data = response["data"]["logJobViewEnd"]
    assert data["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_special_characters_impression_id(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging job view end with special characters in impression ID."""
    special_impression_ids = [
        "impression-with-dashes",
        "impression_with_underscores",
        "impression.with.dots",
        "impression@with#special$chars",
        "impression with spaces",
    ]

    for impression_id in special_impression_ids:
        response = await graphql_client(
            LOG_JOB_VIEW_END_MUTATION,
            variables={
                "impressionId": impression_id,
                "jobId": relay.to_base64("Job", test_job.id),
            },
        )

        data = response["data"]["logJobViewEnd"]
        assert data["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_different_users_same_job(
    password_auth_graphql_client: GraphQLClient,
    foreign_password_auth_graphql_client: GraphQLClient,
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging job view end from different users for the same job."""
    job_id = relay.to_base64("Job", test_job.id)

    response1 = await password_auth_graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "user1-impression",
            "jobId": job_id,
        },
    )

    response2 = await foreign_password_auth_graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "user2-impression",
            "jobId": job_id,
        },
    )

    response3 = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "anonymous-impression",
            "jobId": job_id,
        },
    )

    assert response1["data"]["logJobViewEnd"]["__typename"] == "LogJobViewPayload"
    assert response2["data"]["logJobViewEnd"]["__typename"] == "LogJobViewPayload"
    assert response3["data"]["logJobViewEnd"]["__typename"] == "LogJobViewPayload"


async def test_log_job_view_end_inactive_job(
    graphql_client: GraphQLClient,
    test_organization: Organization,
    job_repo: JobRepo,
) -> None:
    """Test logging job view end for an inactive job."""
    inactive_job = await job_repo.create(
        organization=test_organization,
        title="Inactive Job",
        description="This job is not active",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )

    response = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "inactive-job-impression",
            "jobId": relay.to_base64("Job", inactive_job.id),
        },
    )

    data = response["data"]["logJobViewEnd"]
    assert data["__typename"] == "LogJobViewPayload"

    await job_repo.delete(inactive_job)


async def test_log_job_view_end_published_job(
    graphql_client: GraphQLClient,
    test_organization: Organization,
    job_repo: JobRepo,
) -> None:
    """Test logging job view end for a published job."""
    published_job = await job_repo.create(
        organization=test_organization,
        title="Published Job",
        description="This job is published",
        skills=["Python"],
        location="Mumbai",
        applicant_locations=[],
        vacancies=5,
    )
    await job_repo.update_active(published_job, is_active=True)

    response = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "published-job-impression",
            "jobId": relay.to_base64("Job", published_job.id),
        },
    )

    data = response["data"]["logJobViewEnd"]
    assert data["__typename"] == "LogJobViewPayload"

    await job_repo.delete(published_job)


async def test_log_job_view_end_uuid_impression_id(
    graphql_client: GraphQLClient,
    test_job: Job,
) -> None:
    """Test logging job view end with UUID-formatted impression ID."""
    response = await graphql_client(
        LOG_JOB_VIEW_END_MUTATION,
        variables={
            "impressionId": "550e8400-e29b-41d4-a716-446655440000",
            "jobId": relay.to_base64("Job", test_job.id),
        },
    )

    data = response["data"]["logJobViewEnd"]
    assert data["__typename"] == "LogJobViewPayload"

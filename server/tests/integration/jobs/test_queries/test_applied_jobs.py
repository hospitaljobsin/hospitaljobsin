from collections.abc import AsyncGenerator
from datetime import date
from typing import Any

import pytest
from app.accounts.documents import Account, CareerProfile
from app.accounts.repositories import ProfileRepo
from app.jobs.documents import Job, JobApplicant
from app.jobs.repositories import JobApplicantRepo, JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from strawberry import relay

from tests.helpers.pagination import (
    assert_backward_pagination_has_previous,
    assert_forward_pagination_has_next,
    assert_forward_pagination_with_after,
    assert_full_pagination_flow,
    assert_pagination_validates_first_and_last,
)
from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

APPLIED_JOBS_QUERY = """
query AppliedJobsQuery(
    $first: Int
    $last: Int
    $after: ID
    $before: ID
) {
    appliedJobs(
        first: $first
        last: $last
        after: $after
        before: $before
    ) {
        edges {
            node {
                id
                status
                job {
                    id
                    title
                }
            }
            cursor
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
        totalCount
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
        name="Test Hospital",
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
async def complete_profile(
    foreign_password_account: Account,
    profile_repo: ProfileRepo,
):
    profile = await profile_repo.create(
        account=foreign_password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )
    yield profile
    await profile_repo.delete(profile)


@pytest.fixture
async def sample_jobs(
    test_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[list[Job]]:
    jobs_data = [
        {
            "title": f"Job {i}",
            "description": f"Description {i}",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicant_locations": [],
            "vacancies": 5,
        }
        for i in range(5)
    ]
    jobs = await job_repo.create_many(
        organization=test_organization,
        jobs_data=jobs_data,
    )
    for job in jobs:
        await job_repo.update_active(job, is_active=True)
    yield jobs
    for job in jobs:
        await job_repo.delete(job)


@pytest.fixture
async def sample_applications(
    foreign_password_account: Account,
    sample_jobs: list[Job],
    job_applicant_repo: JobApplicantRepo,
    complete_profile,
) -> AsyncGenerator[list[JobApplicant]]:
    applications = []
    for job in sample_jobs:
        app = await job_applicant_repo.create(
            account=foreign_password_account,
            job=job,
            applicant_fields=[],
        )
        applications.append(app)
    yield applications
    for app in applications:
        await job_applicant_repo.delete(app)


async def test_applied_jobs_unauthenticated(
    graphql_client: GraphQLClient,
) -> None:
    """Test that unauthenticated users cannot access applied jobs."""
    response = await graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )
    assert "errors" in response


async def test_applied_jobs_empty(
    foreign_password_auth_graphql_client: GraphQLClient,
) -> None:
    """Test applied jobs query with no applications."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )
    assert "errors" not in response
    data = response["data"]["appliedJobs"]
    assert len(data["edges"]) == 0
    assert data["totalCount"] == 0
    assert data["pageInfo"]["hasNextPage"] is False
    assert data["pageInfo"]["hasPreviousPage"] is False


async def test_applied_jobs_basic(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test basic applied jobs query."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )
    assert "errors" not in response
    data = response["data"]["appliedJobs"]
    assert len(data["edges"]) == 5
    assert data["totalCount"] == 5
    for edge in data["edges"]:
        assert edge["node"]["status"] == "APPLIED"
        assert edge["node"]["job"]["id"] is not None
        assert edge["node"]["job"]["title"] is not None


async def test_applied_jobs_pagination_forward_first(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test forward pagination with first parameter."""

    async def paginate_applied_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await foreign_password_auth_graphql_client(
            APPLIED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["appliedJobs"]

    await assert_forward_pagination_has_next(paginate_applied_jobs, {}, 2, 5)


async def test_applied_jobs_pagination_forward_after(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test forward pagination with after cursor."""

    async def paginate_applied_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await foreign_password_auth_graphql_client(
            APPLIED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["appliedJobs"]

    first_page = await paginate_applied_jobs({"first": 2})
    end_cursor = first_page["pageInfo"]["endCursor"]
    second_page = await assert_forward_pagination_with_after(
        paginate_applied_jobs, {}, end_cursor, 2
    )

    first_ids = {edge["node"]["id"] for edge in first_page["edges"]}
    second_ids = {edge["node"]["id"] for edge in second_page["edges"]}
    assert first_ids.isdisjoint(second_ids)


async def test_applied_jobs_pagination_backward_last(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test backward pagination with last parameter."""

    async def paginate_applied_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await foreign_password_auth_graphql_client(
            APPLIED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["appliedJobs"]

    await assert_backward_pagination_has_previous(paginate_applied_jobs, {}, 2)


async def test_applied_jobs_pagination_backward_before(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test backward pagination with before cursor."""

    async def paginate_applied_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await foreign_password_auth_graphql_client(
            APPLIED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["appliedJobs"]

    last_page = await paginate_applied_jobs({"last": 2})
    start_cursor = last_page["pageInfo"]["startCursor"]
    prev_response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"last": 2, "before": start_cursor},
    )
    assert "errors" not in prev_response
    prev_data = prev_response["data"]["appliedJobs"]

    last_ids = {edge["node"]["id"] for edge in last_page["edges"]}
    prev_ids = {edge["node"]["id"] for edge in prev_data["edges"]}
    assert last_ids.isdisjoint(prev_ids)


async def test_applied_jobs_pagination_consistency(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test pagination consistency across multiple requests."""

    async def paginate_applied_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await foreign_password_auth_graphql_client(
            APPLIED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["appliedJobs"]

    await assert_full_pagination_flow(paginate_applied_jobs, {}, 2, 5)


async def test_applied_jobs_pagination_validates_first_and_last(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test that first and last cannot be used together."""

    async def paginate_applied_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await foreign_password_auth_graphql_client(
            APPLIED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["appliedJobs"]

    await assert_pagination_validates_first_and_last(paginate_applied_jobs, {})


async def test_applied_jobs_no_duplicates(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test that no duplicate applications are returned."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )
    assert "errors" not in response
    data = response["data"]["appliedJobs"]

    application_ids = [edge["node"]["id"] for edge in data["edges"]]
    unique_application_ids = set(application_ids)

    assert len(application_ids) == len(unique_application_ids), (
        "Duplicate applications found in results"
    )


async def test_applied_jobs_total_count_accuracy(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test that totalCount is accurate."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 2},
    )
    assert "errors" not in response
    data = response["data"]["appliedJobs"]
    assert data["totalCount"] == 5
    assert len(data["edges"]) == 2


async def test_applied_jobs_ordering(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test that applications are ordered by most recent first."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )
    assert "errors" not in response
    data = response["data"]["appliedJobs"]

    application_ids = [edge["node"]["id"] for edge in data["edges"]]
    decoded_ids = [relay.from_base64(app_id)[1] for app_id in application_ids]

    for i in range(len(decoded_ids) - 1):
        assert decoded_ids[i] >= decoded_ids[i + 1], (
            "Applications not ordered correctly"
        )


async def test_applied_jobs_isolation_between_users(
    foreign_password_auth_graphql_client: GraphQLClient,
    password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
    password_account: Account,
    sample_jobs: list[Job],
    job_applicant_repo: JobApplicantRepo,
    profile_repo: ProfileRepo,
) -> None:
    """Test that users only see their own applications."""
    profile = await profile_repo.create(
        account=password_account,
        date_of_birth=date(1990, 1, 1),
        address="123 Main St, Mumbai, Maharashtra, India",
        career_profile=CareerProfile(
            locations_open_to_work=["Mumbai"],
            open_to_relocation_anywhere=False,
        ),
        headline="Software Engineer",
        resume_url="https://example.com/resume.pdf",
    )

    app = await job_applicant_repo.create(
        account=password_account,
        job=sample_jobs[0],
        applicant_fields=[],
    )

    response1 = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )
    response2 = await password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" not in response1
    assert "errors" not in response2

    data1 = response1["data"]["appliedJobs"]
    data2 = response2["data"]["appliedJobs"]

    assert data1["totalCount"] == 5
    assert data2["totalCount"] == 1

    ids1 = {edge["node"]["id"] for edge in data1["edges"]}
    ids2 = {edge["node"]["id"] for edge in data2["edges"]}
    assert ids1.isdisjoint(ids2)

    await job_applicant_repo.delete(app)
    await profile_repo.delete(profile)


async def test_applied_jobs_single_application(
    foreign_password_auth_graphql_client: GraphQLClient,
    foreign_password_account: Account,
    sample_jobs: list[Job],
    job_applicant_repo: JobApplicantRepo,
    complete_profile,
) -> None:
    """Test applied jobs with single application."""
    app = await job_applicant_repo.create(
        account=foreign_password_account,
        job=sample_jobs[0],
        applicant_fields=[],
    )

    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" not in response
    data = response["data"]["appliedJobs"]
    assert len(data["edges"]) == 1
    assert data["totalCount"] == 1
    assert data["pageInfo"]["hasNextPage"] is False
    assert data["pageInfo"]["hasPreviousPage"] is False

    await job_applicant_repo.delete(app)


async def test_applied_jobs_large_dataset(
    foreign_password_auth_graphql_client: GraphQLClient,
    foreign_password_account: Account,
    test_organization: Organization,
    job_repo: JobRepo,
    job_applicant_repo: JobApplicantRepo,
    complete_profile,
) -> None:
    """Test applied jobs with large number of applications."""
    jobs_data = [
        {
            "title": f"Job {i}",
            "description": f"Description {i}",
            "skills": ["Python"],
            "location": "Mumbai",
            "applicant_locations": [],
            "vacancies": 5,
        }
        for i in range(50)
    ]
    jobs = await job_repo.create_many(
        organization=test_organization,
        jobs_data=jobs_data,
    )

    applications = []
    for job in jobs:
        await job_repo.update_active(job, is_active=True)
        app = await job_applicant_repo.create(
            account=foreign_password_account,
            job=job,
            applicant_fields=[],
        )
        applications.append(app)

    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" not in response
    data = response["data"]["appliedJobs"]
    assert len(data["edges"]) == 10
    assert data["totalCount"] == 50
    assert data["pageInfo"]["hasNextPage"] is True

    for app in applications:
        await job_applicant_repo.delete(app)
    for job in jobs:
        await job_repo.delete(job)


async def test_applied_jobs_edge_case_first_zero(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test applied jobs with first=0."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 0},
    )
    assert "errors" in response


async def test_applied_jobs_edge_case_last_zero(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test applied jobs with last=0."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"last": 0},
    )
    assert "errors" in response


async def test_applied_jobs_edge_case_first_exceeds_total(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test applied jobs with first exceeding total count."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 100},
    )
    assert "errors" not in response
    data = response["data"]["appliedJobs"]
    assert len(data["edges"]) == 5
    assert data["totalCount"] == 5
    assert data["pageInfo"]["hasNextPage"] is False


async def test_applied_jobs_edge_case_last_exceeds_total(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test applied jobs with last exceeding total count."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"last": 100},
    )
    assert "errors" not in response
    data = response["data"]["appliedJobs"]
    assert len(data["edges"]) == 5
    assert data["totalCount"] == 5
    assert data["pageInfo"]["hasPreviousPage"] is False


async def test_applied_jobs_invalid_after_cursor(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test applied jobs with invalid after cursor."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 10, "after": "invalid-cursor"},
    )
    assert "errors" in response


async def test_applied_jobs_invalid_before_cursor(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test applied jobs with invalid before cursor."""
    response = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"last": 10, "before": "invalid-cursor"},
    )
    assert "errors" in response


async def test_applied_jobs_cursor_stability(
    foreign_password_auth_graphql_client: GraphQLClient,
    sample_applications: list[JobApplicant],
) -> None:
    """Test that cursors remain stable across multiple requests."""
    response1 = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 2},
    )
    response2 = await foreign_password_auth_graphql_client(
        APPLIED_JOBS_QUERY,
        variables={"first": 2},
    )

    assert "errors" not in response1
    assert "errors" not in response2

    data1 = response1["data"]["appliedJobs"]
    data2 = response2["data"]["appliedJobs"]

    assert data1["pageInfo"]["endCursor"] == data2["pageInfo"]["endCursor"]
    assert data1["pageInfo"]["startCursor"] == data2["pageInfo"]["startCursor"]

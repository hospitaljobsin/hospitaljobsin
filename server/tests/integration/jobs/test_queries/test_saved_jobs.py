import asyncio
from collections.abc import AsyncGenerator
from typing import Any

import pytest
from app.accounts.documents import Account
from app.base.models import GeoObject
from app.jobs.documents import Job, SavedJob
from app.jobs.repositories import JobRepo, SavedJobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo

from tests.helpers.pagination import (
    assert_backward_pagination_has_previous,
    assert_forward_pagination_has_next,
    assert_pagination_validates_first_and_last,
)
from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

SAVED_JOBS_QUERY = """
query SavedJobsQuery(
    $first: Int
    $last: Int
    $after: ID
    $before: ID
) {
    savedJobs(
        first: $first
        last: $last
        after: $after
        before: $before
    ) {
        edges {
            node {
                id
                title
                description
                location
                type
                workMode
                isActive
            }
            cursor
            savedAt
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


@pytest.fixture(scope="module")
async def test_organization(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[Organization]:
    """Create a test organization."""
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
    await organization_repo.delete(org)
    await organization_member_repo.delete(org_member)


@pytest.fixture(scope="module")
async def sample_jobs(
    test_organization: Organization,
    job_repo: JobRepo,
) -> AsyncGenerator[list[Job]]:
    """Create sample jobs for testing."""
    jobs = []

    job1 = await job_repo.create(
        organization=test_organization,
        title="Senior Python Developer",
        description="Looking for an experienced Python developer",
        skills=["Python", "Django", "PostgreSQL"],
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        work_mode="remote",
        job_type="full_time",
        currency="INR",
    )
    job1.is_active = True
    await job1.save()
    jobs.append(job1)

    job2 = await job_repo.create(
        organization=test_organization,
        title="Frontend JavaScript Developer",
        description="React and TypeScript developer needed",
        skills=["JavaScript", "React", "TypeScript"],
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        work_mode="hybrid",
        job_type="full_time",
        currency="INR",
    )
    job2.is_active = True
    await job2.save()
    jobs.append(job2)

    job3 = await job_repo.create(
        organization=test_organization,
        title="Registered Nurse",
        description="Experienced nurse required",
        skills=["Nursing", "Patient Care"],
        location="India",
        geo=GeoObject(type="Point", coordinates=(78.9629, 20.5937)),
        work_mode="office",
        job_type="full_time",
        currency="INR",
    )
    job3.is_active = True
    await job3.save()
    jobs.append(job3)

    await asyncio.sleep(1.5)
    yield jobs
    for job in jobs:
        await job_repo.delete(job)


@pytest.fixture
async def saved_jobs_fixture(
    password_account: Account,
    sample_jobs: list[Job],
    saved_job_repo: SavedJobRepo,
) -> AsyncGenerator[list[SavedJob]]:
    """Create saved jobs for testing."""
    saved_jobs = []
    for job in sample_jobs[:2]:
        saved_job = await saved_job_repo.create(
            account_id=password_account.id,
            job=job,
        )
        saved_jobs.append(saved_job)

    yield saved_jobs
    for saved_job in saved_jobs:
        await saved_job_repo.delete(saved_job)


async def test_saved_jobs_requires_authentication(
    graphql_client: GraphQLClient,
) -> None:
    """Test that saved_jobs query requires authentication."""
    response = await graphql_client(
        SAVED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" in response


async def test_saved_jobs_basic_query(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test basic query returning all saved jobs."""
    response = await password_auth_graphql_client(
        SAVED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" not in response
    data = response["data"]["savedJobs"]

    assert len(data["edges"]) == 2

    for edge in data["edges"]:
        assert edge["node"]["isActive"] is True
        assert edge["savedAt"] is not None


async def test_saved_jobs_empty_result(
    password_auth_graphql_client: GraphQLClient,
    password_account: Account,
    saved_job_repo: SavedJobRepo,
) -> None:
    """Test query with no saved jobs."""
    for saved_job in await SavedJob.find(
        SavedJob.account.id == password_account.id
    ).to_list():
        await saved_job_repo.delete(saved_job)

    response = await password_auth_graphql_client(
        SAVED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" not in response
    data = response["data"]["savedJobs"]

    assert len(data["edges"]) == 0


async def test_saved_jobs_pagination_forward_first(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test forward pagination with first parameter."""

    async def paginate_saved_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await password_auth_graphql_client(
            SAVED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["savedJobs"]

    await assert_forward_pagination_has_next(paginate_saved_jobs, {}, 1, 2)


async def test_saved_jobs_pagination_forward_after(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test forward pagination with after cursor."""

    async def paginate_saved_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await password_auth_graphql_client(
            SAVED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["savedJobs"]

    first_page = await paginate_saved_jobs({"first": 1})
    assert len(first_page["edges"]) == 1
    end_cursor = first_page["pageInfo"]["endCursor"]

    second_page = await paginate_saved_jobs({"first": 1, "after": end_cursor})
    assert len(second_page["edges"]) == 1

    first_ids = {edge["node"]["id"] for edge in first_page["edges"]}
    second_ids = {edge["node"]["id"] for edge in second_page["edges"]}
    assert first_ids.isdisjoint(second_ids)


async def test_saved_jobs_pagination_backward_last(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test backward pagination with last parameter."""

    async def paginate_saved_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await password_auth_graphql_client(
            SAVED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["savedJobs"]

    await assert_backward_pagination_has_previous(paginate_saved_jobs, {}, 1)


async def test_saved_jobs_pagination_backward_before(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test backward pagination with before cursor."""

    async def paginate_saved_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await password_auth_graphql_client(
            SAVED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["savedJobs"]

    last_page = await paginate_saved_jobs({"last": 1})
    start_cursor = last_page["pageInfo"]["startCursor"]
    prev_response = await password_auth_graphql_client(
        SAVED_JOBS_QUERY,
        variables={"last": 1, "before": start_cursor},
    )
    assert "errors" not in prev_response
    prev_data = prev_response["data"]["savedJobs"]

    last_ids = {edge["node"]["id"] for edge in last_page["edges"]}
    prev_ids = {edge["node"]["id"] for edge in prev_data["edges"]}
    assert last_ids.isdisjoint(prev_ids)


async def test_saved_jobs_pagination_validates_first_and_last(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test that pagination validates first and last parameters."""

    async def paginate_saved_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await password_auth_graphql_client(
            SAVED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["savedJobs"]

    await assert_pagination_validates_first_and_last(paginate_saved_jobs, {})


async def test_saved_jobs_pagination_consistency(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test pagination consistency across multiple requests."""

    async def paginate_saved_jobs(params: dict[str, Any]) -> dict[str, Any]:
        response = await password_auth_graphql_client(
            SAVED_JOBS_QUERY, variables=params
        )
        assert "errors" not in response
        return response["data"]["savedJobs"]

    collected_items = []
    after_cursor = None

    while True:
        params = {"first": 1}
        if after_cursor:
            params["after"] = after_cursor

        result = await paginate_saved_jobs(params)
        edges = result["edges"]
        collected_items.extend(edges)

        if not result["pageInfo"]["hasNextPage"]:
            break

        after_cursor = result["pageInfo"]["endCursor"]

    assert len(collected_items) == 2
    job_ids = [edge["node"]["id"] for edge in collected_items]
    assert len(job_ids) == len(set(job_ids))


async def test_saved_jobs_no_duplicates(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test that no duplicate saved jobs are returned."""
    response = await password_auth_graphql_client(
        SAVED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" not in response
    data = response["data"]["savedJobs"]

    saved_job_ids = [edge["node"]["id"] for edge in data["edges"]]
    unique_saved_job_ids = set(saved_job_ids)

    assert len(saved_job_ids) == len(unique_saved_job_ids)


async def test_saved_jobs_page_info(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test that page info is correct."""
    response = await password_auth_graphql_client(
        SAVED_JOBS_QUERY,
        variables={"first": 1},
    )

    assert "errors" not in response
    data = response["data"]["savedJobs"]

    assert len(data["edges"]) == 1
    assert data["pageInfo"]["hasNextPage"] is True
    assert data["pageInfo"]["hasPreviousPage"] is False


async def test_saved_jobs_returns_job_details(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test that saved jobs return complete job details."""
    response = await password_auth_graphql_client(
        SAVED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" not in response
    data = response["data"]["savedJobs"]

    for edge in data["edges"]:
        assert edge["node"]["id"] is not None
        assert edge["node"]["title"] is not None
        assert edge["node"]["description"] is not None
        assert edge["node"]["type"] is not None
        assert edge["node"]["workMode"] is not None
        assert edge["node"]["isActive"] is True
        assert edge["savedAt"] is not None


async def test_saved_jobs_ordered_by_creation(
    password_auth_graphql_client: GraphQLClient,
    saved_jobs_fixture: list[SavedJob],
) -> None:
    """Test that saved jobs are ordered by creation time (most recent first)."""
    response = await password_auth_graphql_client(
        SAVED_JOBS_QUERY,
        variables={"first": 10},
    )

    assert "errors" not in response
    data = response["data"]["savedJobs"]

    assert len(data["edges"]) == 2

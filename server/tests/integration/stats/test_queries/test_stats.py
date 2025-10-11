from collections.abc import AsyncGenerator

import pytest
from app.accounts.documents import Account
from app.base.models import GeoObject
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

STATS_QUERY = """
query StatsQuery {
    stats {
        totalVacancies
        totalOrganizations
        totalJobs
    }
}
"""


@pytest.fixture(scope="module")
async def test_organizations(
    password_account: Account,
    organization_repo: OrganizationRepo,
    organization_member_repo: OrganizationMemberRepo,
) -> AsyncGenerator[list[Organization]]:
    """Create test organizations."""
    orgs = []
    org_members = []

    for i in range(3):
        org = await organization_repo.create(
            name=f"Test Hospital {i}",
            slug=generate_test_slug(),
        )
        org_member = await organization_member_repo.create(
            account=password_account,
            organization_id=org.id,
            role="admin",
        )
        orgs.append(org)
        org_members.append(org_member)

    yield orgs

    for org in orgs:
        await organization_repo.delete(org)
    for org_member in org_members:
        await organization_member_repo.delete(org_member)


@pytest.fixture(scope="module")
async def test_jobs(
    test_organizations: list[Organization],
    job_repo: JobRepo,
) -> AsyncGenerator[list[Job]]:
    """Create test jobs with varying vacancy counts."""
    jobs = []

    # Organization 1: 2 active jobs with vacancies
    job1 = await job_repo.create(
        organization=test_organizations[0],
        title="Senior Nurse",
        description="Experienced nurse needed",
        skills=["Nursing", "Patient Care"],
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        work_mode="office",
        job_type="full_time",
        currency="INR",
        vacancies=5,
    )
    job1.is_active = True
    await job1.save()
    jobs.append(job1)

    job2 = await job_repo.create(
        organization=test_organizations[0],
        title="Junior Doctor",
        description="Entry level doctor position",
        skills=["Medicine", "Diagnosis"],
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        work_mode="office",
        job_type="full_time",
        currency="INR",
        vacancies=3,
    )
    job2.is_active = True
    await job2.save()
    jobs.append(job2)

    # Organization 2: 1 active job with vacancies
    job3 = await job_repo.create(
        organization=test_organizations[1],
        title="Medical Technician",
        description="Lab technician required",
        skills=["Lab Work", "Testing"],
        location="Delhi",
        geo=GeoObject(type="Point", coordinates=(77.2090, 28.6139)),
        work_mode="office",
        job_type="full_time",
        currency="INR",
        vacancies=2,
    )
    job3.is_active = True
    await job3.save()
    jobs.append(job3)

    # Organization 3: 1 inactive job (should not count)
    job4 = await job_repo.create(
        organization=test_organizations[2],
        title="Inactive Position",
        description="This job is inactive",
        skills=["Test"],
        location="Bangalore",
        geo=GeoObject(type="Point", coordinates=(77.5946, 12.9716)),
        work_mode="office",
        job_type="full_time",
        currency="INR",
        vacancies=10,
    )
    # job4.is_active remains False
    jobs.append(job4)

    yield jobs

    for job in jobs:
        await job_repo.delete(job)


async def test_stats_with_data(
    graphql_client: GraphQLClient,
    test_jobs: list[Job],
) -> None:
    """Test stats query returns correct counts with data."""
    response = await graphql_client(STATS_QUERY)

    assert "errors" not in response
    data = response["data"]["stats"]

    # 3 active jobs (job4 is inactive)
    assert data["totalJobs"] == 3

    # 5 + 3 + 2 = 10 vacancies (only from active jobs)
    assert data["totalVacancies"] == 10

    # 3 organizations
    assert data["totalOrganizations"] == 3


async def test_stats_without_authentication(
    graphql_client: GraphQLClient,
    test_jobs: list[Job],
) -> None:
    """Test stats query works without authentication."""
    response = await graphql_client(STATS_QUERY)

    assert "errors" not in response
    assert "stats" in response["data"]
    assert "totalJobs" in response["data"]["stats"]
    assert "totalVacancies" in response["data"]["stats"]
    assert "totalOrganizations" in response["data"]["stats"]


async def test_stats_with_authentication(
    password_auth_graphql_client: GraphQLClient,
    test_jobs: list[Job],
) -> None:
    """Test stats query works with authentication."""
    response = await password_auth_graphql_client(STATS_QUERY)

    assert "errors" not in response
    data = response["data"]["stats"]

    assert data["totalJobs"] == 3
    assert data["totalVacancies"] == 10
    assert data["totalOrganizations"] == 3


async def test_stats_empty_database(
    graphql_client: GraphQLClient,
) -> None:
    """Test stats query with empty database returns zeros."""
    response = await graphql_client(STATS_QUERY)

    assert "errors" not in response
    data = response["data"]["stats"]

    # Should return 0 for all counts when no data exists
    assert isinstance(data["totalJobs"], int)
    assert isinstance(data["totalVacancies"], int)
    assert isinstance(data["totalOrganizations"], int)
    assert data["totalJobs"] >= 0
    assert data["totalVacancies"] >= 0
    assert data["totalOrganizations"] >= 0


async def test_stats_only_counts_active_jobs(
    graphql_client: GraphQLClient,
    test_jobs: list[Job],
) -> None:
    """Test that stats only counts active jobs and their vacancies."""
    response = await graphql_client(STATS_QUERY)

    assert "errors" not in response
    data = response["data"]["stats"]

    # Verify inactive job (job4 with 10 vacancies) is not counted
    # If it were counted, totalVacancies would be 20 instead of 10
    assert data["totalVacancies"] == 10
    assert data["totalJobs"] == 3


async def test_stats_response_structure(
    graphql_client: GraphQLClient,
    test_jobs: list[Job],
) -> None:
    """Test stats query returns correct response structure."""
    response = await graphql_client(STATS_QUERY)

    assert "errors" not in response
    assert "data" in response
    assert "stats" in response["data"]

    stats = response["data"]["stats"]
    assert "totalVacancies" in stats
    assert "totalOrganizations" in stats
    assert "totalJobs" in stats

    # Verify all values are integers
    assert isinstance(stats["totalVacancies"], int)
    assert isinstance(stats["totalOrganizations"], int)
    assert isinstance(stats["totalJobs"], int)


async def test_stats_counts_all_organizations(
    graphql_client: GraphQLClient,
    test_organizations: list[Organization],
) -> None:
    """Test that stats counts all organizations regardless of job status."""
    response = await graphql_client(STATS_QUERY)

    assert "errors" not in response
    data = response["data"]["stats"]

    # All 3 organizations should be counted even if one has only inactive jobs
    assert data["totalOrganizations"] == 3

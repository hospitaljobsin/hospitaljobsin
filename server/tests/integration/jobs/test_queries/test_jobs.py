import asyncio
from collections.abc import AsyncGenerator
from datetime import UTC, datetime, timedelta
from typing import Any

import pytest
from app.accounts.documents import Account
from app.base.models import GeoObject
from app.config import DatabaseSettings
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationMemberRepo, OrganizationRepo
from pymongo import AsyncMongoClient

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

JOBS_QUERY = """
query JobsQuery(
    $workMode: [JobWorkModeFilter!]!
    $jobType: [JobTypeFilter!]!
    $sortBy: JobSearchSortBy = RELEVANCE
    $location: String
    $proximityKm: Float
    $searchTerm: String
    $minExperience: Int
    $maxExperience: Int
    $minSalary: Int
    $maxSalary: Int
    $first: Int
    $last: Int
    $after: ID
    $before: ID
) {
    jobs(
        workMode: $workMode
        jobType: $jobType
        sortBy: $sortBy
        location: $location
        proximityKm: $proximityKm
        searchTerm: $searchTerm
        minExperience: $minExperience
        maxExperience: $maxExperience
        minSalary: $minSalary
        maxSalary: $maxSalary
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
                skills
                location
                type
                workMode
                minSalary
                maxSalary
                minExperience
                maxExperience
                isActive
                createdAt
                updatedAt
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
    db_settings: DatabaseSettings,
    db_client: AsyncMongoClient,
) -> AsyncGenerator[Job]:
    """Create sample jobs for testing."""
    jobs = []

    # Job 1: Remote Python Developer in Mumbai
    job1 = await job_repo.create(
        organization=test_organization,
        title="Senior Python Developer",
        description="Looking for an experienced Python developer with Django expertise",
        skills=["Python", "Django", "PostgreSQL"],
        applicant_locations=["IN"],
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        work_mode="remote",
        job_type="full_time",
        min_salary=800000,
        max_salary=1200000,
        min_experience=3,
        max_experience=7,
        currency="INR",
    )
    job1.is_active = True
    await job1.save()
    jobs.append(job1)

    # Job 2: Hybrid JavaScript Developer in Mumbai
    job2 = await job_repo.create(
        organization=test_organization,
        title="Frontend JavaScript Developer",
        description="React and TypeScript developer needed for healthcare platform",
        skills=["JavaScript", "React", "TypeScript"],
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        work_mode="hybrid",
        job_type="full_time",
        min_salary=600000,
        max_salary=900000,
        min_experience=2,
        max_experience=5,
        currency="INR",
    )
    job2.is_active = True
    await job2.save()
    jobs.append(job2)

    # Job 3: Office-based Nurse in India
    job3 = await job_repo.create(
        organization=test_organization,
        title="Registered Nurse",
        description="Experienced nurse required for hospital operations",
        skills=["Nursing", "Patient Care", "Medical Records"],
        location="India",
        geo=GeoObject(type="Point", coordinates=(78.9629, 20.5937)),
        work_mode="office",
        job_type="full_time",
        min_salary=400000,
        max_salary=600000,
        min_experience=1,
        max_experience=10,
        currency="INR",
    )
    job3.is_active = True
    await job3.save()
    jobs.append(job3)

    # Job 4: Part-time Intern
    job4 = await job_repo.create(
        organization=test_organization,
        title="Medical Intern",
        description="Part-time internship for medical students",
        skills=["Medical Knowledge", "Learning"],
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        work_mode="office",
        job_type="internship",
        min_salary=20000,
        max_salary=30000,
        min_experience=0,
        max_experience=1,
        currency="INR",
    )
    job4.is_active = True
    await job4.save()
    jobs.append(job4)

    # Job 5: Contract Doctor
    job5 = await job_repo.create(
        organization=test_organization,
        title="Contract Doctor",
        description="Temporary contract position for experienced doctor",
        skills=["Medicine", "Diagnosis", "Treatment"],
        location="India",
        geo=GeoObject(type="Point", coordinates=(78.9629, 20.5937)),
        work_mode="office",
        job_type="contract",
        min_salary=1500000,
        max_salary=2000000,
        min_experience=5,
        max_experience=15,
        currency="INR",
    )
    job5.is_active = True
    await job5.save()
    jobs.append(job5)

    # Job 6: Inactive job (should not appear in results)
    job6 = await job_repo.create(
        organization=test_organization,
        title="Inactive Position",
        description="This job is inactive",
        skills=["Test"],
        applicant_locations=["IN"],
        work_mode="remote",
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        job_type="full_time",
        currency="INR",
    )
    # job6.is_active remains False
    jobs.append(job6)

    # Job 7: Expired job (should not appear in results)
    job7 = await job_repo.create(
        organization=test_organization,
        title="Expired Position",
        description="This job has expired",
        skills=["Test"],
        applicant_locations=["IN"],
        work_mode="remote",
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        job_type="full_time",
        expires_at=datetime.now(UTC) - timedelta(days=1),
        currency="INR",
    )
    job7.is_active = True
    await job7.save()
    jobs.append(job7)

    # wait to ensure search indexes are updated
    await asyncio.sleep(1.5)
    yield jobs
    for job in jobs:
        await job_repo.delete(job)


async def test_basic_query_all_jobs(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test basic query returning all active jobs."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": [],
            "jobType": [],
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return 5 active jobs (excluding inactive and expired)
    assert len(data["edges"]) == 5
    assert data["totalCount"] == 5

    # Verify all returned jobs are active
    for edge in data["edges"]:
        assert edge["node"]["isActive"] is True


async def test_work_mode_filter_remote_only(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by remote work mode only."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return 1 remote job
    assert len(data["edges"]) == 1
    assert data["edges"][0]["node"]["workMode"] == "REMOTE"
    assert data["edges"][0]["node"]["title"] == "Senior Python Developer"


async def test_work_mode_filter_multiple(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by multiple work modes."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return 2 jobs (remote + hybrid)
    assert len(data["edges"]) == 2
    work_modes = {edge["node"]["workMode"] for edge in data["edges"]}
    assert work_modes == {"REMOTE", "HYBRID"}


async def test_job_type_filter_full_time_only(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by full-time job type only."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME"],
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return 3 full-time jobs
    assert len(data["edges"]) == 3
    for edge in data["edges"]:
        assert edge["node"]["type"] == "FULL_TIME"


async def test_job_type_filter_multiple(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by multiple job types."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["INTERNSHIP", "CONTRACT"],
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return 2 jobs (internship + contract)
    assert len(data["edges"]) == 2
    job_types = {edge["node"]["type"] for edge in data["edges"]}
    assert job_types == {"INTERNSHIP", "CONTRACT"}


async def test_location_filter_mumbai(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by Mumbai location."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": [],
            "jobType": [],
            "location": "Mumbai",
            "proximityKm": 50,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return 3 Mumbai jobs
    assert len(data["edges"]) == 3
    for edge in data["edges"]:
        assert edge["node"]["location"] == "Mumbai"


async def test_location_filter_india(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by India location."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "location": "India",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs in India (including Mumbai which is in India)
    assert len(data["edges"]) >= 2  # At least the India-specific jobs


async def test_location_filter_unknown(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by unknown location."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "location": "UnknownCity",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return no jobs for unknown location
    assert len(data["edges"]) == 0
    assert data["totalCount"] == 0


async def test_search_term_python(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test search by Python term."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "searchTerm": "Python",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs containing Python
    assert len(data["edges"]) >= 1
    # Verify Python is in title, description, or skills
    python_found = False
    for edge in data["edges"]:
        node = edge["node"]
        if (
            "Python" in node["title"]
            or "Python" in node["description"]
            or "Python" in node["skills"]
        ):
            python_found = True
            break
    assert python_found


async def test_search_term_javascript(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test search by JavaScript term."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "searchTerm": "JavaScript",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return JavaScript-related jobs
    assert len(data["edges"]) >= 1
    assert any("JavaScript" in edge["node"]["skills"] for edge in data["edges"])


async def test_search_term_nurse(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test search by Nurse term."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "searchTerm": "Nurse",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return nursing jobs
    assert len(data["edges"]) >= 1
    assert any("Nurse" in edge["node"]["title"] for edge in data["edges"])


async def test_min_experience_filter(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by minimum experience."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "minExperience": 3,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs that accept 3+ years experience
    assert len(data["edges"]) >= 1
    for edge in data["edges"]:
        node = edge["node"]
        # Job should either have max_experience >= 3 or min_experience >= 3
        assert (
            node["maxExperience"] is None
            or node["maxExperience"] >= 3
            or node["minExperience"] >= 3
        )


async def test_max_experience_filter(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by maximum experience."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "maxExperience": 2,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs suitable for people with <= 2 years experience
    assert len(data["edges"]) >= 1
    for edge in data["edges"]:
        node = edge["node"]
        # Job should either have min_experience <= 2 or max_experience <= 2
        assert (
            node["minExperience"] is None
            or node["minExperience"] <= 2
            or node["maxExperience"] <= 2
        )


async def test_experience_range_filter(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by experience range."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "minExperience": 2,
            "maxExperience": 5,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs suitable for 2-5 years experience
    assert len(data["edges"]) >= 1


async def test_min_salary_filter(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by minimum salary."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "minSalary": 500000,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs with salary >= 500000
    assert len(data["edges"]) >= 1
    for edge in data["edges"]:
        node = edge["node"]
        # Job should either have max_salary >= 500000 or min_salary >= 500000
        assert (
            node["maxSalary"] is None
            or node["maxSalary"] >= 500000
            or node["minSalary"] >= 500000
        )


async def test_max_salary_filter(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by maximum salary."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "maxSalary": 700000,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs with salary <= 700000
    assert len(data["edges"]) >= 1
    for edge in data["edges"]:
        node = edge["node"]
        # Job should either have min_salary <= 700000 or max_salary <= 700000
        assert (
            node["minSalary"] is None
            or node["minSalary"] <= 700000
            or node["maxSalary"] <= 700000
        )


async def test_salary_range_filter(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test filtering by salary range."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "minSalary": 400000,
            "maxSalary": 1000000,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs in the 400k-1M salary range
    assert len(data["edges"]) >= 1


async def test_sort_by_relevance(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test sorting by relevance (default)."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "sortBy": "RELEVANCE",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]
    assert len(data["edges"]) == 5


async def test_sort_by_updated_at(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test sorting by updated_at."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "sortBy": "UPDATED_AT",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]
    assert len(data["edges"]) == 5

    # Verify jobs are sorted by updated_at (most recent first)
    if len(data["edges"]) > 1:
        for i in range(len(data["edges"]) - 1):
            current_updated = data["edges"][i]["node"]["updatedAt"]
            next_updated = data["edges"][i + 1]["node"]["updatedAt"]
            assert current_updated >= next_updated


async def test_pagination_forward_first(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test forward pagination with first parameter."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 2,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return first 2 jobs
    assert len(data["edges"]) == 2
    assert data["pageInfo"]["hasNextPage"] is True
    assert data["pageInfo"]["hasPreviousPage"] is False
    assert data["pageInfo"]["startCursor"] is not None
    assert data["pageInfo"]["endCursor"] is not None


async def test_pagination_forward_after(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test forward pagination with after cursor."""
    # First, get the first page
    first_response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 2,
        },
    )

    first_data = first_response["data"]["jobs"]
    end_cursor = first_data["pageInfo"]["endCursor"]

    # Then get the next page
    second_response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 2,
            "after": end_cursor,
        },
    )

    assert "errors" not in second_response
    second_data = second_response["data"]["jobs"]

    # Should return next 2 jobs
    assert len(second_data["edges"]) <= 2
    assert second_data["pageInfo"]["hasPreviousPage"] is True

    # Verify no overlap between pages
    first_ids = {edge["node"]["id"] for edge in first_data["edges"]}
    second_ids = {edge["node"]["id"] for edge in second_data["edges"]}
    assert first_ids.isdisjoint(second_ids)


async def test_pagination_backward_last(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test backward pagination with last parameter."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "last": 2,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return last 2 jobs
    assert len(data["edges"]) == 2
    assert data["pageInfo"]["hasNextPage"] is False
    assert data["pageInfo"]["hasPreviousPage"] is True
    assert data["pageInfo"]["startCursor"] is not None
    assert data["pageInfo"]["endCursor"] is not None


async def test_pagination_backward_before(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test backward pagination with before cursor."""
    # First, get the last page
    last_response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "last": 2,
        },
    )

    last_data = last_response["data"]["jobs"]
    start_cursor = last_data["pageInfo"]["startCursor"]

    # Then get the previous page
    prev_response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "last": 2,
            "before": start_cursor,
        },
    )

    assert "errors" not in prev_response
    prev_data = prev_response["data"]["jobs"]

    # Should return previous jobs
    assert len(prev_data["edges"]) <= 2

    # Verify no overlap between pages
    last_ids = {edge["node"]["id"] for edge in last_data["edges"]}
    prev_ids = {edge["node"]["id"] for edge in prev_data["edges"]}
    assert last_ids.isdisjoint(prev_ids)


async def test_combined_filters_work_mode_and_location(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test combining work mode and location filters."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE"],
            "jobType": [],
            "location": "Mumbai",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return remote jobs in Mumbai
    assert len(data["edges"]) >= 1
    for edge in data["edges"]:
        assert edge["node"]["workMode"] == "REMOTE"
        assert edge["node"]["location"] == "Mumbai"


async def test_combined_filters_search_and_experience(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test combining search term and experience filters."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "searchTerm": "Developer",
            "minExperience": 2,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return developer jobs requiring 2+ years experience
    assert len(data["edges"]) >= 1


async def test_combined_filters_salary_and_job_type(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test combining salary and job type filters."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME"],
            "minSalary": 600000,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return full-time jobs with salary >= 600k
    assert len(data["edges"]) >= 1
    for edge in data["edges"]:
        assert edge["node"]["type"] == "FULL_TIME"


async def test_combined_filters_all_parameters(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test combining all filter parameters."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID"],
            "jobType": ["FULL_TIME"],
            "location": "Mumbai",
            "searchTerm": "Developer",
            "minExperience": 1,
            "maxExperience": 10,
            "minSalary": 500000,
            "maxSalary": 1500000,
            "sortBy": "UPDATED_AT",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs matching all criteria
    for edge in data["edges"]:
        node = edge["node"]
        assert node["workMode"] in ["REMOTE", "HYBRID"]
        assert node["type"] == "FULL_TIME"
        assert node["location"] == "Mumbai"


async def test_empty_filters_arrays(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test with empty filter arrays."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": [],
            "jobType": [],
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return all jobs when filters are empty
    assert len(data["edges"]) == 5
    assert data["totalCount"] == 5


async def test_proximity_km_with_location(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test proximity_km parameter with location."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "location": "Mumbai",
            "proximityKm": 50.0,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs within 50km of Mumbai
    assert len(data["edges"]) >= 1


async def test_proximity_km_without_location(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test proximity_km parameter without location (should be ignored)."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "proximityKm": 50.0,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return all jobs (proximity ignored without location)
    assert len(data["edges"]) == 5


async def test_edge_case_zero_experience(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test edge case with zero experience requirement."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "minExperience": 0,
            "maxExperience": 0,
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return jobs suitable for 0 experience
    assert len(data["edges"]) >= 1


async def test_edge_case_very_high_salary(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test edge case with very high salary requirement."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "minSalary": 5000000,  # 50 lakhs
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return no jobs (no job pays that much in our sample)
    assert len(data["edges"]) == 0


async def test_edge_case_very_high_experience(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test edge case with very high experience requirement."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "minExperience": 20,  # 20 years
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should return very few or no jobs
    assert len(data["edges"]) <= 1


async def test_case_insensitive_search(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test case insensitive search."""
    # Test lowercase
    response_lower = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "searchTerm": "python",
            "first": 10,
        },
    )

    # Test uppercase
    response_upper = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "searchTerm": "PYTHON",
            "first": 10,
        },
    )

    assert "errors" not in response_lower
    assert "errors" not in response_upper

    # Both should return the same results
    lower_ids = {edge["node"]["id"] for edge in response_lower["data"]["jobs"]["edges"]}
    upper_ids = {edge["node"]["id"] for edge in response_upper["data"]["jobs"]["edges"]}
    assert lower_ids == upper_ids


@pytest.mark.xfail(reason="Partial word search not yet supported")
async def test_partial_word_search(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test partial word search."""
    # TODO: support this
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "searchTerm": "Develop",  # Partial word
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should find jobs with "Developer" in title
    assert len(data["edges"]) >= 1


async def test_multi_word_search(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test multi-word search."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "searchTerm": "Python Developer",
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Should find jobs matching both words
    assert len(data["edges"]) >= 1


async def test_pagination_consistency(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test pagination consistency across multiple requests."""
    # Get all jobs in one request
    all_response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 10,
        },
    )

    all_jobs = all_response["data"]["jobs"]["edges"]

    # Get jobs in pages of 2
    paginated_jobs = []
    cursor = None

    while True:
        variables: dict[str, Any] = {
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 2,
        }
        if cursor:
            variables["after"] = cursor

        response = await graphql_client(JOBS_QUERY, variables=variables)
        page_data = response["data"]["jobs"]

        paginated_jobs.extend(page_data["edges"])

        if not page_data["pageInfo"]["hasNextPage"]:
            break

        cursor = page_data["pageInfo"]["endCursor"]

    # Compare results
    all_job_ids = {edge["node"]["id"] for edge in all_jobs}
    paginated_job_ids = {edge["node"]["id"] for edge in paginated_jobs}

    assert all_job_ids == paginated_job_ids
    assert len(all_jobs) == len(paginated_jobs)


async def test_no_duplicate_results(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test that no duplicate jobs are returned."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 10,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Check for duplicates
    job_ids = [edge["node"]["id"] for edge in data["edges"]]
    unique_job_ids = set(job_ids)

    assert len(job_ids) == len(unique_job_ids), "Duplicate jobs found in results"


async def test_total_count_accuracy(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test that totalCount is accurate."""
    response = await graphql_client(
        JOBS_QUERY,
        variables={
            "workMode": ["REMOTE", "HYBRID", "OFFICE"],
            "jobType": ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
            "first": 2,
        },
    )

    assert "errors" not in response
    data = response["data"]["jobs"]

    # Total count should be 5 (active jobs)
    assert data["totalCount"] == 5

    # Even with pagination, total count should remain the same
    assert len(data["edges"]) == 2  # Only 2 returned due to first: 2
    assert data["totalCount"] == 5  # But total is still 5

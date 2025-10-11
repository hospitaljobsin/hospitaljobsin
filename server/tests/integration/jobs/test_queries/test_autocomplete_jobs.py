import asyncio
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

AUTOCOMPLETE_JOBS_QUERY = """
query AutocompleteJobsQuery($searchTerm: String!) {
    autocompleteJobs(searchTerm: $searchTerm) {
        jobs {
            jobId
            displayName
        }
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

    # Job 1: Python Developer
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

    # Job 2: JavaScript Developer
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

    # Job 3: Registered Nurse
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

    # Job 4: Cardiologist
    job4 = await job_repo.create(
        organization=test_organization,
        title="Cardiologist",
        description="Experienced cardiologist needed",
        skills=["Cardiology", "Medicine"],
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        work_mode="office",
        job_type="full_time",
        currency="INR",
    )
    job4.is_active = True
    await job4.save()
    jobs.append(job4)

    # Job 5: Inactive job (should not appear)
    job5 = await job_repo.create(
        organization=test_organization,
        title="Inactive Position",
        description="This job is inactive",
        skills=["Test"],
        work_mode="remote",
        location="Mumbai",
        geo=GeoObject(type="Point", coordinates=(72.8777, 19.0760)),
        job_type="full_time",
        currency="INR",
    )
    jobs.append(job5)

    # Wait for search indexes to update
    await asyncio.sleep(1.5)
    yield jobs
    for job in jobs:
        await job_repo.delete(job)


async def test_autocomplete_exact_match(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test exact match returns the job."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Python"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) >= 1
    assert any("Python" in job["displayName"] for job in data["jobs"])


async def test_autocomplete_partial_match(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test partial match returns matching jobs."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Dev"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) >= 1
    assert any("Developer" in job["displayName"] for job in data["jobs"])


async def test_autocomplete_skill_match(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test matching by skill."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "React"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) >= 1
    assert any("JavaScript" in job["displayName"] for job in data["jobs"])


async def test_autocomplete_organization_name_match(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test matching by organization name."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Hospital"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) >= 1


async def test_autocomplete_case_insensitive(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test case insensitive search."""
    response_lower = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "python"},
    )

    response_upper = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "PYTHON"},
    )

    assert "errors" not in response_lower
    assert "errors" not in response_upper

    lower_jobs = response_lower["data"]["autocompleteJobs"]["jobs"]
    upper_jobs = response_upper["data"]["autocompleteJobs"]["jobs"]

    assert len(lower_jobs) == len(upper_jobs)
    if lower_jobs:
        assert lower_jobs[0]["displayName"] == upper_jobs[0]["displayName"]


async def test_autocomplete_no_results(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test search with no matching results."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "NonExistentJob"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) == 0


async def test_autocomplete_empty_search_term(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test search with empty string."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": ""},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) == 0


async def test_autocomplete_only_active_jobs(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test that only active jobs are returned."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Inactive"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    # Should not return the inactive job
    assert len(data["jobs"]) == 0


async def test_autocomplete_deduplication(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test that duplicate job titles are deduplicated."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Developer"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    # Check that all returned job titles are unique
    titles = [job["displayName"] for job in data["jobs"]]
    assert len(titles) == len(set(titles))


async def test_autocomplete_results_limit(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test that results are limited to a reasonable number."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "a"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    # Should be limited (default is 10)
    assert len(data["jobs"]) <= 10


async def test_autocomplete_job_id_format(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test that job IDs are returned in correct format."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Python"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    if data["jobs"]:
        job = data["jobs"][0]
        assert "jobId" in job
        assert isinstance(job["jobId"], str)
        assert len(job["jobId"]) > 0


async def test_autocomplete_display_name_format(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test that display names are returned correctly."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Python"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    if data["jobs"]:
        job = data["jobs"][0]
        assert "displayName" in job
        assert isinstance(job["displayName"], str)
        assert len(job["displayName"]) > 0


async def test_autocomplete_multiple_word_search(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test multi-word search."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Python Developer"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) >= 1
    assert any("Python" in job["displayName"] for job in data["jobs"])


async def test_autocomplete_medical_terms(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test search with medical terms."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Nurse"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) >= 1
    assert any("Nurse" in job["displayName"] for job in data["jobs"])


async def test_autocomplete_specialty_search(
    graphql_client: GraphQLClient,
    sample_jobs: list[Job],
) -> None:
    """Test search with medical specialty."""
    response = await graphql_client(
        AUTOCOMPLETE_JOBS_QUERY,
        variables={"searchTerm": "Cardio"},
    )

    assert "errors" not in response
    data = response["data"]["autocompleteJobs"]

    assert len(data["jobs"]) >= 1
    assert any("Cardiologist" in job["displayName"] for job in data["jobs"])

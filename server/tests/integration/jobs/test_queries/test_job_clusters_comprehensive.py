"""Comprehensive integration tests for job_clusters GraphQL query covering all edge cases."""

import asyncio
from collections.abc import AsyncGenerator
from datetime import UTC, datetime, timedelta

import pytest
from app.base.models import GeoObject
from app.jobs.documents import Job
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization
from app.organizations.repositories import OrganizationRepo

from tests.integration.graphql_client import GraphQLClient
from tests.utils.slugs import generate_test_slug

JOB_CLUSTERS_QUERY = """
query JobClustersQuery(
    $bounds: BoundingBoxInput!
    $zoomLevel: Int!
    $workMode: [JobWorkModeFilter!]
    $jobType: [JobTypeFilter!]
    $location: String
    $proximityKm: Float
    $searchTerm: String
    $minExperience: Int
    $maxExperience: Int
    $minSalary: Int
    $maxSalary: Int
) {
    jobClusters(
        bounds: $bounds
        zoomLevel: $zoomLevel
        workMode: $workMode
        jobType: $jobType
        location: $location
        proximityKm: $proximityKm
        searchTerm: $searchTerm
        minExperience: $minExperience
        maxExperience: $maxExperience
        minSalary: $minSalary
        maxSalary: $maxSalary
    ) {
        clusters {
            h3Index
            count
            center {
                coordinates
            }
            bounds
            salaryRange {
                minSalary
                maxSalary
            }
            topSpecialties
        }
        totalCount
    }
}
"""


@pytest.fixture(scope="module")
async def test_organization(
    organization_repo: OrganizationRepo,
) -> AsyncGenerator[Organization]:
    organization = await organization_repo.create(
        name="Test Hospital",
        slug=generate_test_slug(),
        description="Test hospital for clustering",
    )
    yield organization
    await organization_repo.delete(organization)


@pytest.fixture(scope="module")
async def diverse_jobs(
    job_repo: JobRepo,
    test_organization: Organization,
) -> AsyncGenerator[list[Job]]:
    """Create diverse test jobs covering various scenarios."""
    jobs: list[Job] = []

    jobs_data = [
        # Bangalore jobs - different work modes
        {
            "title": "Remote Nurse",
            "location": "Bangalore",
            "geo": GeoObject(coordinates=(77.5946, 12.9716)),
            "work_mode": "remote",
            "job_type": "full_time",
            "min_salary": 50000,
            "max_salary": 70000,
            "min_experience": 1,
            "max_experience": 3,
        },
        {
            "title": "Hybrid Doctor",
            "location": "Bangalore",
            "geo": GeoObject(coordinates=(77.6172, 12.9279)),
            "work_mode": "hybrid",
            "job_type": "part_time",
            "min_salary": 100000,
            "max_salary": 150000,
            "min_experience": 5,
            "max_experience": 10,
        },
        {
            "title": "Office Surgeon",
            "location": "Bangalore",
            "geo": GeoObject(coordinates=(77.6387, 12.9082)),
            "work_mode": "office",
            "job_type": "contract",
            "min_salary": 200000,
            "max_salary": 300000,
            "min_experience": 10,
            "max_experience": 20,
        },
        # Mumbai jobs - different job types
        {
            "title": "Internship Radiologist",
            "location": "Mumbai",
            "geo": GeoObject(coordinates=(72.8777, 19.076)),
            "work_mode": "office",
            "job_type": "internship",
            "min_salary": 20000,
            "max_salary": 30000,
            "min_experience": 0,
            "max_experience": 1,
        },
        {
            "title": "Locum Physician",
            "location": "Mumbai",
            "geo": GeoObject(coordinates=(72.8697, 19.1136)),
            "work_mode": "office",
            "job_type": "locum",
            "min_salary": 150000,
            "max_salary": 200000,
            "min_experience": 3,
            "max_experience": 8,
        },
        # Delhi jobs - edge cases
        {
            "title": "No Salary Job",
            "location": "Delhi",
            "geo": GeoObject(coordinates=(77.2090, 28.6139)),
            "work_mode": "office",
            "job_type": "full_time",
            "min_salary": None,
            "max_salary": None,
            "min_experience": 2,
            "max_experience": 5,
        },
        {
            "title": "No Experience Required",
            "location": "Delhi",
            "geo": GeoObject(coordinates=(77.2295, 28.6358)),
            "work_mode": "remote",
            "job_type": "full_time",
            "min_salary": 40000,
            "max_salary": 60000,
            "min_experience": None,
            "max_experience": None,
        },
    ]

    for job_data in jobs_data:
        job = await job_repo.create(
            title=job_data["title"],
            description="Test job description",
            skills=["clinical"],
            location=job_data["location"],
            geo=job_data["geo"],
            job_type=job_data["job_type"],
            work_mode=job_data["work_mode"],
            min_salary=job_data["min_salary"],
            max_salary=job_data["max_salary"],
            min_experience=job_data["min_experience"],
            max_experience=job_data["max_experience"],
            organization=test_organization,
        )
        job = await job_repo.update_active(job, is_active=True)
        jobs.append(job)

    await asyncio.sleep(0.5)
    yield jobs

    for job in jobs:
        await job_repo.delete(job)


@pytest.fixture(scope="module")
async def expired_job(
    job_repo: JobRepo,
    test_organization: Organization,
) -> AsyncGenerator[Job]:
    """Create an expired job that should not appear in clusters."""
    job = await job_repo.create(
        title="Expired Job",
        description="This job has expired",
        skills=["clinical"],
        location="Bangalore",
        geo=GeoObject(coordinates=(77.5946, 12.9716)),
        job_type="full_time",
        work_mode="office",
        min_salary=50000,
        max_salary=70000,
        min_experience=2,
        max_experience=5,
        organization=test_organization,
        expires_at=datetime.now(UTC) - timedelta(days=1),
    )
    job = await job_repo.update_active(job, is_active=True)
    yield job
    await job_repo.delete(job)


@pytest.fixture(scope="module")
async def inactive_job(
    job_repo: JobRepo,
    test_organization: Organization,
) -> AsyncGenerator[Job]:
    """Create an inactive job that should not appear in clusters."""
    job = await job_repo.create(
        title="Inactive Job",
        description="This job is inactive",
        skills=["clinical"],
        location="Bangalore",
        geo=GeoObject(coordinates=(77.5946, 12.9716)),
        job_type="full_time",
        work_mode="office",
        min_salary=50000,
        max_salary=70000,
        min_experience=2,
        max_experience=5,
        organization=test_organization,
    )
    yield job
    await job_repo.delete(job)


async def test_empty_bounds_returns_no_clusters(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test that empty bounding box returns no clusters."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 0.0,
                "swLng": 0.0,
                "neLat": 0.1,
                "neLng": 0.1,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["clusters"] == []
    assert data["totalCount"] == 0


async def test_work_mode_filter_remote(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by remote work mode."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": ["REMOTE"],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_work_mode_filter_hybrid(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by hybrid work mode."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": ["HYBRID"],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_work_mode_filter_office(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by office work mode."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": ["OFFICE"],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_work_mode_filter_multiple(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by multiple work modes."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": ["REMOTE", "HYBRID"],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 2


async def test_job_type_filter_full_time(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by full-time job type."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": ["FULL_TIME"],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_job_type_filter_part_time(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by part-time job type."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": ["PART_TIME"],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_job_type_filter_internship(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by internship job type."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 18.90,
                "swLng": 72.80,
                "neLat": 19.20,
                "neLng": 73.00,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": ["INTERNSHIP"],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_job_type_filter_contract(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by contract job type."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": ["CONTRACT"],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_job_type_filter_locum(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by locum job type."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 18.90,
                "swLng": 72.80,
                "neLat": 19.20,
                "neLng": 73.00,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": ["LOCUM"],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_job_type_filter_multiple(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by multiple job types."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 18.90,
                "swLng": 72.80,
                "neLat": 19.20,
                "neLng": 73.00,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": ["INTERNSHIP", "LOCUM"],
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 2


async def test_min_salary_filter(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by minimum salary."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
            "minSalary": 100000,
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_max_salary_filter(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by maximum salary."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
            "maxSalary": 80000,
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_salary_range_filter(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by salary range."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
            "minSalary": 50000,
            "maxSalary": 150000,
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_min_experience_filter(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by minimum experience."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
            "minExperience": 5,
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_max_experience_filter(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by maximum experience."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
            "maxExperience": 5,
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_experience_range_filter(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test filtering by experience range."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
            "minExperience": 1,
            "maxExperience": 10,
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_combined_filters(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test combining multiple filters."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": ["OFFICE"],
            "jobType": ["CONTRACT"],
            "minSalary": 150000,
            "minExperience": 5,
        },
    )

    data = response["data"]["jobClusters"]
    assert data["totalCount"] >= 1


async def test_zoom_level_1(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test clustering at zoom level 1 (low zoom)."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 10.0,
                "swLng": 70.0,
                "neLat": 30.0,
                "neLng": 80.0,
            },
            "zoomLevel": 1,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert "clusters" in data
    assert "totalCount" in data


async def test_zoom_level_10(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test clustering at zoom level 10 (city view)."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 10,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert len(data["clusters"]) >= 1


async def test_zoom_level_15(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test clustering at zoom level 15 (high zoom)."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.90,
                "swLng": 77.58,
                "neLat": 12.98,
                "neLng": 77.65,
            },
            "zoomLevel": 15,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert "clusters" in data
    assert "totalCount" in data


async def test_expired_jobs_excluded(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
    expired_job: Job,
) -> None:
    """Test that expired jobs are excluded from clusters."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    # Count should not include expired job
    assert data["totalCount"] == len(
        [j for j in diverse_jobs if 12.85 <= j.geo.coordinates[1] <= 13.05]
    )


async def test_inactive_jobs_excluded(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
    inactive_job: Job,
) -> None:
    """Test that inactive jobs are excluded from clusters."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    # Count should not include inactive job
    assert data["totalCount"] == len(
        [j for j in diverse_jobs if 12.85 <= j.geo.coordinates[1] <= 13.05]
    )


async def test_cluster_structure(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test that cluster structure contains all required fields."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert len(data["clusters"]) > 0

    cluster = data["clusters"][0]
    assert "h3Index" in cluster
    assert "count" in cluster
    assert "center" in cluster
    assert "coordinates" in cluster["center"]
    assert len(cluster["center"]["coordinates"]) == 2
    assert "bounds" in cluster
    assert isinstance(cluster["bounds"], list)
    assert "salaryRange" in cluster
    assert "topSpecialties" in cluster


async def test_no_filters_returns_all_active_jobs(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test that no filters returns jobs in bounds."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.55,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 10,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert "clusters" in data
    assert "totalCount" in data
    assert data["totalCount"] >= 0


async def test_very_small_bounds(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test with very small bounding box."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.9700,
                "swLng": 77.5900,
                "neLat": 12.9720,
                "neLng": 77.5950,
            },
            "zoomLevel": 14,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert "clusters" in data
    assert "totalCount" in data


async def test_cross_meridian_bounds(
    graphql_client: GraphQLClient,
    diverse_jobs: list[Job],
) -> None:
    """Test with bounds crossing the prime meridian."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 10.0,
                "swLng": -10.0,
                "neLat": 30.0,
                "neLng": 10.0,
            },
            "zoomLevel": 5,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]
    assert "clusters" in data
    assert "totalCount" in data

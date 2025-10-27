"""Integration tests for basic job clustering GraphQL query."""

import asyncio
from collections.abc import AsyncGenerator

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
    """Create a test organization."""
    organization = await organization_repo.create(
        name="Test Hospital",
        slug=generate_test_slug(),
        description="Test hospital for clustering",
    )
    yield organization
    await organization_repo.delete(organization)


@pytest.fixture(scope="module")
async def clustered_jobs(
    job_repo: JobRepo,
    test_organization: Organization,
) -> AsyncGenerator[list[Job]]:
    """Create test jobs in different geographic locations for clustering."""
    jobs: list[Job] = []

    # Create jobs in Bangalore area
    # These should cluster together at lower zoom levels
    bangalore_jobs_data: list[dict[str, str | GeoObject | int]] = [
        {
            "title": "Registered Nurse - Bangalore",
            "location_name": "Bangalore, Karnataka, India",
            "geo": GeoObject(
                coordinates=(77.5946, 12.9716),  # lng, lat - Bangalore center
            ),
            "specialty": "nursing",
            "min_salary": 70000,
            "max_salary": 90000,
        },
        {
            "title": "Nurse Practitioner - Koramangala",
            "location_name": "Koramangala, Bangalore, Karnataka, India",
            "geo": GeoObject(
                coordinates=(77.6172, 12.9279),  # lng, lat - Koramangala
            ),
            "specialty": "nursing",
            "min_salary": 85000,
            "max_salary": 110000,
        },
        {
            "title": "Critical Care Nurse - HSR Layout",
            "location_name": "HSR Layout, Bangalore, Karnataka, India",
            "geo": GeoObject(
                coordinates=(77.6387, 12.9082),  # lng, lat - HSR Layout
            ),
            "specialty": "nursing",
            "min_salary": 75000,
            "max_salary": 95000,
        },
    ]

    # Create jobs in Mumbai area
    # These should form a separate cluster
    mumbai_jobs_data: list[dict[str, str | GeoObject | int]] = [
        {
            "title": "Radiologist - Mumbai",
            "location_name": "Mumbai, Maharashtra, India",
            "geo": GeoObject(
                coordinates=(72.8777, 19.076),  # lng, lat - Mumbai center
            ),
            "specialty": "radiology",
            "min_salary": 250000,
            "max_salary": 350000,
        },
        {
            "title": "Radiologic Technologist - Andheri",
            "location_name": "Andheri, Mumbai, Maharashtra, India",
            "geo": GeoObject(
                coordinates=(72.8697, 19.1136),  # lng, lat - Andheri
            ),
            "specialty": "radiology",
            "min_salary": 60000,
            "max_salary": 80000,
        },
    ]

    # Create all jobs
    for job_data in bangalore_jobs_data + mumbai_jobs_data:
        job = await job_repo.create(
            title=job_data["title"],
            description=f"Test job for {job_data['specialty']}",
            skills=["clinical"],
            location=job_data["location_name"],
            geo=job_data["geo"],
            job_type="full_time",
            work_mode="office",
            min_salary=job_data["min_salary"],
            max_salary=job_data["max_salary"],
            min_experience=2,
            max_experience=5,
            organization=test_organization,
        )
        jobs.append(job)

    # Wait a bit for indexing
    await asyncio.sleep(0.5)

    yield jobs

    # Cleanup
    for job in jobs:
        await job_repo.delete(job)


async def test_clusters_at_low_zoom_level(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test that jobs are clustered at low zoom levels."""
    # Use zoom level 5 (should use resolution 3)
    # Bounding box covering India
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 6.0,  # Southern India
                "swLng": 68.0,  # Western India
                "neLat": 38.0,  # Northern India
                "neLng": 98.0,  # Eastern India
            },
            "zoomLevel": 5,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]

    # Should have clusters (Bangalore and Mumbai jobs should be in separate clusters)
    assert len(data["clusters"]) >= 1
    assert data["totalCount"] == 5  # Total of 5 jobs

    # Each cluster should have the required fields
    for cluster in data["clusters"]:
        assert "h3Index" in cluster
        assert "count" in cluster
        assert cluster["count"] > 0
        assert "center" in cluster
        assert "lat" in cluster["center"]
        assert "lng" in cluster["center"]
        assert "bounds" in cluster
        assert len(cluster["bounds"]) > 0

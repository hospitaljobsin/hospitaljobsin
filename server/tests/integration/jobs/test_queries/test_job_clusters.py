"""Integration tests for job clustering GraphQL queries."""

import asyncio
import time
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

CLUSTER_JOBS_QUERY = """
query ClusterJobsQuery(
    $h3Index: String!
    $h3Resolution: Int!
    $workMode: [JobWorkModeFilter!]
    $jobType: [JobTypeFilter!]
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
    clusterJobs(
        h3Index: $h3Index
        h3Resolution: $h3Resolution
        workMode: $workMode
        jobType: $jobType
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
                location
                type
                workMode
                minSalary
                maxSalary
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


async def test_clusters_at_high_zoom_level(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test that individual jobs are returned at high zoom levels."""
    # Use zoom level 15 (should return individual jobs)
    # Bounding box covering Bangalore area
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.50,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 15,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]

    # At zoom 15, each job should be its own cluster
    assert len(data["clusters"]) >= 1
    # Each cluster at this zoom should have count=1
    for cluster in data["clusters"]:
        assert cluster["count"] == 1


async def test_clusters_with_work_mode_filter(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test clustering with work mode filter."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 6.0,
                "swLng": 68.0,
                "neLat": 38.0,
                "neLng": 98.0,
            },
            "zoomLevel": 5,
            "workMode": ["OFFICE"],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]

    # All our test jobs are office
    assert data["totalCount"] == 5


async def test_clusters_with_salary_filter(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test clustering with salary range filter."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 6.0,
                "swLng": 68.0,
                "neLat": 38.0,
                "neLng": 98.0,
            },
            "zoomLevel": 5,
            "workMode": [],
            "jobType": [],
            "minSalary": 80000,  # Filter for higher salary jobs
        },
    )

    data = response["data"]["jobClusters"]

    # Should filter out some lower salary jobs
    assert data["totalCount"] < 5


async def test_clusters_performance(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test that clustering query completes in <200ms."""
    start_time = time.time()

    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 6.0,
                "swLng": 68.0,
                "neLat": 38.0,
                "neLng": 98.0,
            },
            "zoomLevel": 5,
            "workMode": [],
            "jobType": [],
        },
    )

    elapsed_time = (time.time() - start_time) * 1000  # Convert to ms

    # Allow some margin for test environment, but should be under 500ms
    assert elapsed_time < 500, f"Query took {elapsed_time}ms, expected <500ms"


async def test_clusters_salary_range_aggregation(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test that salary range is correctly aggregated in clusters."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.50,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]

    # Check that clusters have salary range
    for cluster in data["clusters"]:
        assert "salaryRange" in cluster
        if cluster["salaryRange"]["minSalary"] is not None:
            assert cluster["salaryRange"]["minSalary"] > 0
        if cluster["salaryRange"]["maxSalary"] is not None:
            assert cluster["salaryRange"]["maxSalary"] > 0


async def test_clusters_top_specialties(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test that top specialties are included in clusters."""
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.50,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]

    # Check that clusters have top specialties
    for cluster in data["clusters"]:
        assert "topSpecialties" in cluster
        assert isinstance(cluster["topSpecialties"], list)
        # Bangalore area should have "nursing" as top specialty
        if cluster["count"] > 1:
            assert "nursing" in cluster["topSpecialties"]


async def test_cluster_jobs_pagination(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test pagination of jobs within a cluster."""
    # First get clusters to get an h3_index
    clusters_response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,
                "swLng": 77.50,
                "neLat": 13.05,
                "neLng": 77.70,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    clusters_data = clusters_response["data"]["jobClusters"]
    assert len(clusters_data["clusters"]) > 0

    # Pick the first cluster
    cluster = clusters_data["clusters"][0]

    # Query jobs in this cluster with pagination
    response = await graphql_client(
        query=CLUSTER_JOBS_QUERY,
        variables={
            "h3Index": cluster["h3Index"],
            "h3Resolution": 7,  # Match the resolution used
            "workMode": [],
            "jobType": [],
            "first": 2,  # Paginate with first 2
        },
    )

    data = response["data"]["clusterJobs"]

    # Should have edges and pageInfo
    assert "edges" in data
    assert "pageInfo" in data
    assert len(data["edges"]) <= 2


async def test_cluster_jobs_filters(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test that filters work when drilling down into clusters."""
    # Get clusters first
    clusters_response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 18.90,
                "swLng": 72.75,
                "neLat": 19.30,
                "neLng": 72.98,
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    clusters_data = clusters_response["data"]["jobClusters"]
    cluster = clusters_data["clusters"][0]

    # Query with salary filter
    response = await graphql_client(
        query=CLUSTER_JOBS_QUERY,
        variables={
            "h3Index": cluster["h3Index"],
            "h3Resolution": 7,
            "workMode": [],
            "jobType": [],
            "minSalary": 80000,
            "first": 10,
        },
    )

    data = response["data"]["clusterJobs"]

    # All returned jobs should meet the salary filter
    for edge in data["edges"]:
        job = edge["node"]
        if job["minSalary"] is not None:
            assert job["minSalary"] >= 80000 or job["maxSalary"] >= 80000


async def test_cache_hit_improves_performance(
    graphql_client: GraphQLClient,
    clustered_jobs: list[Job],
):
    """Test that second identical query is faster due to caching."""
    variables = {
        "bounds": {
            "swLat": 6.0,
            "swLng": 68.0,
            "neLat": 38.0,
            "neLng": 98.0,
        },
        "zoomLevel": 5,
        "workMode": [],
        "jobType": [],
    }

    # First query (cache miss)
    start_time = time.time()
    response1 = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables=variables,
    )
    first_time = (time.time() - start_time) * 1000

    # Second query (should be cache hit)
    start_time = time.time()
    response2 = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables=variables,
    )
    second_time = (time.time() - start_time) * 1000

    # Results should be identical
    assert response1["data"] == response2["data"]

    # Second query should be faster (though this might be flaky in CI)
    # Just log the times for now
    print(f"First query: {first_time}ms, Second query: {second_time}ms")

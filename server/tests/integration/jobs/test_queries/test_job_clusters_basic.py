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

    # Create test jobs with valid Bangalore coordinates
    bangalore_jobs_data: list[dict[str, str | GeoObject | int]] = [
        {
            "title": "Software Engineer - Koramangala",
            "location_name": "Koramangala, Bangalore",
            "geo": GeoObject(coordinates=(77.62, 12.93)),
            "specialty": "software_engineering",
            "min_salary": 80000,
            "max_salary": 120000,
        },
        {
            "title": "Software Engineer - HSR Layout",
            "location_name": "HSR Layout, Bangalore",
            "geo": GeoObject(coordinates=(77.64, 12.91)),
            "specialty": "software_engineering",
            "min_salary": 85000,
            "max_salary": 125000,
        },
        {
            "title": "Software Engineer - Bangalore City",
            "location_name": "Bangalore City",
            "geo": GeoObject(coordinates=(77.59, 12.97)),
            "specialty": "software_engineering",
            "min_salary": 75000,
            "max_salary": 115000,
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

    # Create all jobs using job_repo.create()
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
        # Activate the job for clustering (default is is_active=False)
        job.is_active = True
        await job.save()
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

    # Debug: Check actual job data in MongoDB
    print(f"🔍 DEBUG: Found {len(clustered_jobs)} jobs in fixture")
    for i, job in enumerate(clustered_jobs):
        print(f"Job {i + 1}: {job.title}")
        print(f"  ID: {job.id}")
        print(f"  geo: {job.geo}")
        print(f"  geo type: {type(job.geo)}")
        if hasattr(job.geo, "coordinates"):
            print(f"  geo.coordinates: {job.geo.coordinates}")
            coords = job.geo.coordinates
            bbox_match = (77.55 <= coords[0] <= 77.7) and (12.85 <= coords[1] <= 13.05)
            print(f"  In bbox [77.55-77.7, 12.85-13.05]: {bbox_match}")
        print(f"  h3_indexes.6: {job.h3_indexes.get('6') if job.h3_indexes else None}")
        print()

    # Test individual queries
    from pymongo import AsyncMongoClient

    client = AsyncMongoClient(
        "mongodb://user:pass@localhost:27017/?directConnection=true"
    )
    db = client[clustered_jobs[0].get_pymongo_collection().database.name]
    jobs_collection = db["jobs"]

    print("🔍 Testing individual MongoDB queries:")

    # Test H3 query alone
    h3_query = {
        "h3_indexes.6": {
            "$in": ["86618925fffffff", "866189247ffffff", "8660145b7ffffff"]
        }
    }
    h3_count = await jobs_collection.count_documents(h3_query)
    print(f"  H3 query alone: {h3_count} jobs")

    # Test geo query alone
    geo_query = {"geo": {"$geoWithin": {"$box": [[77.55, 12.85], [77.7, 13.05]]}}}
    geo_count = await jobs_collection.count_documents(geo_query)
    print(f"  Geo query alone: {geo_count} jobs")

    # Test combined query
    combined_query = {
        "h3_indexes.6": {
            "$in": ["86618925fffffff", "866189247ffffff", "8660145b7ffffff"]
        },
        "geo": {"$geoWithin": {"$box": [[77.55, 12.85], [77.7, 13.05]]}},
    }
    combined_count = await jobs_collection.count_documents(combined_query)
    print(f"  Combined query: {combined_count} jobs")

    # Check a sample job document structure
    sample_job = await jobs_collection.find_one({})
    if sample_job:
        print("\\n📋 Sample job document structure:")
        print(f"  _id: {sample_job.get('_id')}")
        print(f"  is_active: {sample_job.get('is_active')}")
        print(f"  expires_at: {sample_job.get('expires_at')}")
        print(f"  geo: {sample_job.get('geo')}")
        print(f"  h3_indexes: {sample_job.get('h3_indexes')}")

    # Test the exact aggregation query conditions
    aggregation_query = {
        "is_active": True,
        "$or": [
            {"expires_at": {"$gt": "2025-10-28T05:26:21Z"}},  # Current time
            {"expires_at": None},
        ],
        "geo": {"$geoWithin": {"$box": [[77.55, 12.85], [77.7, 13.05]]}},
        "h3_indexes.6": {
            "$in": ["86618925fffffff", "866189247ffffff", "8660145b7ffffff"]
        },
    }
    aggregation_count = await jobs_collection.count_documents(aggregation_query)
    print(f"  Full aggregation query: {aggregation_count} jobs")

    await client.close()

    # Use zoom level 8 for better performance
    # Bounding box covering Bangalore area (much smaller and reasonable)
    response = await graphql_client(
        query=JOB_CLUSTERS_QUERY,
        variables={
            "bounds": {
                "swLat": 12.85,  # Southern Bangalore
                "swLng": 77.55,  # Western Bangalore
                "neLat": 13.05,  # Northern Bangalore
                "neLng": 77.70,  # Eastern Bangalore
            },
            "zoomLevel": 8,
            "workMode": [],
            "jobType": [],
        },
    )

    data = response["data"]["jobClusters"]

    # Should have clusters for jobs within the Bangalore bounding box
    assert len(data["clusters"]) >= 1
    assert data["totalCount"] == 3  # Only 3 Bangalore jobs within the bounding box

    # Each cluster should have the required fields
    for cluster in data["clusters"]:
        assert "h3Index" in cluster
        assert "count" in cluster
        assert cluster["count"] > 0
        assert "center" in cluster
        assert "coordinates" in cluster["center"]
        assert len(cluster["center"]["coordinates"]) == 2
        assert "bounds" in cluster
        assert len(cluster["bounds"]) > 0

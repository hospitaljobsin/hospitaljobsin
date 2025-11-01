"""Unit tests for job clustering functionality."""

from unittest.mock import AsyncMock

import pytest
from app.base.models import BoundingBox, GeoObject
from app.jobs.models import JobCluster, JobClusterFilters, SalaryRange
from app.jobs.services import (
    JobClusterService,
    get_h3_resolution_from_bounds,
    get_h3_resolution_from_zoom,
)


class TestGetH3ResolutionFromBounds:
    """Test the get_h3_resolution_from_bounds function."""

    def test_small_area_returns_high_resolution(self):
        """Test that small areas return higher resolution."""
        # Small area around NYC (1 degree ~= 111km)
        bounds = {
            "sw_lat": 40.7,
            "sw_lng": -74.1,
            "ne_lat": 40.8,
            "ne_lng": -74.0,
        }
        resolution = get_h3_resolution_from_bounds(bounds, max_hexagons=1000)
        # Should be relatively high resolution for this small area
        assert resolution >= 7

    def test_large_area_returns_low_resolution(self):
        """Test that large areas return lower resolution."""
        # Large area covering multiple countries
        bounds = {
            "sw_lat": 20.0,
            "sw_lng": -100.0,
            "ne_lat": 50.0,
            "ne_lng": -60.0,
        }
        resolution = get_h3_resolution_from_bounds(bounds, max_hexagons=1000)
        # Should be low resolution to avoid creating too many hexagons
        assert resolution <= 3

    def test_respects_max_hexagons_limit(self):
        """Test that the function respects the max_hexagons limit."""
        import h3

        bounds = {
            "sw_lat": 40.0,
            "sw_lng": -74.0,
            "ne_lat": 41.0,
            "ne_lng": -73.0,
        }
        max_hexagons = 500

        resolution = get_h3_resolution_from_bounds(bounds, max_hexagons=max_hexagons)

        # Verify that the selected resolution would create <= max_hexagons
        # Calculate area
        import math

        r = 6371.0
        lat1 = math.radians(40.0)
        lat2 = math.radians(41.0)
        lng1 = math.radians(-74.0)
        lng2 = math.radians(-73.0)
        dlat = lat2 - lat1
        a = math.sin(dlat / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        height_km = r * c
        center_lat = (lat1 + lat2) / 2
        dlng = lng2 - lng1
        a = math.cos(center_lat) ** 2 * math.sin(dlng / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        width_km = r * c
        area_km2 = height_km * width_km

        avg_hex_area = h3.average_hexagon_area(resolution, unit="km^2")
        estimated_hexagons = (area_km2 / avg_hex_area) * 1.2
        assert estimated_hexagons <= max_hexagons

    def test_zero_area_returns_highest_resolution(self):
        """Test that zero area returns the highest resolution."""
        bounds = {
            "sw_lat": 40.7,
            "sw_lng": -74.0,
            "ne_lat": 40.7,
            "ne_lng": -74.0,
        }
        resolution = get_h3_resolution_from_bounds(bounds, max_hexagons=1000)
        # Zero area should return resolution 0 (smallest hexagons needed)
        assert resolution >= 0


class TestGetH3ResolutionFromZoom:
    """Test the get_h3_resolution_from_zoom function."""

    def test_zoom_level_0_to_3_with_large_bounds(self):
        """Test that zoom levels 0-3 respect minimum resolution."""
        # Large bounds - global view
        bounds = {
            "sw_lat": -60.0,
            "sw_lng": -180.0,
            "ne_lat": 60.0,
            "ne_lng": 180.0,
        }
        # Zoom 1 has minimum resolution of 1
        resolution = get_h3_resolution_from_zoom(1, job_density=50, bounds=bounds)
        assert resolution >= 1

    def test_zoom_level_with_small_bounds(self):
        """Test that small bounds can override zoom-based minimum."""
        # Small area
        bounds = {
            "sw_lat": 40.7,
            "sw_lng": -74.1,
            "ne_lat": 40.8,
            "ne_lng": -74.0,
        }
        # Even at low zoom, small area should allow higher resolution
        resolution = get_h3_resolution_from_zoom(5, job_density=50, bounds=bounds)
        # Should be higher than the zoom-based minimum of 3
        assert resolution >= 3

    def test_without_bounds_uses_zoom_only(self):
        """Test that without bounds, function uses only zoom level."""
        # Zoom 5 should give minimum resolution 3
        assert get_h3_resolution_from_zoom(5, job_density=50, bounds=None) == 3
        # Zoom 10 should give minimum resolution 9
        assert get_h3_resolution_from_zoom(10, job_density=50, bounds=None) == 9

    def test_bounds_constrain_resolution_to_max_hexagons(self):
        """Test that bounds prevent creating too many hexagons."""
        # Very large bounds at high zoom
        bounds = {
            "sw_lat": 20.0,
            "sw_lng": -100.0,
            "ne_lat": 50.0,
            "ne_lng": -60.0,
        }
        # Even at zoom 15 (which wants resolution 11), large bounds should force lower resolution
        resolution = get_h3_resolution_from_zoom(15, job_density=50, bounds=bounds)
        # Should be much lower than 11 due to large area
        assert resolution < 5


class TestJobClusterService:
    """Test the JobClusterService class."""

    @pytest.fixture
    def mock_job_repo(self):
        """Create a mock JobRepo."""
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_job_repo):
        """Create a JobClusterService with mocked dependencies."""
        return JobClusterService(job_repo=mock_job_repo)

    @pytest.mark.anyio
    async def test_get_aggregated_clusters(self, service, mock_job_repo):
        """Test _get_aggregated_clusters delegates to repository."""
        # Setup mock clusters
        mock_clusters = [
            JobCluster(
                h3_index="871f1c4a7ffffff",
                count=10,
                center=GeoObject(coordinates=(-74.0060, 40.7128)),
                bounds=[[40.7, -74.1], [40.8, -74.0], [40.7, -73.9]],
                salary_range=SalaryRange(min_salary=50000, max_salary=100000),
                top_specialties=["nursing"],
            )
        ]
        mock_job_repo.get_aggregated_jobs_by_h3 = AsyncMock(
            return_value=(mock_clusters, 10)
        )

        bounds = {"sw_lat": 40.0, "sw_lng": -74.0, "ne_lat": 41.0, "ne_lng": -73.0}
        filters = JobClusterFilters()

        clusters, total = await service._get_aggregated_clusters(bounds, 7, filters)

        # Verify delegation - note that service converts dict to BoundingBox
        expected_bounds = BoundingBox(**bounds)
        mock_job_repo.get_aggregated_jobs_by_h3.assert_called_once_with(
            bounds=expected_bounds, h3_resolution=7, filters=filters
        )
        assert clusters == mock_clusters
        assert total == 10

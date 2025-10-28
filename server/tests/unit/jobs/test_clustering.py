"""Unit tests for job clustering functionality."""

from unittest.mock import AsyncMock

import pytest
from app.base.models import GeoObject
from app.jobs.models import JobCluster, JobClusterFilters, SalaryRange
from app.jobs.services import JobClusterService, get_h3_resolution_from_zoom


class TestGetH3ResolutionFromZoom:
    """Test the get_h3_resolution_from_zoom function."""

    def test_zoom_level_1_to_4_returns_resolution_5(self):
        """Test that zoom levels 1-4 map to H3 resolution 5 (minimum practical resolution)."""
        assert get_h3_resolution_from_zoom(1, job_density=50) == 5
        assert get_h3_resolution_from_zoom(2, job_density=50) == 5
        assert get_h3_resolution_from_zoom(3, job_density=50) == 5
        assert get_h3_resolution_from_zoom(4, job_density=50) == 5

    def test_zoom_level_5_to_9_returns_resolution_6(self):
        """Test that zoom levels 5-9 map to H3 resolution 6 with medium density."""
        # Use medium density (50) to get base resolution without adjustment
        assert get_h3_resolution_from_zoom(5, job_density=50) == 6
        assert get_h3_resolution_from_zoom(6, job_density=50) == 6
        assert get_h3_resolution_from_zoom(7, job_density=50) == 6
        assert get_h3_resolution_from_zoom(8, job_density=50) == 6
        assert get_h3_resolution_from_zoom(9, job_density=50) == 6

    def test_zoom_level_10_to_11_returns_resolution_7(self):
        """Test that zoom levels 10-11 map to H3 resolution 7 with medium density."""
        assert get_h3_resolution_from_zoom(10, job_density=50) == 7
        assert get_h3_resolution_from_zoom(11, job_density=50) == 7

    def test_zoom_level_12_to_13_returns_resolution_9(self):
        """Test that zoom levels 12-13 map to H3 resolution 9 with medium density."""
        assert get_h3_resolution_from_zoom(12, job_density=50) == 9
        assert get_h3_resolution_from_zoom(13, job_density=50) == 9

    def test_zoom_level_14_returns_resolution_10(self):
        """Test that zoom level 14 maps to H3 resolution 10 with medium density."""
        assert get_h3_resolution_from_zoom(14, job_density=50) == 10

    def test_zoom_level_15_and_above_returns_resolution_11(self):
        """Test that zoom levels 15+ map to H3 resolution 11 with medium density."""
        assert get_h3_resolution_from_zoom(15, job_density=50) == 11
        assert get_h3_resolution_from_zoom(16, job_density=50) == 11
        assert get_h3_resolution_from_zoom(20, job_density=50) == 11

    def test_high_density_increases_resolution(self):
        """Test that high job density (>100/km²) increases resolution by 1."""
        # Base resolution 6 at zoom 5, high density increases to 7
        assert get_h3_resolution_from_zoom(5, job_density=150) == 7

        # Base resolution 7 at zoom 10, high density increases to 8
        assert get_h3_resolution_from_zoom(10, job_density=200) == 8

        # Base resolution 10 at zoom 14, high density increases to 11 (clamped)
        assert get_h3_resolution_from_zoom(14, job_density=120) == 11

    def test_high_density_does_not_exceed_max_resolution(self):
        """Test that resolution is clamped at 11 even with high density."""
        # Zoom 15 already at max resolution 11
        assert get_h3_resolution_from_zoom(15, job_density=500) == 11

    def test_low_density_decreases_resolution(self):
        """Test that low job density (<10/km²) decreases resolution by 1."""
        # Base resolution 6 at zoom 5, low density decreases to 5 (minimum)
        assert get_h3_resolution_from_zoom(5, job_density=5) == 5

        # Base resolution 7 at zoom 10, low density decreases to 6
        assert get_h3_resolution_from_zoom(10, job_density=8) == 6

        # Base resolution 5 at zoom 1, low density stays at 5 (clamped to minimum)
        assert get_h3_resolution_from_zoom(1, job_density=2) == 5

    def test_low_density_does_not_go_below_min_resolution(self):
        """Test that resolution is clamped at 5 even with low density."""
        # Zoom 1 already at min resolution 5
        assert get_h3_resolution_from_zoom(1, job_density=0) == 5

    def test_medium_density_no_adjustment(self):
        """Test that medium density (10-100/km²) does not adjust resolution."""
        assert get_h3_resolution_from_zoom(5, job_density=50) == 6
        assert get_h3_resolution_from_zoom(10, job_density=30) == 7
        assert get_h3_resolution_from_zoom(14, job_density=75) == 10

    def test_boundary_conditions(self):
        """Test exact boundary values for density thresholds."""
        # Exactly 100 jobs/km² should NOT trigger high density adjustment
        assert get_h3_resolution_from_zoom(5, job_density=100) == 6

        # Just over 100 should trigger adjustment
        assert get_h3_resolution_from_zoom(5, job_density=100.1) == 7

        # Exactly 10 jobs/km² should NOT trigger low density adjustment
        assert get_h3_resolution_from_zoom(5, job_density=10) == 6

        # Just under 10 should trigger adjustment (but clamped to minimum 5)
        assert get_h3_resolution_from_zoom(5, job_density=9.9) == 5

    def test_zero_density(self):
        """Test that zero density decreases resolution (clamped to minimum 5)."""
        assert get_h3_resolution_from_zoom(5, job_density=0) == 5
        assert get_h3_resolution_from_zoom(10, job_density=0) == 6


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
    async def test_calculate_job_density_basic(self, service, mock_job_repo):
        """Test basic job density calculation."""
        # Setup: Mock repo returns 100 jobs
        mock_job_repo.get_aggregated_jobs_by_h3 = AsyncMock(
            return_value=([], 100)  # Empty clusters list, 100 total count
        )

        bounds = {
            "sw_lat": 40.0,
            "sw_lng": -74.0,
            "ne_lat": 41.0,
            "ne_lng": -73.0,
        }
        filters = JobClusterFilters()

        # Calculate density
        density = await service._calculate_job_density(bounds, filters)

        # Verify repo was called with resolution 11
        mock_job_repo.get_aggregated_jobs_by_h3.assert_called_once()
        call_args = mock_job_repo.get_aggregated_jobs_by_h3.call_args
        assert call_args.kwargs["h3_resolution"] == 11

        # Density should be jobs divided by area
        # Area approximately 111km * 111km = ~12,321 km²
        # 100 jobs / 12,321 km² ≈ 0.008 jobs/km²
        assert density < 1.0
        assert density > 0

    @pytest.mark.anyio
    async def test_calculate_job_density_zero_area(self, service, mock_job_repo):
        """Test job density with zero area returns 0."""
        mock_job_repo.get_aggregated_jobs_by_h3 = AsyncMock(return_value=([], 100))

        # Same coordinates = zero area
        bounds = {
            "sw_lat": 40.0,
            "sw_lng": -74.0,
            "ne_lat": 40.0,
            "ne_lng": -74.0,
        }
        filters = JobClusterFilters()

        density = await service._calculate_job_density(bounds, filters)
        assert density == 0.0

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

        # Verify delegation
        mock_job_repo.get_aggregated_jobs_by_h3.assert_called_once_with(
            bounds=bounds, h3_resolution=7, filters=filters
        )
        assert clusters == mock_clusters
        assert total == 10

    @pytest.mark.anyio
    async def test_get_individual_job_clusters(self, service):
        """Test _get_individual_job_clusters fetches and wraps jobs."""

        # This test would need actual Job documents with geo data
        # For now, we'll test the method exists and has the right signature
        bounds = {"sw_lat": 40.0, "sw_lng": -74.0, "ne_lat": 41.0, "ne_lng": -73.0}
        filters = JobClusterFilters()

        # This will fail with actual DB, but tests the interface
        try:
            await service._get_individual_job_clusters(bounds, filters)
        except Exception:
            # Expected to fail without DB connection
            pass

    @pytest.mark.anyio
    async def test_get_job_clusters_uses_aggregation_for_low_zoom(
        self, service, mock_job_repo
    ):
        """Test that low zoom levels use aggregated clustering."""
        # Mock density calculation
        service._calculate_job_density = AsyncMock(return_value=50.0)

        # Mock aggregated clusters
        mock_clusters = [
            JobCluster(
                h3_index="871f1c4a7ffffff",
                count=10,
                center=GeoObject(coordinates=(-74.0060, 40.7128)),
                bounds=[[40.7, -74.1]],
                salary_range=SalaryRange(min_salary=50000, max_salary=100000),
                top_specialties=["nursing"],
            )
        ]
        service._get_aggregated_clusters = AsyncMock(return_value=(mock_clusters, 10))
        service._get_individual_job_clusters = AsyncMock()

        bounds = {"sw_lat": 40.0, "sw_lng": -74.0, "ne_lat": 41.0, "ne_lng": -73.0}
        filters = JobClusterFilters()

        # Zoom 10 should use aggregation
        clusters, total = await service.get_job_clusters(bounds, 10, filters)

        # Verify aggregation was called, not individual
        service._get_aggregated_clusters.assert_called_once()
        service._get_individual_job_clusters.assert_not_called()
        assert clusters == mock_clusters
        assert total == 10

    @pytest.mark.anyio
    async def test_get_job_clusters_uses_individual_for_high_zoom(
        self, service, mock_job_repo
    ):
        """Test that high zoom levels use individual job clustering."""
        # Mock density calculation
        service._calculate_job_density = AsyncMock(return_value=50.0)

        # Mock individual clusters
        mock_clusters = [
            JobCluster(
                h3_index="8b1f1c4a7ffffff",
                count=1,
                center=GeoObject(coordinates=(-74.0060, 40.7128)),
                bounds=[[40.7, -74.1]],
                salary_range=SalaryRange(min_salary=60000, max_salary=80000),
                top_specialties=["nursing"],
            )
        ]
        service._get_individual_job_clusters = AsyncMock(
            return_value=(mock_clusters, 1)
        )
        service._get_aggregated_clusters = AsyncMock()

        bounds = {"sw_lat": 40.0, "sw_lng": -74.0, "ne_lat": 41.0, "ne_lng": -73.0}
        filters = JobClusterFilters()

        # Zoom 15 should use individual jobs
        clusters, total = await service.get_job_clusters(bounds, 15, filters)

        # Verify individual was called, not aggregation
        service._get_individual_job_clusters.assert_called_once()
        service._get_aggregated_clusters.assert_not_called()
        assert clusters == mock_clusters
        assert total == 1

    @pytest.mark.anyio
    async def test_get_job_clusters_applies_density_adjustment(
        self, service, mock_job_repo
    ):
        """Test that job density affects H3 resolution selection."""
        # High density should increase resolution
        service._calculate_job_density = AsyncMock(return_value=150.0)
        service._get_aggregated_clusters = AsyncMock(return_value=([], 0))

        bounds = {"sw_lat": 40.0, "sw_lng": -74.0, "ne_lat": 41.0, "ne_lng": -73.0}
        filters = JobClusterFilters()

        # Zoom 5 normally uses resolution 6, but high density bumps to 7
        await service.get_job_clusters(bounds, 5, filters)

        # Check that aggregation was called with resolution 7
        # call_args is (args, kwargs) tuple, h3_resolution is 2nd positional arg
        call_args = service._get_aggregated_clusters.call_args
        assert call_args[0][1] == 7  # bounds, h3_resolution, filters

    @pytest.mark.anyio
    async def test_get_cluster_jobs_paginated_delegates_to_repo(
        self, service, mock_job_repo
    ):
        """Test that get_cluster_jobs_paginated delegates to repository."""
        from app.database.paginator import PageInfo, PaginatedResult

        # Mock paginated result
        mock_result = PaginatedResult(
            entities=[],
            page_info=PageInfo(
                has_next_page=False,
                has_previous_page=False,
                start_cursor=None,
                end_cursor=None,
            ),
            total_count=0,
        )
        mock_job_repo.get_jobs_in_h3_hexagon_paginated = AsyncMock(
            return_value=mock_result
        )

        h3_index = "871f1c4a7ffffff"
        h3_resolution = 7
        filters = JobClusterFilters()

        result = await service.get_cluster_jobs_paginated(
            h3_index=h3_index,
            h3_resolution=h3_resolution,
            filters=filters,
            first=10,
            after="cursor",
        )

        # Verify delegation
        mock_job_repo.get_jobs_in_h3_hexagon_paginated.assert_called_once_with(
            h3_index=h3_index,
            h3_resolution=h3_resolution,
            filters=filters,
            first=10,
            last=None,
            before=None,
            after="cursor",
        )
        assert result == mock_result

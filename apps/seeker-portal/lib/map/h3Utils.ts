/**
 * H3 utilities for job clustering on map
 * Based on SCALABLE_MAP_CLUSTERING_PRD.md specifications
 */

export function getH3ResolutionFromZoom(zoomLevel: number): number | null {
	/**
	 * Map Leaflet zoom level to H3 resolution.
	 * Returns null if individual markers should be shown (zoom 15+).
	 *
	 * Based on PRD specifications:
	 * - Zoom 0-3: Resolution 1 (Country/Continent view, ~1000 km hexagons)
	 * - Zoom 4-5: Resolution 3 (State/Province view, ~100 km hexagons)
	 * - Zoom 6-7: Resolution 5 (City view, ~20 km hexagons)
	 * - Zoom 8-9: Resolution 7 (Neighborhood view, ~5 km hexagons)
	 * - Zoom 10-11: Resolution 9 (District view, ~1 km hexagons)
	 * - Zoom 12: Resolution 10 (Street view, ~500 m hexagons)
	 * - Zoom 13-14: Resolution 11 (Block view, ~250 m hexagons)
	 * - Zoom 15+: Individual markers
	 *
	 * This prevents creating 100k+ hexagon intersections at low zoom levels.
	 * NO density-based adjustments - pure zoom-level mapping only.
	 */

	let resolution: number | null;

	// Base resolution mapping - exact mapping from PRD, no adjustments
	if (zoomLevel <= 3) {
		resolution = 1;
	} else if (zoomLevel <= 5) {
		resolution = 3;
	} else if (zoomLevel <= 7) {
		resolution = 5;
	} else if (zoomLevel <= 9) {
		resolution = 7;
	} else if (zoomLevel <= 11) {
		resolution = 9;
	} else if (zoomLevel === 12) {
		resolution = 10;
	} else if (zoomLevel <= 14) {
		resolution = 11;
	} else {
		resolution = null; // Individual markers for zoom 15+
	}

	console.log('🔢 Frontend H3 Resolution Calculation:', {
		zoomLevel,
		calculatedResolution: resolution,
		mapping: resolution !== null ? `Zoom ${zoomLevel} → Resolution ${resolution}` : `Zoom ${zoomLevel} → Individual markers`
	});

	return resolution;
}

export function shouldShowClusters(zoomLevel: number, _totalJobs: number, _viewportArea: number): boolean {
	/**
	 * Determine if clusters should be shown based on zoom and density.
	 * Returns true for clustering, false for individual markers.
	 */
	// Always show clusters at low zoom levels (0-12) - users expect to see aggregated data
	// Only switch to individual markers at high zoom (13+)
	if (zoomLevel < 13) {
		return true;
	}

	// At zoom 13+, show individual markers
	return false;
}

/**
 * Get color for cluster based on job count.
 * Uses HeroUI primary color shades - lighter for smaller clusters, darker for larger.
 */
export function getClusterColor(count: number): string {
	// HeroUI primary colors from lightest to darkest based on cluster size
	if (count < 5) return 'hsl(var(--heroui-primary-300))'; // Smallest clusters - primary-300
	if (count < 10) return 'hsl(var(--heroui-primary-400))'; // Small clusters - primary-400
	if (count < 25) return 'hsl(var(--heroui-primary-500))'; // Medium clusters - primary-500
	if (count < 50) return 'hsl(var(--heroui-primary-600))'; // Medium-large clusters - primary-600
	if (count < 100) return 'hsl(var(--heroui-primary-700))'; // Large clusters - primary-700
	return 'hsl(var(--heroui-primary-800))'; // Largest clusters - primary-800
}

/**
 * Calculate viewport area in square kilometers (approximate).
 * Used for density calculations.
 */
export function calculateViewportArea(bounds: { swLat: number; swLng: number; neLat: number; neLng: number }): number {
	// Rough approximation - good enough for density calculation
	const latDiff = bounds.neLat - bounds.swLat;
	const lngDiff = bounds.neLng - bounds.swLng;

	// Convert degrees to approximate km (1 degree ≈ 111 km at equator)
	const latKm = latDiff * 111;
	const lngKm = lngDiff * 111 * Math.cos((((bounds.swLat + bounds.neLat) / 2) * Math.PI) / 180);

	return Math.abs(latKm * lngKm);
}

/**
 * H3 utilities for job clustering on map
 * Based on SCALABLE_MAP_CLUSTERING_PRD.md specifications
 */

export function getH3ResolutionFromZoom(zoomLevel: number, jobDensity: number | null = null): number | null {
	/**
	 * Map Leaflet zoom level to H3 resolution, adjustable by density.
	 * Returns null if individual markers should be shown (zoom 15+).
	 */

	let baseRes: number | null = null;

	// Base resolution mapping - exact mapping from PRD
	if (zoomLevel <= 3) {
		baseRes = 1;
	} else if (zoomLevel <= 5) {
		baseRes = 3;
	} else if (zoomLevel <= 7) {
		baseRes = 5;
	} else if (zoomLevel <= 9) {
		baseRes = 7;
	} else if (zoomLevel <= 11) {
		baseRes = 9;
	} else if (zoomLevel === 12) {
		baseRes = 10;
	} else if (zoomLevel <= 14) {
		baseRes = 11;
	} else {
		return null; // Individual markers for zoom 15+
	}

	// Adjust for density (jobs per km²) as specified in PRD
	if (jobDensity !== null) {
		if (jobDensity > 100) {
			// High density: finer resolution
			return Math.min(11, baseRes + 1);
		}
		if (jobDensity < 10) {
			// Low density: coarser resolution
			return Math.max(1, baseRes - 1);
		}
	}

	return baseRes;
}

export function shouldShowClusters(zoomLevel: number, totalJobs: number, viewportArea: number): boolean {
	/**
	 * Determine if clusters should be shown based on zoom and density.
	 * Returns true for clustering, false for individual markers.
	 */
	const density = totalJobs / viewportArea;
	return zoomLevel < 15 || totalJobs > 500 || density > 0.1;
}

/**
 * Get color for cluster based on job count.
 * Color scheme as specified in PRD.
 */
export function getClusterColor(count: number): string {
	if (count < 10) return '#10b981'; // green
	if (count < 50) return '#f59e0b'; // amber
	if (count < 100) return '#f97316'; // orange
	return '#ef4444'; // red
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

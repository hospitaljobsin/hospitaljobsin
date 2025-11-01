'use client';

import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { getClusterColor } from '@/lib/map/h3Utils';

interface JobCluster {
	h3Index: string;
	count: number;
	center: { coordinates: [number, number] };
	bounds: Array<[number, number]>;
	salaryRange: { minSalary?: number; maxSalary?: number };
	topSpecialties: string[];
}

interface JobHexagonClustersProps {
	clusters: JobCluster[];
	onClusterClick: (h3Index: string, cluster: JobCluster) => void;
	onClusterHover?: (cluster: JobCluster | null) => void;
}

/**
 * JobHexagonClusters Component
 *
 * Renders H3 hexagon clusters using Leaflet Canvas renderer for performance.
 * Uses Canvas renderer instead of deprecated PIXI overlay as specified in PRD.
 */
export default function JobHexagonClusters({ clusters, onClusterClick, onClusterHover }: JobHexagonClustersProps) {
	const map = useMap();
	const canvasLayerRef = useRef<L.Canvas | null>(null);
	const hexagonsRef = useRef<Map<string, L.Polygon>>(new Map());
	const lastClusterIdsRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		// Early return if map is not ready or no container exists
		if (!map || !map.getContainer()) {
			console.log('JobHexagonClusters: Map not ready, skipping initialization');
			return;
		}

		// Safety guard: ensure clusters is an array
		if (!Array.isArray(clusters)) {
			console.warn('JobHexagonClusters: clusters is not an array:', typeof clusters, clusters);
			return;
		}

		// Check if clusters actually changed by comparing h3Index sets
		const currentClusterIds = new Set(clusters.map(c => c.h3Index));
		const hasChanged =
			currentClusterIds.size !== lastClusterIdsRef.current.size || [...currentClusterIds].some(id => !lastClusterIdsRef.current.has(id));

		if (!hasChanged && hexagonsRef.current.size > 0) {
			// Clusters haven't changed, skip re-rendering
			console.log('JobHexagonClusters: Clusters unchanged, skipping re-render');
			return;
		}

		// Update the last clusters reference
		lastClusterIdsRef.current = currentClusterIds;

		console.log(`JobHexagonClusters: Rendering ${clusters.length} clusters`);

		// Create canvas renderer if not exists
		if (!canvasLayerRef.current) {
			canvasLayerRef.current = L.canvas();
		}

		const canvas = canvasLayerRef.current;

		// Clear existing hexagons
		for (const hex of hexagonsRef.current.values()) {
			hex.remove();
		}
		hexagonsRef.current.clear();

		// Render new hexagons with accessibility enhancements
		clusters.forEach(cluster => {
			const color = getClusterColor(cluster.count);

			// Convert bounds to LatLng format
			// IMPORTANT: GeoJSON format is [lng, lat], but Leaflet expects [lat, lng]
			const latLngs = cluster.bounds.map(([lng, lat]) => L.latLng(lat, lng));

			console.log(`Adding hexagon for cluster ${cluster.h3Index}:`, {
				count: cluster.count,
				color,
				boundsCount: latLngs.length,
				firstBound: latLngs[0],
				originalBound: cluster.bounds[0]
			});

			// Create polygon for hexagon with sleek, minimalistic styling
			const hexagon = L.polygon(latLngs, {
				color: color,
				fillColor: color,
				fillOpacity: 0.5, // Increased from 0.25 for better visibility
				weight: 3, // Increased from 2 for better visibility
				opacity: 1.0, // Increased from 0.7 for better visibility
				renderer: canvas,
				pane: 'overlayPane' // Ensure hexagons render above tiles
			});

			// Add accessibility and interactivity
			const element = hexagon.getElement() as HTMLElement;
			if (element) {
				element.setAttribute('role', 'button');
				element.setAttribute('tabindex', '0');
				element.setAttribute(
					'aria-label',
					`Job cluster with ${cluster.count} jobs. Salary range: ₹${cluster.salaryRange.minSalary || 'N/A'} - ₹${cluster.salaryRange.maxSalary || 'N/A'}. Click to zoom in.`
				);
				element.style.cursor = 'pointer';

				// Keyboard navigation
				element.addEventListener('keydown', (e: KeyboardEvent) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						onClusterClick(cluster.h3Index, cluster);
					}
				});

				// Focus states
				element.addEventListener('focus', () => {
					hexagon.setStyle({ fillOpacity: 0.45, weight: 3, opacity: 1 });
					onClusterHover?.(cluster);
				});

				element.addEventListener('blur', () => {
					hexagon.setStyle({ fillOpacity: 0.25, weight: 2, opacity: 0.7 });
					onClusterHover?.(null);
				});
			}

			// Mouse interactions
			hexagon.on('click', () => {
				onClusterClick(cluster.h3Index, cluster);
			});

			hexagon.on('mouseover', () => {
				hexagon.setStyle({ fillOpacity: 0.45, weight: 3, opacity: 1 });
				onClusterHover?.(cluster);
			});

			hexagon.on('mouseout', () => {
				hexagon.setStyle({ fillOpacity: 0.25, weight: 2, opacity: 0.7 });
				onClusterHover?.(null);
			});

			// Add to map with safety check
			if (map?.getContainer()) {
				try {
					hexagon.addTo(map);
					console.log(`✅ Successfully added hexagon ${cluster.h3Index} to map`);
				} catch (error) {
					console.warn('Error adding hexagon to map:', error);
				}
			}

			// Store reference
			hexagonsRef.current.set(cluster.h3Index, hexagon);
		});

		console.log(`📍 Total hexagons on map: ${hexagonsRef.current.size}`);

		// Cleanup
		return () => {
			console.log('🧹 Cleanup function called - this should only happen when component unmounts or clusters change');
			if (map?.getContainer()) {
				try {
					for (const hex of hexagonsRef.current.values()) {
						hex.remove();
					}
					hexagonsRef.current.clear();
					console.log('Hexagon clusters successfully cleaned up');
				} catch (error) {
					console.warn('Error cleaning up hexagon clusters:', error);
				}
			}
		};
	}, [clusters, map, onClusterClick, onClusterHover]);

	return null; // Canvas handles rendering
}

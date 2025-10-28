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

	useEffect(() => {
		// Create canvas renderer if not exists
		if (!canvasLayerRef.current) {
			canvasLayerRef.current = L.canvas();
		}

		const canvas = canvasLayerRef.current;

		// Clear existing hexagons
		hexagonsRef.current.forEach(hex => hex.remove());
		hexagonsRef.current.clear();

		// Render new hexagons with accessibility enhancements
		clusters.forEach(cluster => {
			const color = getClusterColor(cluster.count);

			// Convert bounds to LatLng format
			const latLngs = cluster.bounds.map(([lat, lng]) => L.latLng(lat, lng));

			// Create polygon for hexagon with accessibility attributes
			const hexagon = L.polygon(latLngs, {
				color: color,
				fillColor: color,
				fillOpacity: 0.4,
				weight: 2,
				renderer: canvas
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
					hexagon.setStyle({ fillOpacity: 0.6, weight: 3 });
					onClusterHover?.(cluster);
				});

				element.addEventListener('blur', () => {
					hexagon.setStyle({ fillOpacity: 0.4, weight: 2 });
					onClusterHover?.(null);
				});
			}

			// Mouse interactions
			hexagon.on('click', () => {
				onClusterClick(cluster.h3Index, cluster);
			});

			hexagon.on('mouseover', () => {
				hexagon.setStyle({ fillOpacity: 0.6 });
				onClusterHover?.(cluster);
			});

			hexagon.on('mouseout', () => {
				hexagon.setStyle({ fillOpacity: 0.4 });
				onClusterHover?.(null);
			});

			// Add to map
			hexagon.addTo(map);

			// Store reference
			hexagonsRef.current.set(cluster.h3Index, hexagon);
		});

		// Cleanup
		return () => {
			hexagonsRef.current.forEach(hex => {
				hex.remove();
			});
			hexagonsRef.current.clear();
		};
	}, [clusters, map, onClusterClick, onClusterHover]);

	return null; // Canvas handles rendering
}

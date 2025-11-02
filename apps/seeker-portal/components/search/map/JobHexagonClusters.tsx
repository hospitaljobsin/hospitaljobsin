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
 * Renders pre-clustered job data as circle markers with smooth animations.
 * The clustering is already done on the backend via H3 hexagonal indexing.
 */
export default function JobHexagonClusters({ clusters, onClusterClick, onClusterHover }: JobHexagonClustersProps) {
	const map = useMap();
	const markersRef = useRef<Map<string, L.Marker>>(new Map());
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

		console.log(`JobHexagonClusters: Processing ${clusters.length} clusters`);

		// Get current cluster IDs
		const currentClusterIds = new Set(clusters.map(c => c.h3Index));
		const previousClusterIds = lastClusterIdsRef.current;

		// Find clusters to add, remove, and keep
		const toAdd = clusters.filter(c => !previousClusterIds.has(c.h3Index));
		const toRemove = Array.from(previousClusterIds).filter(id => !currentClusterIds.has(id));
		const toKeep = clusters.filter(c => previousClusterIds.has(c.h3Index));

		console.log(`📊 Cluster changes: +${toAdd.length} new, -${toRemove.length} removed, ${toKeep.length} kept`);

		// Remove old markers with fade-out animation
		toRemove.forEach(h3Index => {
			const marker = markersRef.current.get(h3Index);
			if (marker) {
				const element = marker.getElement();
				if (element) {
					const div = element.querySelector('div') as HTMLElement;
					if (div) {
						// Fade out animation
						div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
						div.style.opacity = '0';
						div.style.transform = 'scale(0.5)';
					}
				}

				// Remove after animation completes
				setTimeout(() => {
					marker.remove();
					markersRef.current.delete(h3Index);
				}, 300);
			}
		});

		// Update existing markers (smooth position transitions)
		toKeep.forEach(cluster => {
			const marker = markersRef.current.get(cluster.h3Index);
			if (marker) {
				const [lng, lat] = cluster.center.coordinates;
				const newLatLng = L.latLng(lat, lng);

				// Leaflet handles smooth position transitions automatically
				marker.setLatLng(newLatLng);

				// Update count if changed
				const element = marker.getElement();
				if (element) {
					const div = element.querySelector('div') as HTMLElement;
					if (div && div.textContent !== cluster.count.toString()) {
						div.textContent = cluster.count.toString();
						// Pulse animation on count change
						div.style.animation = 'pulse 0.3s ease';
						setTimeout(() => {
							div.style.animation = '';
						}, 300);
					}
				}
			} else {
				// Marker doesn't exist but should be kept - add it to the toAdd list
				// This handles the case where a marker was removed but the cluster reappeared
				console.log(`⚠️ Cluster ${cluster.h3Index} marked as 'kept' but marker doesn't exist - adding it`);
				toAdd.push(cluster);
			}
		});

		// Add new markers with fade-in animation
		toAdd.forEach(cluster => {
			const color = getClusterColor(cluster.count);

			// Convert center coordinates from GeoJSON [lng, lat] to Leaflet [lat, lng]
			const [lng, lat] = cluster.center.coordinates;
			const centerLatLng = L.latLng(lat, lng);

			// Calculate radius based on count (reduced size)
			const radius = Math.min(40, Math.max(18, 18 + Math.log(cluster.count) * 4));

			// Create a custom divIcon marker
			const marker = L.marker(centerLatLng, {
				icon: L.divIcon({
					html: `<div style="
						width: ${radius * 2}px;
						height: ${radius * 2}px;
						background-color: ${color};
						border: 3px solid white;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						color: white;
						font-weight: bold;
						font-size: ${radius > 28 ? '16px' : '14px'};
						box-shadow: 0 2px 8px rgba(0,0,0,0.3);
						transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
						cursor: pointer;
						opacity: 0;
						transform: scale(0.5);
					">${cluster.count}</div>`,
					className: 'custom-cluster-marker',
					iconSize: L.point(radius * 2, radius * 2),
					iconAnchor: L.point(radius, radius)
				})
			});

			// Add click handler
			marker.on('click', () => {
				onClusterClick(cluster.h3Index, cluster);
			});

			// Add hover handlers with smooth scale effect
			marker.on('mouseover', () => {
				const element = marker.getElement();
				if (element) {
					const div = element.querySelector('div') as HTMLElement;
					if (div) {
						div.style.transform = 'scale(1.15)';
						div.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
					}
				}
				onClusterHover?.(cluster);
			});

			marker.on('mouseout', () => {
				const element = marker.getElement();
				if (element) {
					const div = element.querySelector('div') as HTMLElement;
					if (div) {
						div.style.transform = 'scale(1)';
						div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
					}
				}
				onClusterHover?.(null);
			});

			// Add to map
			marker.addTo(map);

			// Trigger fade-in animation after a brief delay
			requestAnimationFrame(() => {
				const element = marker.getElement();
				if (element) {
					const div = element.querySelector('div') as HTMLElement;
					if (div) {
						div.style.opacity = '1';
						div.style.transform = 'scale(1)';
					}
				}
			});

			// Add accessibility attributes
			const element = marker.getElement();
			if (element) {
				element.setAttribute('role', 'button');
				element.setAttribute('tabindex', '0');
				element.setAttribute('aria-label', `Job cluster with ${cluster.count} jobs. Click to zoom in.`);
			}

			// Store reference
			markersRef.current.set(cluster.h3Index, marker);
		});

		// Update the last clusters reference
		lastClusterIdsRef.current = currentClusterIds;

		console.log(`📍 Total markers on map: ${markersRef.current.size}`);
	}, [clusters, map, onClusterClick, onClusterHover]);

	// Cleanup effect - only runs on unmount
	useEffect(() => {
		return () => {
			console.log('🧹 Component unmounting - removing all markers');
			for (const marker of markersRef.current.values()) {
				marker.remove();
			}
			markersRef.current.clear();
		};
	}, []);

	return null;
}

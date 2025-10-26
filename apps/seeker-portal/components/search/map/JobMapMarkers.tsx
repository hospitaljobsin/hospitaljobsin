'use client';

import L from 'leaflet';
import { Cross, Hospital, MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { useMap } from 'react-leaflet';
import { graphql } from 'react-relay';
import 'leaflet.markercluster';
import type { MapViewClientComponentFragment$data } from '@/__generated__/MapViewClientComponentFragment.graphql';

// Fix Leaflet default marker icon issue
// biome-ignore lint/suspicious/noExplicitAny: Leaflet internal API requires any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

interface JobMapMarkersProps {
	data: unknown;
	onJobClick: (jobId: string) => void;
	selectedJobId: string | null;
}

export default function JobMapMarkers({ data, onJobClick }: JobMapMarkersProps) {
	const map = useMap();

	// Track whether we've already fit bounds on initial load
	const hasFitBoundsRef = useRef(false);

	// Parse the data - in production, this will be properly typed through fragments
	const mapData = data as MapViewClientComponentFragment$data;
	const jobs = mapData?.jobs?.edges?.map(edge => edge.node).filter(job => job) || [];

	// Debug logging

	console.log(jobs);
	if (jobs.length > 0) {
		console.log('JobMapMarkers - Sample job:', jobs[0]);
		console.log('JobMapMarkers - All jobs:', jobs);
	}

	useEffect(() => {
		console.log('JobMapMarkers useEffect - Running with', jobs.length, 'jobs');

		// Get HeroUI primary color from CSS variables
		const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--heroui-primary').trim();
		const primaryHsl = primaryColor ? `hsl(${primaryColor})` : '#0ea5e9';

		// Render Lucide icons to SVG strings
		const crossIconSvg = renderToString(<Cross className='w-6 h-6' strokeWidth={2.5} />);
		const hospitalIconSvg = renderToString(<Hospital className='w-4 h-4' />);
		const mapPinIconSvg = renderToString(<MapPin className='w-4 h-4' />);

		// Create healthcare-themed marker icon with medical cross
		const healthcareIcon = L.divIcon({
			className: 'custom-healthcare-marker',
			html: `
				<div style="
					width: 48px;
					height: 48px;
					background: ${primaryHsl};
					border: 3px solid white;
					border-radius: 12px;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0,0,0,0.1);
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					transform: rotate(45deg);
				">
					<div style="
						position: absolute;
						color: white;
						transform: rotate(-45deg);
						filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
					">${crossIconSvg}</div>
				</div>
				<div style="
					position: absolute;
					bottom: -8px;
					left: 50%;
					transform: translateX(-50%);
					width: 0;
					height: 0;
					border-left: 8px solid transparent;
					border-right: 8px solid transparent;
					border-top: 12px solid white;
				"></div>
			`,
			iconSize: [48, 60],
			iconAnchor: [24, 60],
			popupAnchor: [0, -60]
		});

		// Create marker cluster group with healthcare-themed cluster icons
		const markers = L.markerClusterGroup({
			chunkedLoading: true,
			spiderfyOnMaxZoom: true,
			showCoverageOnHover: false,
			zoomToBoundsOnClick: true,
			maxClusterRadius: 80,
			iconCreateFunction: cluster => {
				const childCount = cluster.getChildCount();
				return L.divIcon({
					html: `
						<div style="
							width: 64px;
							height: 64px;
							background: ${primaryHsl};
							border: 4px solid white;
							border-radius: 50%;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							font-weight: bold;
							color: white;
							box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0,0,0,0.1);
						">
							<div style="width: 20px; height: 20px; color: white;">${crossIconSvg}</div>
							<div style="font-size: 16px; line-height: 1; margin-top: 2px;">${childCount}</div>
						</div>
					`,
					className: 'custom-cluster-icon',
					iconSize: [64, 64]
				});
			}
		});

		let markerCount = 0;

		// Add markers for each job
		// biome-ignore lint/suspicious/noExplicitAny: GraphQL fragment types not yet generated
		jobs.forEach((job: any) => {
			if (!job.geo?.coordinates) {
				console.log('Job missing geo:', job.id, job.title);
				return;
			}

			const [lng, lat] = job.geo.coordinates;
			console.log('Creating marker for:', job.title, 'at [lat, lng]:', lat, lng);

			// Validate coordinates
			if (Number.isNaN(lat) || Number.isNaN(lng)) {
				console.error('Invalid coordinates for job:', job.title, lat, lng);
				return;
			}

			const marker = L.marker([lat, lng], {
				title: job.title || '',
				icon: healthcareIcon
			});
			markerCount++;

			marker.bindPopup(`
				<div style="min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
					<div style="
						background: ${primaryHsl};
						color: white;
						padding: 12px 16px;
						margin: -12px -16px 12px -16px;
						border-radius: 8px 8px 0 0;
						display: flex;
						align-items: center;
						gap: 8px;
					">
						<div style="width: 20px; height: 20px; flex-shrink: 0;">${crossIconSvg}</div>
						<h3 style="font-weight: 600; margin: 0; font-size: 16px; line-height: 1.3;">${job.title || 'Healthcare Job'}</h3>
					</div>
					<div style="padding: 4px 0;">
						<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: hsl(var(--heroui-default-600));">
							<div style="width: 16px; height: 16px; flex-shrink: 0; color: hsl(var(--heroui-default-500));">${hospitalIconSvg}</div>
							<p style="margin: 0; font-size: 14px; font-weight: 500; color: hsl(var(--heroui-foreground-700));">${job.organization?.name || 'Healthcare Facility'}</p>
						</div>
						<div style="display: flex; align-items: center; gap: 8px; color: hsl(var(--heroui-default-600));">
							<div style="width: 16px; height: 16px; flex-shrink: 0; color: hsl(var(--heroui-default-500));">${mapPinIconSvg}</div>
							<p style="margin: 0; font-size: 13px; color: hsl(var(--heroui-default-600));">${job.location || 'Location not specified'}</p>
						</div>
					</div>
					<button
						data-job-id="${job.id}"
						style="
							background: ${primaryHsl};
							color: white;
							padding: 10px 16px;
							border-radius: 8px;
							border: none;
							cursor: pointer;
							margin-top: 12px;
							width: 100%;
							font-weight: 600;
							font-size: 14px;
							box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
							transition: transform 0.2s, box-shadow 0.2s;
						"
						onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)';"
						onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.1)';"
					>
						View Job Details →
					</button>
				</div>
			`);

			// Handle popup click events
			marker.on('popupopen', () => {
				const popup = marker.getPopup();
				if (popup) {
					const popupElement = popup.getElement();
					const button = popupElement?.querySelector('button[data-job-id]');
					if (button) {
						button.addEventListener('click', () => {
							const jobId = button.getAttribute('data-job-id');
							if (jobId) {
								onJobClick(jobId);
							}
						});
					}
				}
			});

			markers.addLayer(marker);
		});

		console.log('Total markers created:', markerCount);
		console.log('Marker cluster bounds valid:', markers.getBounds().isValid());

		map.addLayer(markers);
		console.log('Marker cluster added to map');

		// Fit map to markers only on initial load (not on every data change)
		if (!hasFitBoundsRef.current && jobs.length > 0 && markers.getBounds().isValid()) {
			const bounds = markers.getBounds();
			console.log('Fitting map to bounds (initial load):', bounds);
			map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
			hasFitBoundsRef.current = true;
		}

		return () => {
			console.log('Cleaning up markers');
			map.removeLayer(markers);
		};
	}, [jobs, map, onJobClick]);

	return null;
}

// Export the fragment for use in parent components
export const JobMapMarkersFragment = graphql`
	fragment JobMapMarkersFragment_job on Job {
		id
		slug
		title
		location
		geo {
			coordinates
		}
		minSalary
		maxSalary
		currency
		type
		workMode
		organization {
			id
			slug
			name
			logoUrl
		}
	}
`;

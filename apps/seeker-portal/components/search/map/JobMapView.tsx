'use client';

import { useDisclosure } from '@heroui/react';
import type { Map as LeafletMap } from 'leaflet';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SearchLocation } from '@/components/forms/LocationAutocomplete';

// Dynamic imports for Leaflet components (SSR incompatible)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const JobMapMarkers = dynamic(() => import('./JobMapMarkers'), { ssr: false });
const JobMapControls = dynamic(() => import('./JobMapControls'), { ssr: false });
const JobPreviewDrawer = dynamic(() => import('./JobPreviewDrawer'), { ssr: false });
const MapFilterSidebar = dynamic(() => import('./MapFilterSidebar'), { ssr: false });
const FilterBottomSheet = dynamic(() => import('./FilterSheet'), { ssr: false });

// Helper function to normalize longitude to -180 to 180 range
function normalizeLongitude(lng: number): number {
	// Normalize longitude to -180 to 180 range
	let normalized = lng;
	while (normalized > 180) normalized -= 360;
	while (normalized < -180) normalized += 360;
	return normalized;
}

// Helper function to clamp latitude to -90 to 90 range
function clampLatitude(lat: number): number {
	return Math.max(-90, Math.min(90, lat));
}

// Helper function to validate and fix bounding box
function normalizeBounds(bounds: { swLat: number; swLng: number; neLat: number; neLng: number }) {
	// Normalize coordinates to valid ranges
	const swLat = clampLatitude(bounds.swLat);
	const swLng = normalizeLongitude(bounds.swLng);
	const neLat = clampLatitude(bounds.neLat);
	const neLng = normalizeLongitude(bounds.neLng);

	// Ensure southwest is actually southwest (bottom-left) and northeast is actually northeast (top-right)
	// MongoDB requires: bottomLeft.latitude < topRight.latitude
	const minLat = Math.min(swLat, neLat);
	const maxLat = Math.max(swLat, neLat);
	const minLng = Math.min(swLng, neLng);
	const maxLng = Math.max(swLng, neLng);

	return {
		swLat: minLat, // Bottom latitude (south)
		swLng: minLng, // Left longitude (west)
		neLat: maxLat, // Top latitude (north)
		neLng: maxLng // Right longitude (east)
	};
}

interface JobMapViewProps {
	data: unknown; // Fragment data passed from parent
	filters: {
		searchTerm: string | null;
		location: string | null;
		minExperience: number | null;
		minSalary: number | null;
		maxSalary: number | null;
		proximityKm: number;
		workMode: readonly string[];
		jobType: readonly string[];
		sortBy: string;
	};
	onBoundsChange?: (bounds: { swLat: number; swLng: number; neLat: number; neLng: number }) => void;
	onFiltersChange?: (filters: Partial<JobMapViewProps['filters']>) => void;
	onLocationSelect?: (location: SearchLocation) => void;
	isPending?: boolean;
}

export default function JobMapView({
	data,
	filters,
	onBoundsChange,
	onFiltersChange,
	onLocationSelect,
	isPending = false
}: JobMapViewProps) {
	const [map, setMap] = useState<LeafletMap | null>(null);
	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [lastBounds, setLastBounds] = useState<{ swLat: number; swLng: number; neLat: number; neLng: number } | null>(null);
	const [announcementMessage, setAnnouncementMessage] = useState<string>('');
	const [isMounted, setIsMounted] = useState(false);

	// Drawer state for mobile job preview
	const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

	// Handle location selection and zoom to it
	const handleLocationSelect = useCallback(
		(location: SearchLocation) => {
			if (!map) return;

			// Determine zoom level based on region level
			let zoomLevel = 12; // Default for locality
			switch (location.level.toLowerCase()) {
				case 'continent':
					zoomLevel = 3;
					break;
				case 'country':
					zoomLevel = 5;
					break;
				case 'state':
					zoomLevel = 7;
					break;
				case 'locality':
					zoomLevel = 11;
					break;
				case 'neighbourhood':
					zoomLevel = 13;
					break;
				case 'city':
					zoomLevel = 10;
					break;
			}

			// Fly to the location with smooth animation
			map.flyTo([location.latitude, location.longitude], zoomLevel, {
				duration: 1.5 // Animation duration in seconds
			});

			setAnnouncementMessage(`Zoomed to ${location.address.displayName}`);
		},
		[map]
	);

	// Ensure component only renders on client
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Detect mobile and tablet breakpoints
	useEffect(() => {
		const checkMobile = () => {
			const width = window.innerWidth;
			setIsMobile(width < 1024); // lg breakpoint
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Invalidate map size when map is ready or when layout changes (fixes tile loading issue)
	useEffect(() => {
		if (!map) return;

		// Invalidate size when map loads or when mobile state changes (sidebar toggle)
		const timeoutId1 = setTimeout(() => {
			map.invalidateSize();
		}, 100);

		// Force another invalidation after a longer delay to ensure full map load
		const timeoutId2 = setTimeout(() => {
			map.invalidateSize();
		}, 500);

		// Also invalidate on window resize to handle dynamic layout changes
		const handleResize = () => {
			map.invalidateSize();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			clearTimeout(timeoutId1);
			clearTimeout(timeoutId2);
			window.removeEventListener('resize', handleResize);
		};
	}, [map, isMobile]); // Re-run when isMobile changes (sidebar toggle)

	// Track bounds changes with debouncing
	useEffect(() => {
		if (!map || !onBoundsChange) return;

		let timeoutId: NodeJS.Timeout;

		const handleMapMove = () => {
			// Debounce bounds changes (800ms) - increased to prevent overwhelming backend
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				const bounds = map.getBounds();
				const sw = bounds.getSouthWest();
				const ne = bounds.getNorthEast();

				// Create bounds object and normalize coordinates to valid ranges
				const rawBounds = {
					swLat: sw.lat,
					swLng: sw.lng,
					neLat: ne.lat,
					neLng: ne.lng
				};

				// Normalize bounds to ensure valid lat/lng ranges for MongoDB
				const newBounds = normalizeBounds(rawBounds);

				// Only trigger refetch if bounds changed significantly (>0.001 degrees ~110m)
				if (lastBounds) {
					const latDiff = Math.abs(newBounds.swLat - lastBounds.swLat) + Math.abs(newBounds.neLat - lastBounds.neLat);
					const lngDiff = Math.abs(newBounds.swLng - lastBounds.swLng) + Math.abs(newBounds.neLng - lastBounds.neLng);

					if (latDiff < 0.002 && lngDiff < 0.002) {
						return; // Skip refetch for minor movements
					}
				}

				setLastBounds(newBounds);
				onBoundsChange(newBounds);
			}, 800);
		};

		map.on('moveend', handleMapMove);

		return () => {
			map.off('moveend', handleMapMove);
			clearTimeout(timeoutId);
		};
	}, [map, onBoundsChange, lastBounds]);

	// Handle job marker click
	const handleJobClick = useCallback(
		(jobId: string) => {
			setSelectedJobId(jobId);
			const job = (data as any)?.jobs?.edges?.find((edge: any) => edge.node.id === jobId)?.node;
			if (job) {
				setAnnouncementMessage(`Selected job: ${job.title || 'Job'} at ${job.organization?.name || 'Unknown organization'}`);
			}
			if (isMobile) {
				onDrawerOpen();
			}
		},
		[isMobile, onDrawerOpen, data]
	);

	// Handle drawer close
	const handleDrawerClose = useCallback(() => {
		onDrawerClose();
		setSelectedJobId(null);
	}, [onDrawerClose]);

	// Default center (India)
	const defaultCenter: [number, number] = [20.5937, 78.9629];
	const defaultZoom = 5;

	// Set max bounds to prevent wrapping around the world multiple times
	// This helps prevent invalid longitude values
	const worldBounds: [[number, number], [number, number]] = [
		[-90, -180], // Southwest corner
		[90, 180] // Northeast corner
	];

	// Zoom constraints to prevent ugly extreme zoom levels
	const minZoom = 3; // Prevent zooming out too far (vertical strip issue)
	const maxZoom = 18; // Standard max zoom for street-level detail

	// Count active filters for badge (memoized for performance)
	const activeFilterCount = useMemo(
		() =>
			(filters.searchTerm ? 1 : 0) +
			(filters.location ? 1 : 0) +
			(filters.minExperience ? 1 : 0) +
			(filters.minSalary || filters.maxSalary ? 1 : 0) +
			filters.workMode.length +
			filters.jobType.length,
		[filters]
	);

	// Don't render map until client-side mounted
	if (!isMounted) {
		return (
			<div className='h-full w-full flex items-center justify-center bg-background'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4' />
					<p className='text-default-500'>Loading map...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='h-screen w-full flex overflow-hidden'>
			{/* Screen Reader Announcements */}
			<div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
				{announcementMessage}
			</div>

			{/* Desktop Sidebar - Hidden on mobile/tablet */}
			{!isMobile && (
				<div className='w-80 h-full border-r border-divider overflow-y-auto bg-background z-10 relative'>
					<MapFilterSidebar
						filters={filters}
						onFiltersChange={onFiltersChange}
						onLocationSelect={handleLocationSelect}
						totalCount={(data as any)?.jobs?.totalCount || 0}
						isPending={isPending}
					/>
				</div>
			)}

			{/* Map Container */}
			<div className='flex-1 relative h-full overflow-hidden'>
				<MapContainer
					center={defaultCenter}
					zoom={defaultZoom}
					minZoom={minZoom}
					maxZoom={maxZoom}
					className='h-full w-full [&_.leaflet-container]:touch-pan-x [&_.leaflet-container]:touch-pan-y [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full'
					ref={setMap}
					zoomControl={false}
					attributionControl={false}
					touchZoom={true}
					dragging={true}
					scrollWheelZoom={true}
					doubleClickZoom={true}
					maxBounds={worldBounds}
					maxBoundsViscosity={0.5}
					style={{ height: '100%', width: '100%' }}
					bounceAtZoomLimits
				>
					<TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

					<JobMapMarkers data={data} onJobClick={handleJobClick} selectedJobId={selectedJobId} />
					<JobMapControls map={map} />
				</MapContainer>

				{/* Desktop Job Preview Popup (shown on marker click) */}
				{!isMobile && selectedJobId && (
					<div className='absolute top-4 right-4 w-96 bg-background shadow-xl rounded-lg border border-divider z-[1000] max-h-[80vh] overflow-y-auto'>
						<JobPreviewDrawer jobId={selectedJobId} data={data} onClose={() => setSelectedJobId(null)} />
					</div>
				)}
			</div>

			{/* Mobile Job Preview Drawer */}
			{isMobile && selectedJobId && (
				<JobPreviewDrawer jobId={selectedJobId} data={data} isOpen={isDrawerOpen} onClose={handleDrawerClose} />
			)}

			{/* Mobile Filter Bottom Sheet - Always visible on mobile, tucked in by default */}
			{isMobile && (
				<FilterBottomSheet
					filters={filters}
					onFiltersChange={onFiltersChange}
					onLocationSelect={handleLocationSelect}
					totalCount={(data as any)?.jobs?.totalCount || 0}
					isPending={isPending}
					activeFilterCount={activeFilterCount}
				/>
			)}
		</div>
	);
}

'use client';

import { useProgress } from '@bprogress/next';
import { useDisclosure } from '@heroui/react';
import type { Map as LeafletMap } from 'leaflet';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { MapViewClientComponentFragment$data } from '@/__generated__/MapViewClientComponentFragment.graphql';
import type { SearchLocation } from '@/components/forms/LocationAutocomplete';
import MapHeader from '@/components/layout/MapHeader';

type ClusterInfo = {
	hexId: string;
	count: number;
	center: [number, number];
};

// Dynamic imports for Leaflet components (SSR incompatible)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const JobHexagonClusters = dynamic(() => import('./JobHexagonClusters'), { ssr: false });
const JobMapControls = dynamic(() => import('./JobMapControls'), { ssr: false });
const MapFilterSidebar = dynamic(() => import('./MapFilterSidebar'), { ssr: false });
const ClusterBottomSheet = dynamic(() => import('./FilterSheet'), { ssr: false });
const FilterModal = dynamic(() => import('./FilterModal'), { ssr: false });

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

const JobMapViewFragment = graphql`
	fragment JobMapViewFragment on Query @argumentDefinitions(
		searchTerm: { type: "String" }
		minExperience: { type: "Int" }
		minSalary: { type: "Int" }
		maxSalary: { type: "Int" }
		proximityKm: { type: "Float" }
		location: { type: "String" }
		bounds: { type: "BoundingBoxInput" }
		workMode: { type: "[JobWorkModeFilter!]!" }
		jobType: { type: "[JobTypeFilter!]!" }
		sortBy: { type: "JobSearchSortBy!" }
		first: { type: "Int", defaultValue: 100 }
	) {
		jobs(
			searchTerm: $searchTerm
			minExperience: $minExperience
			minSalary: $minSalary
			maxSalary: $maxSalary
			proximityKm: $proximityKm
			location: $location
			bounds: $bounds
			workMode: $workMode
			jobType: $jobType
			sortBy: $sortBy
			first: $first
		) {
			totalCount
		}
	}
`;

interface JobMapViewProps {
	data: MapViewClientComponentFragment$data;
	queryRef: any; // For passing to MapHeader and fragment
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
	currentZoom?: number; // Current map zoom level for clustering
	onBoundsChange?: (bounds: { swLat: number; swLng: number; neLat: number; neLng: number }) => void;
	onZoomChange?: (zoom: number) => void; // Callback when zoom level changes
	onFiltersChange?: (filters: Partial<JobMapViewProps['filters']>) => void;
	onLocationSelect?: (location: SearchLocation) => void;
	onClusterSelect?: (h3Index: string, clusterInfo: { count: number; center: [number, number] }) => void; // Callback when cluster is selected
	isPending?: boolean;
	initialViewport?: {
		latitude: number;
		longitude: number;
		zoomLevel: number;
	} | null;
}

export default function JobMapView({
	data,
	queryRef,
	filters,
	currentZoom = 5,
	onBoundsChange,
	onZoomChange,
	onFiltersChange,
	onLocationSelect: _onLocationSelect,
	onClusterSelect,
	isPending = false,
	initialViewport
}: JobMapViewProps) {
	// Use fragment to get jobs data
	const jobsData = useFragment(JobMapViewFragment, queryRef);

	const [map, setMap] = useState<LeafletMap | null>(null);
	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
	const [autoSelectedCluster, setAutoSelectedCluster] = useState<ClusterInfo | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [lastBounds, setLastBounds] = useState<{ swLat: number; swLng: number; neLat: number; neLng: number } | null>(null);
	const [currentBounds, setCurrentBounds] = useState<{ swLat: number; swLng: number; neLat: number; neLng: number } | null>(null);
	const [announcementMessage, setAnnouncementMessage] = useState<string>('');
	const [isMounted, setIsMounted] = useState(false);
	const [isMapDataFetching, setIsMapDataFetching] = useState(false);
	const [isUserInteracting, setIsUserInteracting] = useState(false);
	const [isPendingMapOperation, setIsPendingMapOperation] = useState(false); // Bridge state for debounced operations

	// New state for enhanced UX
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [forceSidebarOpen, setForceSidebarOpen] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

	// BProgress hook for controlling the top progress bar
	const { start, stop } = useProgress();

	// Drawer state for mobile job preview
	const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

	// Unified progress bar control - handles all loading states seamlessly
	useEffect(() => {
		const shouldShowProgress = isPending || isMapDataFetching || isUserInteracting || isPendingMapOperation;

		if (shouldShowProgress) {
			start();
		} else {
			stop();
		}
	}, [isPending, isMapDataFetching, isUserInteracting, isPendingMapOperation, start, stop]);

	// Clean up states when external loading completes
	useEffect(() => {
		if (!isPending) {
			// When external data loading completes, clean up our internal states
			if (isMapDataFetching) {
				setIsMapDataFetching(false);
			}
		}
	}, [isPending, isMapDataFetching]);

	// Clean up interaction states when all operations are truly complete
	useEffect(() => {
		if (!isPending && !isMapDataFetching && !isPendingMapOperation) {
			// Only clear user interaction when ALL operations are complete
			const timeoutId = setTimeout(() => {
				// Final check before clearing
				if (!isPending && !isMapDataFetching && !isPendingMapOperation) {
					setIsUserInteracting(false);
				}
			}, 50); // Minimal delay for race condition protection

			return () => clearTimeout(timeoutId);
		}
	}, [isPending, isMapDataFetching, isPendingMapOperation]);

	// Failsafe timeout - last resort cleanup
	useEffect(() => {
		if (!isUserInteracting && !isPendingMapOperation) return;

		const timeoutId = setTimeout(() => {
			// Emergency cleanup after 8 seconds
			setIsUserInteracting(false);
			setIsPendingMapOperation(false);
		}, 8000);

		return () => clearTimeout(timeoutId);
	}, [isUserInteracting, isPendingMapOperation]); // Handle location selection and zoom to it
	const handleLocationSelect = useCallback(
		(location: SearchLocation) => {
			if (!map) return;

			// Start progress bar immediately for location navigation
			setIsUserInteracting(true);

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

	// Track zoom changes and invoke callback
	useEffect(() => {
		if (!map || !onZoomChange) return;

		const handleZoomStart = () => {
			// Start progress bar immediately when user starts zooming
			setIsUserInteracting(true);
		};

		const handleZoomEnd = () => {
			const zoom = map.getZoom();
			onZoomChange(zoom);

			// Set pending operation to bridge any gap until data fetching starts
			setIsPendingMapOperation(true);

			// Also trigger bounds update on zoom (since zoom changes affect the visible area)
			const bounds = map.getBounds();
			const sw = bounds.getSouthWest();
			const ne = bounds.getNorthEast();

			const rawBounds = {
				swLat: sw.lat,
				swLng: sw.lng,
				neLat: ne.lat,
				neLng: ne.lng
			};

			const newBounds = normalizeBounds(rawBounds);

			// Calculate area for debugging
			const latDiff = newBounds.neLat - newBounds.swLat;
			const lngDiff = newBounds.neLng - newBounds.swLng;
			const areaSqDeg = latDiff * lngDiff;

			console.log('📐 Frontend: Bounds calculated on zoom end:', {
				zoom,
				rawBounds,
				normalizedBounds: newBounds,
				calculated: {
					latDiff: latDiff.toFixed(6),
					lngDiff: lngDiff.toFixed(6),
					areaSqDeg: areaSqDeg.toFixed(6)
				}
			});

			setLastBounds(newBounds);
			setCurrentBounds(newBounds);

			// Clear pending and start actual data fetching
			setIsPendingMapOperation(false);
			if (onBoundsChange) {
				setIsMapDataFetching(true);
				onBoundsChange(newBounds);
			}
		};

		map.on('zoomstart', handleZoomStart);
		map.on('zoomend', handleZoomEnd);

		return () => {
			map.off('zoomstart', handleZoomStart);
			map.off('zoomend', handleZoomEnd);
		};
	}, [map, onZoomChange, onBoundsChange]);

	// Invalidate map size when map is ready or when layout changes (fixes tile loading issue)
	useEffect(() => {
		if (!map?.getContainer()) return;

		// Invalidate size when map loads or when mobile state changes (sidebar toggle)
		const timeoutId1 = setTimeout(() => {
			if (map?.getContainer()) {
				map.invalidateSize();
			}
		}, 100);

		// Force another invalidation after a longer delay to ensure full map load
		const timeoutId2 = setTimeout(() => {
			if (map?.getContainer()) {
				map.invalidateSize();
			}
		}, 500);

		// Also invalidate on window resize to handle dynamic layout changes
		const handleResize = () => {
			if (map?.getContainer()) {
				map.invalidateSize();
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			clearTimeout(timeoutId1);
			clearTimeout(timeoutId2);
			window.removeEventListener('resize', handleResize);
		};
	}, [map, isMobile, isSidebarCollapsed]); // Re-run when isMobile or sidebar collapse state changes

	// Set initial bounds when map is ready
	useEffect(() => {
		if (!map || currentBounds) return; // Don't set if bounds already exist

		// Wait a bit for the map to be fully initialized
		const timeoutId = setTimeout(() => {
			if (map.getContainer()) {
				const bounds = map.getBounds();
				const sw = bounds.getSouthWest();
				const ne = bounds.getNorthEast();

				const initialBounds = normalizeBounds({
					swLat: sw.lat,
					swLng: sw.lng,
					neLat: ne.lat,
					neLng: ne.lng
				});

				setCurrentBounds(initialBounds);
				setLastBounds(initialBounds);

				// Also trigger the parent callback if it exists
				// This will refetch clusters with the correct bounds and zoom for the viewport
				if (onBoundsChange) {
					onBoundsChange(initialBounds);
				}
			}
		}, 1000); // Wait 1 second for map to fully load

		return () => clearTimeout(timeoutId);
	}, [map, currentBounds, onBoundsChange]);

	// Track bounds changes with debouncing
	useEffect(() => {
		if (!map || !onBoundsChange) return;

		let timeoutId: NodeJS.Timeout;

		const handleMapMoveStart = () => {
			// Start progress bar immediately when user starts panning
			setIsUserInteracting(true);
		};

		const handleMapMove = () => {
			// Set pending operation immediately to bridge the debounce gap
			setIsPendingMapOperation(true);

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

				// Calculate area for debugging
				const latDiff = newBounds.neLat - newBounds.swLat;
				const lngDiff = newBounds.neLng - newBounds.swLng;
				const areaSqDeg = latDiff * lngDiff;

				console.log('🗺️ Frontend: Map moveend - bounds calculated:', {
					rawBounds,
					normalizedBounds: newBounds,
					currentZoom,
					calculated: {
						latDiff: latDiff.toFixed(6),
						lngDiff: lngDiff.toFixed(6),
						areaSqDeg: areaSqDeg.toFixed(6)
					}
				});

				// Only trigger refetch if bounds changed significantly (>0.001 degrees ~110m)
				if (lastBounds) {
					const latDiffFromLast = Math.abs(newBounds.swLat - lastBounds.swLat) + Math.abs(newBounds.neLat - lastBounds.neLat);
					const lngDiffFromLast = Math.abs(newBounds.swLng - lastBounds.swLng) + Math.abs(newBounds.neLng - lastBounds.neLng);

					if (latDiffFromLast < 0.002 && lngDiffFromLast < 0.002) {
						// Clear pending operation for minor movements
						setIsPendingMapOperation(false);
						return;
					}
				}

				setLastBounds(newBounds);
				setCurrentBounds(newBounds);

				// Clear pending operation and start actual data fetching
				setIsPendingMapOperation(false);
				if (onBoundsChange) {
					setIsMapDataFetching(true);
					onBoundsChange(newBounds);
				}
			}, 800);
		};

		map.on('movestart', handleMapMoveStart);
		map.on('moveend', handleMapMove);

		return () => {
			map.off('movestart', handleMapMoveStart);
			map.off('moveend', handleMapMove);
			clearTimeout(timeoutId);
			// Clean up pending operation on unmount
			setIsPendingMapOperation(false);
		};
	}, [map, onBoundsChange, lastBounds]);

	// Handle cluster click - zoom into cluster center and trigger sidebar population
	const handleClusterClick = useCallback(
		(h3Index: string, cluster: any) => {
			if (!map) return;

			// Start progress bar for cluster interaction
			setIsUserInteracting(true);

			const [lng, lat] = cluster.center.coordinates;
			const targetZoom = Math.min(currentZoom + 2, 16); // Zoom in by 2 levels, max 16

			// Zoom to cluster
			map.flyTo([lat, lng], targetZoom, {
				duration: 1.0
			});

			// Trigger sidebar population with cluster jobs (if callback provided)
			if (onClusterSelect) {
				onClusterSelect(h3Index, {
					count: cluster.count,
					center: [lat, lng]
				});
			}

			setAnnouncementMessage(`Zoomed into cluster with ${cluster.count} jobs. Loading cluster details...`);
		},
		[map, currentZoom, onClusterSelect]
	);

	// Find the most prominent cluster in current viewport
	const findMostProminentCluster = useCallback((clusters: any[], mapBounds: any) => {
		if (!clusters || clusters.length === 0 || !mapBounds) {
			console.log('❌ findMostProminentCluster early return:', {
				hasClusters: !!clusters,
				clustersLength: clusters?.length,
				hasMapBounds: !!mapBounds
			});
			return null;
		}

		const bounds = mapBounds.getBounds();
		const sw = bounds.getSouthWest();
		const ne = bounds.getNorthEast();

		console.log('🗺️ Map viewport bounds:', {
			sw: { lat: sw.lat, lng: sw.lng },
			ne: { lat: ne.lat, lng: ne.lng }
		});

		// Filter clusters that are visible in viewport
		const visibleClusters = clusters.filter((cluster: any) => {
			// Handle different possible coordinate formats
			let lng: number;
			let lat: number;

			if (cluster.center?.coordinates) {
				[lng, lat] = cluster.center.coordinates;
			} else if (Array.isArray(cluster.center)) {
				[lng, lat] = cluster.center;
			} else if (cluster.lat && cluster.lng) {
				lat = cluster.lat;
				lng = cluster.lng;
			} else {
				console.warn('❓ Unknown cluster coordinate format:', cluster);
				return false;
			}

			const isVisible = lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng;
			console.log(`📍 Cluster ${cluster.h3Index || cluster.id}:`, {
				center: [lat, lng],
				count: cluster.count,
				isVisible,
				bounds: { sw: [sw.lat, sw.lng], ne: [ne.lat, ne.lng] }
			});
			return isVisible;
		});

		console.log(`👀 Visible clusters: ${visibleClusters.length} of ${clusters.length}`);

		if (visibleClusters.length === 0) return null;

		// Find cluster with highest job count (most prominent)
		const mostProminent = visibleClusters.reduce((max: any, cluster: any) => (cluster.count > max.count ? cluster : max));

		const [lng, lat] = mostProminent.center.coordinates;
		const result = {
			hexId: mostProminent.h3Index,
			count: mostProminent.count,
			center: [lat, lng] as [number, number] // Convert [lng, lat] to [lat, lng]
		};

		console.log('🏆 Most prominent cluster selected:', result);
		return result;
	}, []);

	// Auto-select cluster based on zoom level and viewport
	useEffect(() => {
		console.log('🔍 Auto-selection check:', {
			hasMap: !!map,
			currentZoom,
			hasData: !!data,
			hasClusters: !!data.jobClusters?.clusters,
			clusterCount: data.jobClusters?.clusters?.length || 0
		});

		if (!map || currentZoom < 10) {
			// Clear auto-selection when zoomed out too far
			console.log('❌ Clearing auto-selection:', {
				reason: !map ? 'no map' : 'zoom too low',
				currentZoom,
				minZoomRequired: 10
			});
			setAutoSelectedCluster(null);
			return;
		}

		const clusters = data.jobClusters?.clusters;
		console.log('📊 Cluster data:', {
			clustersExists: !!clusters,
			isArray: Array.isArray(clusters),
			clustersLength: clusters?.length,
			clusters: Array.isArray(clusters) ? clusters?.slice(0, 3) : clusters // Log first 3 clusters for debugging
		});

		if (!Array.isArray(clusters) || clusters.length === 0) {
			console.log('❌ No valid clusters found');
			setAutoSelectedCluster(null);
			return;
		}

		// Only auto-select if there are few enough clusters to make it meaningful
		if (clusters.length > 10) {
			console.log('❌ Too many clusters:', clusters.length);
			setAutoSelectedCluster(null);
			return;
		}

		const prominentCluster = findMostProminentCluster(clusters, map);
		console.log('🎯 Selected cluster:', prominentCluster);
		setAutoSelectedCluster(prominentCluster);
	}, [map, currentZoom, data, findMostProminentCluster]);

	// Handle drawer close
	const handleDrawerClose = useCallback(() => {
		onDrawerClose();
		setSelectedJobId(null);
	}, [onDrawerClose]);

	// Default center (India) - overridden by initialViewport if location filter is provided
	const defaultCenter: [number, number] = initialViewport ? [initialViewport.latitude, initialViewport.longitude] : [20.5937, 78.9629];
	const defaultZoom = initialViewport ? initialViewport.zoomLevel : 5;

	// Set max bounds to prevent wrapping around the world multiple times
	// This helps prevent invalid longitude values
	const worldBounds: [[number, number], [number, number]] = [
		[-90, -180], // Southwest corner
		[90, 180] // Northeast corner
	];

	// Zoom constraints to prevent ugly extreme zoom levels
	const minZoom = 3; // Prevent zooming out too far (vertical strip issue)
	const maxZoom = 18; // Standard max zoom for street-level detail

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
		<div className='h-screen w-full flex flex-col overflow-hidden'>
			{/* Header */}
			<MapHeader
				query={queryRef}
				searchTerm={filters.searchTerm}
				location={filters.location}
				onSearchTermChange={term => onFiltersChange?.({ searchTerm: term })}
				onLocationChange={location => onFiltersChange?.({ location })}
				onLocationSelect={handleLocationSelect}
				filters={{
					minExperience: filters.minExperience,
					minSalary: filters.minSalary,
					maxSalary: filters.maxSalary,
					workMode: filters.workMode,
					jobType: filters.jobType
				}}
				onFiltersClick={() => setShowFilterModal(true)}
				onFiltersChange={headerFilters => {
					// Convert header filters to JobMapView filters format
					if (headerFilters && onFiltersChange) {
						onFiltersChange(headerFilters as Partial<JobMapViewProps['filters']>);
					}
				}}
				resultCount={jobsData.jobs?.totalCount || 0}
			/>

			{/* Screen Reader Announcements */}
			<div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
				{announcementMessage}
			</div>

			{/* Main Content Area */}
			<div className='flex-1 flex overflow-hidden'>
				{/* Desktop Sidebar - Always visible on desktop */}
				{!isMobile && (
					<div className='h-full bg-background z-10 relative overflow-visible'>
						<MapFilterSidebar
							filters={filters}
							totalCount={jobsData.jobs?.totalCount || 0}
							bounds={currentBounds}
							currentZoom={currentZoom}
							forceOpen={forceSidebarOpen}
							onCollapseChange={setIsSidebarCollapsed}
						/>
					</div>
				)}

				{/* Map Container */}
				<div className='flex-1 relative h-full overflow-hidden'>
					<div className='h-full w-full'>
						<MapContainer
							center={defaultCenter}
							zoom={defaultZoom}
							minZoom={minZoom}
							maxZoom={maxZoom}
							className='h-full w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:block'
							ref={setMap}
							zoomControl={false}
							attributionControl={false}
							touchZoom={true}
							dragging={true}
							scrollWheelZoom={true}
							doubleClickZoom={true}
							maxBounds={worldBounds}
							maxBoundsViscosity={0.5}
							style={{ height: '100%', width: '100%', zIndex: 1 }}
							bounceAtZoomLimits
						>
							<TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

							{/* Always render job clusters at all zoom levels */}
							{data.jobClusters?.clusters && data.jobClusters.clusters.length > 0 && (
								<JobHexagonClusters clusters={data.jobClusters.clusters as any} onClusterClick={handleClusterClick} />
							)}

							<JobMapControls map={map} />
						</MapContainer>
					</div>
				</div>

				{/* Mobile Cluster Bottom Sheet - Always visible on mobile, tucked in by default */}
				{isMobile && (
					<ClusterBottomSheet
						totalCount={jobsData.jobs?.totalCount || 0}
						selectedCluster={autoSelectedCluster}
						bounds={currentBounds}
						currentZoom={currentZoom}
						filters={filters}
						forceOpen={forceSidebarOpen}
					/>
				)}

				{/* Desktop Filter Modal */}
				<FilterModal
					isOpen={showFilterModal}
					onClose={() => setShowFilterModal(false)}
					filters={filters}
					onFiltersChange={onFiltersChange}
					resultCount={jobsData.jobs?.totalCount || 0}
					isPending={isPending}
				/>
			</div>
		</div>
	);
}

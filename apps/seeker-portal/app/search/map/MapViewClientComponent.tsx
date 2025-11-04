'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { graphql, usePreloadedQuery, useRefetchableFragment, useRelayEnvironment } from 'react-relay';
import type { JobSearchSortBy, JobTypeFilter, JobWorkModeFilter } from '@/__generated__/MapViewClientComponentRefetchQuery.graphql';
import type PageSearchMapViewQueryNode from '@/__generated__/pageSearchMapViewQuery.graphql';
import type { pageSearchMapViewQuery } from '@/__generated__/pageSearchMapViewQuery.graphql';
import PageSearchMapViewQuery from '@/__generated__/pageSearchMapViewQuery.graphql';
import type { SearchLocation } from '@/components/forms/LocationAutocomplete';
import { FILTER_DEFAULTS, REASONABLE_JOB_COUNT } from '@/lib/constants';
import links from '@/lib/links';
import type { SerializablePreloadedQuery } from '@/lib/relay/serializablePreloadedQuery';
import useSerializablePreloadedQuery from '@/lib/relay/useSerializablePreloadedQuery';

const JobMapView = dynamic(() => import('@/components/search/map/JobMapView'), {
	ssr: false
});

const MapViewClientComponentFragment = graphql`
	fragment MapViewClientComponentFragment on Query
	 @argumentDefinitions(
			inputJobType: { type: "[JobTypeFilter!]!" }
			inputLocation: { type: "String" }
			inputMaxSalary: { type: "Int" }
			inputMinExperience: { type: "Int" }
			inputMinSalary: { type: "Int" }
			inputProximityKm: { type: "Float" }
			inputSearchTerm: { type: "String" }
			inputWorkMode: { type: "[JobWorkModeFilter!]!" }
			inputZoomLevel: { type: "Int!" }
			inputSortBy: { type: "JobSearchSortBy!" }
		)
		@refetchable(queryName: "MapViewClientComponentRefetchQuery") {
		# Job clusters query - used at low/medium zoom levels
		jobClusters(
			bounds: $bounds
			zoomLevel: $inputZoomLevel
			searchTerm: $inputSearchTerm
			minExperience: $inputMinExperience
			minSalary: $inputMinSalary
			maxSalary: $inputMaxSalary
			proximityKm: $inputProximityKm
			location: $inputLocation
			workMode: $inputWorkMode
			jobType: $inputJobType
		) @skip(if: false) {
			clusters {
				h3Index
				count
				center {
					coordinates
				}
				bounds
			}
			totalCount
			locationViewport {
				latitude
				longitude
				zoomLevel
			}
		}

		# Spread the MapHeader fragment
		...MapHeaderFragment


		# Spread the JobMapView fragment
		...JobMapViewFragment @arguments(
		searchTerm: $inputSearchTerm,
		minExperience: $inputMinExperience,
		minSalary: $inputMinSalary,
		maxSalary: $inputMaxSalary,
		proximityKm: $inputProximityKm,
		location: $inputLocation,
		workMode: $inputWorkMode,
		jobType: $inputJobType,
		sortBy: $inputSortBy,
		)
	}
`;

export default function MapViewClientComponent({
	preloadedQuery,
	location,
	searchTerm
}: {
	preloadedQuery: SerializablePreloadedQuery<typeof PageSearchMapViewQueryNode, pageSearchMapViewQuery>;
	location?: string | undefined;
	searchTerm?: string | undefined;
}) {
	const router = useRouter();

	// URL state management with nuqs
	const [filters, setFilters] = useQueryStates(
		{
			minExperience: parseAsInteger,
			minSalary: parseAsInteger,
			maxSalary: parseAsInteger,
			proximityKm: parseAsInteger.withDefault(FILTER_DEFAULTS.proximityKm),
			workMode: parseAsArrayOf(parseAsString).withDefault(FILTER_DEFAULTS.workMode),
			jobType: parseAsArrayOf(parseAsString).withDefault(FILTER_DEFAULTS.jobType),
			sortBy: parseAsString.withDefault('RELEVANCE')
		},
		{ shallow: true }
	);

	// Internal state for speciality (searchTerm) - initialized from path params
	// This allows us to update the speciality client-side without page reloads
	const [internalSpeciality, setInternalSpeciality] = useState<string | null>(searchTerm || null);

	// Debounced speciality value - used for queries
	const [debouncedSpeciality, setDebouncedSpeciality] = useState<string | null>(searchTerm || null);

	// Internal state for location - initialized from path params
	// This allows us to update the location client-side without page reloads
	const [internalLocation, setInternalLocation] = useState<string | null>(location || null);

	// Debounced location value - used for queries
	const [debouncedLocation, setDebouncedLocation] = useState<string | null>(location || null);

	// Debounce the internal speciality changes (500ms delay)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSpeciality(internalSpeciality);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [internalSpeciality]);

	// Debounce the internal location changes (500ms delay)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedLocation(internalLocation);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [internalLocation]);

	// Sync internalLocation with the location prop when it changes (e.g., from path params or browser back/forward)
	// Only sync when the prop actually changes, not when internalLocation changes
	useEffect(() => {
		setInternalLocation(location || null);
	}, [location]);

	// Map state for clustering logic - will be updated after we get fragmentData
	const [currentZoom, setCurrentZoom] = useState<number>(5); // Default zoom level
	const [currentBounds, setCurrentBounds] = useState<{ swLat: number; swLng: number; neLat: number; neLng: number } | null>(null);
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<typeof PageSearchMapViewQueryNode, pageSearchMapViewQuery>(
		environment,
		preloadedQuery,
		'store-or-network',
		{
			metadata: {
				includeAuth: true
			}
		}
	);

	const data = usePreloadedQuery(PageSearchMapViewQuery, queryRef);
	const [fragmentData, refetch] = useRefetchableFragment(MapViewClientComponentFragment, data);
	const [isPending, startTransition] = useTransition();

	// Debug: Log when fragment data changes
	useEffect(() => {
		const clusterCount = (fragmentData as any)?.jobClusters?.clusters?.length || 0;
		const totalCount = (fragmentData as any)?.jobClusters?.totalCount || 0;
		console.log('📊 Fragment data updated:', {
			clusterCount,
			totalCount,
			isPending,
			currentZoom
		});
	}, [fragmentData, isPending, currentZoom]);

	// Sync currentZoom with locationViewport when location filter changes
	useEffect(() => {
		const viewportZoom = (fragmentData as any)?.jobClusters?.locationViewport?.zoomLevel;
		if (viewportZoom) {
			setCurrentZoom(viewportZoom);
		}
	}, [internalLocation, (fragmentData as any)?.jobClusters?.locationViewport?.zoomLevel]);

	// Update page title based on current filters
	useEffect(() => {
		const totalCount = (fragmentData as any)?.jobClusters?.totalCount || 0;
		const hasReasonableCount = totalCount >= REASONABLE_JOB_COUNT;

		let title = '';

		if (internalSpeciality && internalLocation) {
			// Both speciality and location
			const formattedSpeciality = internalSpeciality
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');
			const formattedLocation = internalLocation
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');

			title = hasReasonableCount
				? `Search ${totalCount.toLocaleString()} ${formattedSpeciality} Jobs in ${formattedLocation} - Map View`
				: `Search ${formattedSpeciality} Jobs in ${formattedLocation} - Map View`;
		} else if (internalSpeciality) {
			// Speciality only
			const formattedSpeciality = internalSpeciality
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');

			title = hasReasonableCount
				? `Search ${totalCount.toLocaleString()} ${formattedSpeciality} Jobs by Location - Map Based Healthcare Search`
				: `Search ${formattedSpeciality} Jobs by Location - Map Based Healthcare Search`;
		} else if (internalLocation) {
			// Location only
			const formattedLocation = internalLocation
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');

			title = hasReasonableCount
				? `Search ${totalCount.toLocaleString()} Healthcare Jobs in ${formattedLocation} - Map View`
				: `Search Healthcare Jobs in ${formattedLocation} - Map View`;
		} else {
			// Neither (base map page)
			title = 'Search Hospital Jobs by Location - Map-Based Healthcare Search';
		}

		document.title = title;
	}, [internalSpeciality, internalLocation, fragmentData]);

	// Callback to handle bounds change and refetch
	const handleBoundsChange = useCallback(
		(bounds: { swLat: number; swLng: number; neLat: number; neLng: number }, zoom?: number) => {
			setCurrentBounds(bounds);

			// Use provided zoom if available, otherwise fall back to currentZoom from state
			const zoomToUse = zoom !== undefined ? zoom : currentZoom;

			// Calculate area for debugging
			const latDiff = bounds.neLat - bounds.swLat;
			const lngDiff = bounds.neLng - bounds.swLng;
			const areaSqDeg = latDiff * lngDiff;

			console.log('🗺️ Frontend: Bounds changed, sending to backend:', {
				bounds: {
					swLat: bounds.swLat,
					swLng: bounds.swLng,
					neLat: bounds.neLat,
					neLng: bounds.neLng
				},
				zoomLevel: zoomToUse,
				providedZoom: zoom,
				stateZoom: currentZoom,
				calculated: {
					latDiff: latDiff.toFixed(6),
					lngDiff: lngDiff.toFixed(6),
					areaSqDeg: areaSqDeg.toFixed(6)
				}
			});

			console.log('🔄 Triggering refetch with params:', {
				inputZoomLevel: zoomToUse,
				boundsArea: areaSqDeg.toFixed(6),
				fetchPolicy: 'network-only',
				timestamp: Date.now()
			});

			startTransition(() => {
				refetch(
					{
						bounds: {
							swLat: bounds.swLat,
							swLng: bounds.swLng,
							neLat: bounds.neLat,
							neLng: bounds.neLng
						},
						inputZoomLevel: zoomToUse, // Use the correct zoom level
						// Include current filters in refetch
						inputSearchTerm: debouncedSpeciality || undefined,
						inputLocation: debouncedLocation || undefined,
						inputMinExperience: filters?.minExperience || undefined,
						inputMinSalary: filters?.minSalary || undefined,
						inputMaxSalary: filters?.maxSalary || undefined,
						inputProximityKm: filters?.proximityKm ?? FILTER_DEFAULTS.proximityKm,
						inputWorkMode: (filters?.workMode ?? FILTER_DEFAULTS.workMode) as unknown as readonly JobWorkModeFilter[],
						inputJobType: (filters?.jobType ?? FILTER_DEFAULTS.jobType) as unknown as readonly JobTypeFilter[],
						inputSortBy: (filters?.sortBy ?? 'RELEVANCE') as JobSearchSortBy,
						first: 100
					},
					{
						fetchPolicy: 'network-only', // Always fetch fresh data to prevent stale cache issues
						onComplete: error => {
							if (error) {
								console.error('❌ Refetch failed:', error);
							} else {
								console.log('✅ Refetch completed successfully for zoom:', zoomToUse);
							}
						}
					}
				);
			});
		},
		[refetch, filters, currentZoom, setCurrentBounds, debouncedSpeciality, debouncedLocation]
	); // Callback to handle zoom changes
	// Callback to handle zoom changes
	// Note: This only updates zoom state. The actual refetch happens in handleBoundsChange
	// which is called by the zoom handler after updating zoom state.
	const handleZoomChange = useCallback(
		(zoom: number) => {
			setCurrentZoom(zoom);

			console.log('� Frontend: Zoom changed:', {
				newZoom: zoom,
				oldZoom: currentZoom,
				hasBounds: !!currentBounds,
				bounds: currentBounds
			});
		},
		[currentZoom, currentBounds]
	); // Callback to handle filter changes
	const handleFiltersChange = useCallback(
		(newFilters: Partial<typeof filters> & { searchTerm?: string | null; location?: string | null }) => {
			const searchTermChanged = newFilters.searchTerm !== undefined && newFilters.searchTerm !== internalSpeciality;
			const locationChanged = newFilters.location !== undefined && newFilters.location !== internalLocation;

			// If searchTerm or location changed, update internal state AND URL path
			if (searchTermChanged || locationChanged) {
				const newSearchTerm = searchTermChanged ? newFilters.searchTerm : internalSpeciality;
				const newLocation = locationChanged ? newFilters.location : internalLocation;

				// Update internal state (will trigger debounced refetch)
				if (searchTermChanged) {
					setInternalSpeciality(newSearchTerm ?? null);
				}
				if (locationChanged) {
					setInternalLocation(newLocation ?? null);
				}

				// Build the new URL path with current filter query params
				const baseUrl = links.searchMap(newLocation || undefined, newSearchTerm || undefined);
				const params = new URLSearchParams();

				// Add current filters to the new URL
				if (filters.minExperience !== null) {
					params.set('minExperience', String(filters.minExperience));
				}
				if (filters.minSalary !== null) {
					params.set('minSalary', String(filters.minSalary));
				}
				if (filters.maxSalary !== null) {
					params.set('maxSalary', String(filters.maxSalary));
				}
				if (filters.proximityKm !== FILTER_DEFAULTS.proximityKm) {
					params.set('proximityKm', String(filters.proximityKm));
				}
				if (filters.workMode.length > 0 && JSON.stringify(filters.workMode) !== JSON.stringify(FILTER_DEFAULTS.workMode)) {
					for (const mode of filters.workMode) {
						params.append('workMode', mode);
					}
				}
				if (filters.jobType.length > 0 && JSON.stringify(filters.jobType) !== JSON.stringify(FILTER_DEFAULTS.jobType)) {
					for (const type of filters.jobType) {
						params.append('jobType', type);
					}
				}
				if (filters.sortBy !== 'RELEVANCE') {
					params.set('sortBy', filters.sortBy);
				}

				const queryString = params.toString();
				const newUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

				// Update URL path with shallow navigation
				router.push(newUrl, { scroll: false });

				// Note: The zoom will be triggered by onLocationSelect callback in JobMapView
				// The refetch will be triggered by the useEffect watching debouncedSpeciality/debouncedLocation
				return;
			}

			// For other filter changes (not location/searchTerm), update URL state with nuqs
			const { location: _, searchTerm: __, ...filtersWithoutLocationAndSearchTerm } = newFilters;
			if (Object.keys(filtersWithoutLocationAndSearchTerm).length > 0) {
				setFilters(filtersWithoutLocationAndSearchTerm);
			}

			// If only searchTerm or location changed, the useEffect will handle the refetch after debouncing
			// For other filters, trigger immediate refetch
			if (!searchTermChanged && !locationChanged && Object.keys(filtersWithoutLocationAndSearchTerm).length > 0) {
				startTransition(() => {
					refetch(
						{
							// Include bounds and zoom level for job clusters
							bounds: currentBounds || undefined,
							inputZoomLevel: currentZoom,
							// Include all filter parameters - use debounced values for searchTerm and location
							inputSearchTerm: debouncedSpeciality || undefined,
							inputLocation: debouncedLocation || undefined,
							inputMinExperience: (newFilters.minExperience ?? filters.minExperience) || undefined,
							inputMinSalary: (newFilters.minSalary ?? filters.minSalary) || undefined,
							inputMaxSalary: (newFilters.maxSalary ?? filters.maxSalary) || undefined,
							inputProximityKm: newFilters.proximityKm ?? filters.proximityKm,
							inputWorkMode: (newFilters.workMode ?? filters.workMode) as unknown as readonly JobWorkModeFilter[],
							inputJobType: (newFilters.jobType ?? filters.jobType) as unknown as readonly JobTypeFilter[],
							inputSortBy: (newFilters.sortBy ?? filters.sortBy) as JobSearchSortBy,
							first: 100
						},
						{
							fetchPolicy: 'network-only' // Use network-only to ensure fresh data with new filters
						}
					);
				});
			}
		},
		[
			refetch,
			filters,
			setFilters,
			currentBounds,
			currentZoom,
			debouncedSpeciality,
			debouncedLocation,
			internalSpeciality,
			internalLocation,
			setInternalSpeciality,
			setInternalLocation,
			router
		]
	);

	// Refetch when debouncedSpeciality or debouncedLocation changes
	useEffect(() => {
		if (currentBounds) {
			startTransition(() => {
				refetch(
					{
						bounds: currentBounds,
						inputZoomLevel: currentZoom,
						inputSearchTerm: debouncedSpeciality || undefined,
						inputLocation: debouncedLocation || undefined,
						inputMinExperience: filters?.minExperience || undefined,
						inputMinSalary: filters?.minSalary || undefined,
						inputMaxSalary: filters?.maxSalary || undefined,
						inputProximityKm: filters?.proximityKm ?? FILTER_DEFAULTS.proximityKm,
						inputWorkMode: (filters?.workMode ?? FILTER_DEFAULTS.workMode) as unknown as readonly JobWorkModeFilter[],
						inputJobType: (filters?.jobType ?? FILTER_DEFAULTS.jobType) as unknown as readonly JobTypeFilter[],
						inputSortBy: (filters?.sortBy ?? 'RELEVANCE') as JobSearchSortBy,
						first: 100
					},
					{
						fetchPolicy: 'network-only'
					}
				);
			});
		}
	}, [debouncedSpeciality, debouncedLocation, currentBounds, currentZoom, filters, refetch]);

	// Callback to handle location selection and zoom
	const handleLocationSelect = useCallback((location: SearchLocation) => {
		// This will be passed down to JobMapView -> MapHeader -> MobileFilterScene
		// JobMapView's own handleLocationSelect will handle the actual map zooming
		console.log('📍 Location selected in MapViewClientComponent:', location);
	}, []);

	return (
		<JobMapView
			data={fragmentData as any}
			queryRef={fragmentData}
			filters={{
				minExperience: filters?.minExperience ?? null,
				minSalary: filters?.minSalary ?? null,
				maxSalary: filters?.maxSalary ?? null,
				proximityKm: filters?.proximityKm ?? FILTER_DEFAULTS.proximityKm,
				workMode: filters?.workMode ?? FILTER_DEFAULTS.workMode,
				jobType: filters?.jobType ?? FILTER_DEFAULTS.jobType,
				sortBy: filters?.sortBy ?? 'RELEVANCE',
				searchTerm: internalSpeciality,
				location: internalLocation
			}}
			currentZoom={currentZoom}
			onBoundsChange={handleBoundsChange}
			onZoomChange={handleZoomChange}
			onFiltersChange={handleFiltersChange as any}
			onLocationSelect={handleLocationSelect}
			isPending={isPending}
			initialViewport={(fragmentData as any)?.jobClusters?.locationViewport ?? null}
		/>
	);
}

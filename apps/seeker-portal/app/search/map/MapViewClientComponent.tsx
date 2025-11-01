'use client';

import dynamic from 'next/dynamic';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { graphql, usePreloadedQuery, useRefetchableFragment, useRelayEnvironment } from 'react-relay';
import type { JobSearchSortBy, JobTypeFilter, JobWorkModeFilter } from '@/__generated__/MapViewClientComponentRefetchQuery.graphql';
import type PageSearchMapViewQueryNode from '@/__generated__/pageSearchMapViewQuery.graphql';
import type { pageSearchMapViewQuery } from '@/__generated__/pageSearchMapViewQuery.graphql';
import PageSearchMapViewQuery from '@/__generated__/pageSearchMapViewQuery.graphql';
import { FILTER_DEFAULTS } from '@/lib/constants';
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
		}

		# Spread the MapHeader fragment
		...MapHeaderFragment
		...MapHeaderMobileFragment

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

	// Update URL when searchTerm or location changes (shallow update without page reload)
	useEffect(() => {
		// Guard: Don't run if filters aren't initialized yet
		if (!filters) return;

		// Build the new URL based on current searchTerm and location
		const baseUrl = links.searchMap(internalLocation || undefined, internalSpeciality || undefined);

		// Build query params from current filters
		const params = new URLSearchParams();

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

		// Only update if the URL actually changed
		if (newUrl !== window.location.pathname + window.location.search) {
			window.history.pushState(null, '', newUrl);
		}
	}, [internalSpeciality, internalLocation, filters]);

	// Map state for clustering logic
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

	// Update page title based on current filters
	useEffect(() => {
		const totalCount = (fragmentData as any)?.jobClusters?.totalCount || 0;

		// Build title parts
		const parts: string[] = [];

		if (internalSpeciality) {
			// Capitalize first letter of each word
			const formattedSpeciality = internalSpeciality
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');
			parts.push(`${formattedSpeciality} Jobs`);
		} else {
			parts.push('Jobs');
		}

		if (internalLocation) {
			// Capitalize first letter of each word
			const formattedLocation = internalLocation
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');
			parts.push(`in ${formattedLocation}`);
		}

		// Add count if available
		if (totalCount > 0) {
			parts.push(`(${totalCount.toLocaleString()})`);
		}

		// Add "Map View" suffix and site name
		const title = parts.length > 0 ? `${parts.join(' ')} - Map View | Hospital Jobs` : 'Job Search - Map View | Hospital Jobs';

		document.title = title;
	}, [internalSpeciality, internalLocation, fragmentData]);

	// Callback to handle bounds change and refetch
	const handleBoundsChange = useCallback(
		(bounds: { swLat: number; swLng: number; neLat: number; neLng: number }) => {
			setCurrentBounds(bounds);

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
				zoomLevel: currentZoom,
				calculated: {
					latDiff: latDiff.toFixed(6),
					lngDiff: lngDiff.toFixed(6),
					areaSqDeg: areaSqDeg.toFixed(6)
				}
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
						inputZoomLevel: currentZoom, // Include zoom level for clustering
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
						fetchPolicy: 'store-or-network'
					}
				);
			});
		},
		[refetch, filters, currentZoom, setCurrentBounds, debouncedSpeciality, debouncedLocation]
	); // Callback to handle zoom changes
	const handleZoomChange = useCallback(
		(zoom: number) => {
			setCurrentZoom(zoom);

			console.log('🔍 Frontend: Zoom changed:', {
				newZoom: zoom,
				oldZoom: currentZoom,
				hasBounds: !!currentBounds,
				bounds: currentBounds
			});

			// Refetch with new zoom level if bounds are available
			if (currentBounds) {
				const latDiff = currentBounds.neLat - currentBounds.swLat;
				const lngDiff = currentBounds.neLng - currentBounds.swLng;
				const areaSqDeg = latDiff * lngDiff;

				console.log('🗺️ Frontend: Zoom change refetch:', {
					zoomLevel: zoom,
					bounds: currentBounds,
					calculated: {
						latDiff: latDiff.toFixed(6),
						lngDiff: lngDiff.toFixed(6),
						areaSqDeg: areaSqDeg.toFixed(6)
					}
				});

				startTransition(() => {
					refetch(
						{
							bounds: currentBounds,
							inputZoomLevel: zoom,
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
							fetchPolicy: 'store-or-network'
						}
					);
				});
			}
		},
		[refetch, filters, currentBounds, setCurrentZoom, debouncedSpeciality, debouncedLocation]
	); // Callback to handle filter changes
	const handleFiltersChange = useCallback(
		(newFilters: Partial<typeof filters> & { searchTerm?: string | null; location?: string | null }) => {
			const searchTermChanged = newFilters.searchTerm !== undefined && newFilters.searchTerm !== internalSpeciality;
			const locationChanged = newFilters.location !== undefined && newFilters.location !== internalLocation;

			// If searchTerm (speciality) changed, update internal state
			if (searchTermChanged) {
				setInternalSpeciality(newFilters.searchTerm ?? null);
			}

			// If location changed, update internal location state
			if (locationChanged) {
				setInternalLocation(newFilters.location ?? null);
			}

			// Update URL state without page reload (for all filter changes except location and searchTerm)
			// Remove location and searchTerm from newFilters before passing to setFilters
			const { location: _, searchTerm: __, ...filtersWithoutLocationAndSearchTerm } = newFilters;
			setFilters(filtersWithoutLocationAndSearchTerm);

			// Note: We don't refetch immediately for searchTerm or location changes - the debounced values
			// will trigger a refetch via the useEffect below
			// For other filter changes, we refetch immediately
			if (!searchTermChanged && !locationChanged) {
				// Trigger refetch with new filters including current bounds and zoom level for job clusters
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
		[refetch, filters, setFilters, currentBounds, currentZoom, debouncedSpeciality, debouncedLocation, internalSpeciality, internalLocation]
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
			isPending={isPending}
		/>
	);
}

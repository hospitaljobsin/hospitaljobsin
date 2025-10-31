'use client';

import dynamic from 'next/dynamic';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useCallback, useState, useTransition } from 'react';
import { graphql, usePreloadedQuery, useRefetchableFragment, useRelayEnvironment } from 'react-relay';
import type { JobSearchSortBy, JobTypeFilter, JobWorkModeFilter } from '@/__generated__/MapViewClientComponentRefetchQuery.graphql';
import type PageSearchMapViewQueryNode from '@/__generated__/pageSearchMapViewQuery.graphql';
import type { pageSearchMapViewQuery } from '@/__generated__/pageSearchMapViewQuery.graphql';
import PageSearchMapViewQuery from '@/__generated__/pageSearchMapViewQuery.graphql';
import { FILTER_DEFAULTS } from '@/lib/constants';
import type { SerializablePreloadedQuery } from '@/lib/relay/serializablePreloadedQuery';
import useSerializablePreloadedQuery from '@/lib/relay/useSerializablePreloadedQuery';

const JobMapView = dynamic(() => import('@/components/search/map/JobMapView'), {
	ssr: false
});

const MapViewClientComponentFragment = graphql`
	fragment MapViewClientComponentFragment on Query
	@refetchable(queryName: "MapViewClientComponentRefetchQuery") {
		# Job clusters query - used at low/medium zoom levels
		jobClusters(
			bounds: $bounds
			zoomLevel: $zoomLevel
			searchTerm: $searchTerm
			minExperience: $minExperience
			minSalary: $minSalary
			maxSalary: $maxSalary
			proximityKm: $proximityKm
			location: $location
			workMode: $workMode
			jobType: $jobType
		) @skip(if: false) {
			clusters {
				h3Index
				count
				center {
					coordinates
				}
				bounds
				salaryRange {
					minSalary
					maxSalary
				}
				topSpecialties
			}
			totalCount
		}

		# Spread the JobMapMarkers fragment to get all data it needs
		...JobMapMarkersFragment_data
	}
`;

export default function MapViewClientComponent({
	preloadedQuery
}: {
	preloadedQuery: SerializablePreloadedQuery<typeof PageSearchMapViewQueryNode, pageSearchMapViewQuery>;
}) {
	// URL state management with nuqs
	const [filters, setFilters] = useQueryStates(
		{
			searchTerm: parseAsString,
			location: parseAsString,
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

	// Callback to handle bounds change and refetch
	const handleBoundsChange = useCallback(
		(bounds: { swLat: number; swLng: number; neLat: number; neLng: number }) => {
			setCurrentBounds(bounds);

			startTransition(() => {
				refetch(
					{
						bounds: {
							swLat: bounds.swLat,
							swLng: bounds.swLng,
							neLat: bounds.neLat,
							neLng: bounds.neLng
						},
						zoomLevel: currentZoom, // Include zoom level for clustering
						// Include current filters in refetch
						searchTerm: filters.searchTerm || undefined,
						location: filters.location || undefined,
						minExperience: filters.minExperience || undefined,
						minSalary: filters.minSalary || undefined,
						maxSalary: filters.maxSalary || undefined,
						proximityKm: filters.proximityKm,
						workMode: filters.workMode as unknown as readonly JobWorkModeFilter[],
						jobType: filters.jobType as unknown as readonly JobTypeFilter[],
						sortBy: filters.sortBy as JobSearchSortBy,
						first: 100
					},
					{
						fetchPolicy: 'store-or-network'
					}
				);
			});
		},
		[refetch, filters, currentZoom, setCurrentBounds]
	);

	// Callback to handle zoom changes
	const handleZoomChange = useCallback(
		(zoom: number) => {
			setCurrentZoom(zoom);

			// Refetch with new zoom level if bounds are available
			if (currentBounds) {
				startTransition(() => {
					refetch(
						{
							bounds: currentBounds,
							zoomLevel: zoom,
							searchTerm: filters.searchTerm || undefined,
							location: filters.location || undefined,
							minExperience: filters.minExperience || undefined,
							minSalary: filters.minSalary || undefined,
							maxSalary: filters.maxSalary || undefined,
							proximityKm: filters.proximityKm,
							workMode: filters.workMode as unknown as readonly JobWorkModeFilter[],
							jobType: filters.jobType as unknown as readonly JobTypeFilter[],
							sortBy: filters.sortBy as JobSearchSortBy,
							first: 100
						},
						{
							fetchPolicy: 'store-or-network'
						}
					);
				});
			}
		},
		[refetch, filters, currentBounds, setCurrentZoom]
	);

	// Callback to handle filter changes
	const handleFiltersChange = useCallback(
		(newFilters: Partial<typeof filters>) => {
			// Update URL state
			setFilters(newFilters);

			// Trigger refetch with new filters (keeping current bounds from fragment data)
			startTransition(() => {
				refetch(
					{
						searchTerm: (newFilters.searchTerm ?? filters.searchTerm) || undefined,
						location: (newFilters.location ?? filters.location) || undefined,
						minExperience: (newFilters.minExperience ?? filters.minExperience) || undefined,
						minSalary: (newFilters.minSalary ?? filters.minSalary) || undefined,
						maxSalary: (newFilters.maxSalary ?? filters.maxSalary) || undefined,
						proximityKm: newFilters.proximityKm ?? filters.proximityKm,
						workMode: (newFilters.workMode ?? filters.workMode) as unknown as readonly JobWorkModeFilter[],
						jobType: (newFilters.jobType ?? filters.jobType) as unknown as readonly JobTypeFilter[],
						sortBy: (newFilters.sortBy ?? filters.sortBy) as JobSearchSortBy
					},
					{
						fetchPolicy: 'store-or-network'
					}
				);
			});
		},
		[refetch, filters, setFilters]
	);

	return (
		<JobMapView
			data={fragmentData as any}
			filters={filters}
			currentZoom={currentZoom}
			onBoundsChange={handleBoundsChange}
			onZoomChange={handleZoomChange}
			onFiltersChange={handleFiltersChange as any}
			isPending={isPending}
		/>
	);
}

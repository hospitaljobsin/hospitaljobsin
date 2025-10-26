'use client';

import dynamic from 'next/dynamic';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useCallback, useTransition } from 'react';
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
	@refetchable(queryName: "MapViewClientComponentRefetchQuery")
	@argumentDefinitions(
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
		first: { type: "Int!" }
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
			edges {
				node {
					id
					slug
					organization {
						slug
					}
                    geo {
                        coordinates
                    }
					...JobMapMarkersFragment_job
					...JobPreviewDrawerFragment_job
				}
			}
			totalCount
		}
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
			startTransition(() => {
				refetch(
					{
						bounds: {
							swLat: bounds.swLat,
							swLng: bounds.swLng,
							neLat: bounds.neLat,
							neLng: bounds.neLng
						},
						// Include current filters in refetch
						searchTerm: filters.searchTerm || undefined,
						location: filters.location || undefined,
						minExperience: filters.minExperience || undefined,
						minSalary: filters.minSalary || undefined,
						maxSalary: filters.maxSalary || undefined,
						proximityKm: filters.proximityKm,
						workMode: filters.workMode as unknown as readonly JobWorkModeFilter[],
						jobType: filters.jobType as unknown as readonly JobTypeFilter[],
						sortBy: filters.sortBy as JobSearchSortBy
					},
					{
						fetchPolicy: 'store-or-network'
					}
				);
			});
		},
		[refetch, filters]
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
			data={fragmentData}
			filters={filters}
			onBoundsChange={handleBoundsChange}
			onFiltersChange={handleFiltersChange}
			isPending={isPending}
		/>
	);
}

"use client";

import type {
	JobTypeFilter,
	JobWorkModeFilter,
	SearchClientComponentQuery as SearchClientComponentQueryType,
} from "@/__generated__/SearchClientComponentQuery.graphql";
import SearchView from "@/components/search/SearchView";
import SearchViewSkeleton from "@/components/search/SearchViewSkeleton";
import { FILTER_DEFAULTS } from "@/lib/constants";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	useQueryStates,
} from "nuqs";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const SearchClientComponentQuery = graphql`
	query SearchClientComponentQuery(
		$searchTerm: String
		$minExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$proximityKm: Float
		$location: String
		$workMode: [JobWorkModeFilter!]!
		$jobType: [JobTypeFilter!]!
		$sortBy: JobSearchSortBy!
	) {
		...SearchView_query @arguments(
			searchTerm: $searchTerm
			minExperience: $minExperience
			minSalary: $minSalary
			maxSalary: $maxSalary
			proximityKm: $proximityKm
			location: $location
			workMode: $workMode
			jobType: $jobType
			sortBy: $sortBy
		)
	}
`;

// Define Filters type for useQueryStates
export type Filters = {
	q: string;
	minExperience: number | null;
	minSalary: number | null;
	maxSalary: number | null;
	locationName: string;
	proximityKm: number;
	workMode: string[];
	jobType: string[];
	sortBy: string;
};

export default function SearchClientComponent() {
	const environment = useRelayEnvironment();
	const [filters, setFilters] = useQueryStates(
		{
			q: parseAsString.withDefault(FILTER_DEFAULTS.q),
			minExperience: parseAsInteger,
			maxExperience: parseAsInteger,
			minSalary: parseAsInteger,
			maxSalary: parseAsInteger,
			locationName: parseAsString.withDefault(FILTER_DEFAULTS.locationName),
			proximityKm: parseAsInteger.withDefault(FILTER_DEFAULTS.proximityKm),
			workMode: parseAsArrayOf(parseAsString).withDefault(
				FILTER_DEFAULTS.workMode,
			),
			jobType: parseAsArrayOf(parseAsString).withDefault(
				FILTER_DEFAULTS.jobType,
			),
			sortBy: parseAsString.withDefault("RELEVANCE"),
		},
		{ shallow: true },
	);

	// Prepare variables for the query
	const variables = {
		searchTerm: filters.q,
		minExperience: filters.minExperience,
		maxExperience: filters.maxExperience,
		minSalary: filters.minSalary,
		maxSalary: filters.maxSalary,
		location: filters.locationName,
		proximityKm: filters.proximityKm,
		workMode: filters.workMode as readonly JobWorkModeFilter[],
		jobType: filters.jobType as readonly JobTypeFilter[],
		sortBy: filters.sortBy as "RELEVANCE" | "UPDATED_AT",
	};

	const preloadedQuery = loadQuery<SearchClientComponentQueryType>(
		environment,
		SearchClientComponentQuery,
		variables,
	);

	return (
		<Suspense fallback={<SearchViewSkeleton />}>
			<SearchView
				queryRef={preloadedQuery}
				filters={filters}
				setFilters={setFilters}
			/>
		</Suspense>
	);
}

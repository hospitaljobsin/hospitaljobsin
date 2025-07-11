"use client";

import type { SearchClientComponentQuery as SearchClientComponentQueryType } from "@/__generated__/SearchClientComponentQuery.graphql";
import SearchView from "@/components/search/SearchView";
import SearchViewSkeleton from "@/components/search/SearchViewSkeleton";
import { FILTER_DEFAULTS } from "@/lib/constants";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const SearchClientComponentQuery = graphql`
	query SearchClientComponentQuery(
		$searchTerm: String
		$minExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$coordinates: CoordinatesInput
		$proximityKm: Float
	) {
		...SearchPageContent_query @arguments(
			searchTerm: $searchTerm
			minExperience: $minExperience
			minSalary: $minSalary
			maxSalary: $maxSalary
			coordinates: $coordinates
			proximityKm: $proximityKm
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
	coordinates: string;
	proximityKm: number;
	workMode: string;
	jobType: string;
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
			coordinates: parseAsString.withDefault(FILTER_DEFAULTS.coordinates),
			proximityKm: parseAsInteger.withDefault(FILTER_DEFAULTS.proximityKm),
			workMode: parseAsString.withDefault(FILTER_DEFAULTS.workMode),
			jobType: parseAsString.withDefault(FILTER_DEFAULTS.jobType),
		},
		{ shallow: true },
	);

	// Parse coordinates from either JSON format or "latitude,longitude" string format
	const parseCoordinates = (coordinatesString: string | null) => {
		if (!coordinatesString) return null;

		// Try to parse as JSON first (for backward compatibility)
		try {
			const parsed = JSON.parse(coordinatesString);
			if (
				parsed &&
				typeof parsed === "object" &&
				"latitude" in parsed &&
				"longitude" in parsed
			) {
				return parsed;
			}
		} catch {
			// Not JSON, try parsing as "latitude,longitude" string
		}

		// Parse as "latitude,longitude" string format
		const [latitude, longitude] = coordinatesString.split(",").map(Number);
		if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
		return { latitude, longitude };
	};

	// Prepare variables for the query
	const variables = {
		searchTerm: filters.q,
		minExperience: filters.minExperience,
		maxExperience: filters.maxExperience,
		minSalary: filters.minSalary,
		maxSalary: filters.maxSalary,
		coordinates: parseCoordinates(filters.coordinates),
		proximityKm: filters.proximityKm,
		workMode: filters.workMode,
		jobType: filters.jobType,
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

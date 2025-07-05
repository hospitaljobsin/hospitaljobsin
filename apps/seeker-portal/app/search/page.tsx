"use client";

import type { pageSearchQuery as pageSearchQueryType } from "@/__generated__/pageSearchQuery.graphql";
import { FILTER_DEFAULTS } from "@/lib/constants";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";
import SearchHeaderClientComponent from "../../components/search/SearchHeaderClientComponent";
import SearchPageContent from "../../components/search/SearchPageContent";

export const searchPageQuery = graphql`
	query pageSearchQuery(
		$speciality: String
		$minExperience: Int
		$maxExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$coordinates: CoordinatesInput
		$proximityKm: Float
	) {
		...SearchPageContent_query @arguments(
			speciality: $speciality
			minExperience: $minExperience
			maxExperience: $maxExperience
			minSalary: $minSalary
			maxSalary: $maxSalary
			coordinates: $coordinates
			proximityKm: $proximityKm
		)
	}
`;

// Define Filters type for useQueryStates
export type Filters = {
	speciality: string;
	minExperience: number | null;
	maxExperience: number | null;
	minSalary: number | null;
	maxSalary: number | null;
	locationName: string;
	coordinates: string;
	proximityKm: number;
	workMode: string;
	jobType: string;
};

export default function SearchPage() {
	const environment = useRelayEnvironment();
	const [filters, setFilters] = useQueryStates(
		{
			speciality: parseAsString.withDefault(FILTER_DEFAULTS.speciality),
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
		{ shallow: false },
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
		speciality: filters.speciality,
		minExperience: filters.minExperience,
		maxExperience: filters.maxExperience,
		minSalary: filters.minSalary,
		maxSalary: filters.maxSalary,
		coordinates: parseCoordinates(filters.coordinates),
		proximityKm: filters.proximityKm,
		workMode: filters.workMode,
		jobType: filters.jobType,
	};

	const preloadedQuery = loadQuery<pageSearchQueryType>(
		environment,
		searchPageQuery,
		variables,
	);

	return (
		<div className="w-full flex flex-col bg-background-600">
			<SearchHeaderClientComponent
				speciality={filters.speciality}
				setSpeciality={(value) => setFilters({ ...filters, speciality: value })}
			/>
			<SearchPageContent
				queryRef={preloadedQuery}
				filters={filters}
				setFilters={setFilters}
			/>
		</div>
	);
}

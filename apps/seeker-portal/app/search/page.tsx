"use client";

import type { pageSearchQuery as pageSearchQueryType } from "@/__generated__/pageSearchQuery.graphql";
import { useSearchParams } from "next/navigation";
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
	const searchParams = useSearchParams();
	const speciality = searchParams.get("speciality") || null;
	const experience = searchParams.get("experience") || null;
	const salary = searchParams.get("salary") || null;
	const coordinates = searchParams.get("coordinates") || null;
	const environment = useRelayEnvironment();
	const [filters, setFilters] = useQueryStates(
		{
			speciality: parseAsString.withDefault(""),
			minExperience: parseAsInteger,
			maxExperience: parseAsInteger,
			minSalary: parseAsInteger,
			maxSalary: parseAsInteger,
			locationName: parseAsString.withDefault(""),
			coordinates: parseAsString.withDefault(""),
			proximityKm: parseAsInteger.withDefault(0),
			workMode: parseAsString.withDefault("ANY"),
			jobType: parseAsString.withDefault("ANY"),
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
		experience: experience ? Number.parseInt(experience) : null,
		salary: salary ? Number.parseInt(salary) : null,
		coordinates: parseCoordinates(coordinates),
		first: 10,
		workMode: "ANY",
		jobType: "ANY",
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

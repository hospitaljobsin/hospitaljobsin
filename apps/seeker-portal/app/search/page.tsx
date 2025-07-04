"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";
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

export default function SearchPage() {
	const searchParams = useSearchParams();
	const speciality = searchParams.get("speciality") || null;
	const experience = searchParams.get("experience") || null;
	const salary = searchParams.get("salary") || null;
	const coordinates = searchParams.get("coordinates") || null;
	const environment = useRelayEnvironment();

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
		if (isNaN(latitude) || isNaN(longitude)) return null;
		return { latitude, longitude };
	};

	// Prepare variables for the query
	const variables = {
		speciality,
		experience: experience ? Number.parseInt(experience) : null,
		salary: salary ? Number.parseInt(salary) : null,
		coordinates: parseCoordinates(coordinates),
		first: 10,
	};

	const preloadedQuery = loadQuery(environment, searchPageQuery, variables);

	return (
		<Suspense fallback={<div>Loading jobs...</div>}>
			<SearchPageContent queryRef={preloadedQuery} />
		</Suspense>
	);
}

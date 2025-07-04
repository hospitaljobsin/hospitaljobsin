import type { SearchPageContent_query$key } from "@/__generated__/SearchPageContent_query.graphql";
import pageSearchQuery, {
	type pageSearchQuery as pageSearchQueryType,
} from "@/__generated__/pageSearchQuery.graphql";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import JobList from "../landing/JobList";
import FilterSidebar from "./FilterSidebar";

export const SearchPageContentFragment = graphql`
  fragment SearchPageContent_query on Query
  @argumentDefinitions(
    speciality: { type: "String" }
    minExperience: { type: "Int" }
    maxExperience: { type: "Int" }
    minSalary: { type: "Int" }
    maxSalary: { type: "Int" }
    coordinates: { type: "CoordinatesInput" }
    proximityKm: { type: "Float" }
  ) {
    ...JobListFragment @arguments(
      searchTerm: $speciality
      coordinates: $coordinates
      proximityKm: $proximityKm
      minExperience: $minExperience
      maxExperience: $maxExperience
      minSalary: $minSalary
      maxSalary: $maxSalary
    )
  }
`;

const FILTER_DEFAULTS = {
	speciality: "",
	minExperience: null,
	maxExperience: null,
	minSalary: null,
	maxSalary: null,
	locationName: "",
	coordinates: "",
	proximityKm: 50,
};

export default function SearchPageContent({
	queryRef,
}: { queryRef: PreloadedQuery<pageSearchQueryType> }) {
	const query = usePreloadedQuery(pageSearchQuery, queryRef);
	const data = useFragment<SearchPageContent_query$key>(
		SearchPageContentFragment,
		query,
	);

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
		},
		{ shallow: false },
	);

	// When passing to FilterSidebar and JobList, treat undefined as null
	const sidebarFilters = {
		...filters,
		minExperience: filters.minExperience ?? null,
		maxExperience: filters.maxExperience ?? null,
		minSalary: filters.minSalary ?? null,
		maxSalary: filters.maxSalary ?? null,
	};

	// Parse coordinates from the string format "latitude,longitude"
	const parseCoordinates = (coordinatesString: string) => {
		if (!coordinatesString) return null;
		const [latitude, longitude] = coordinatesString.split(",").map(Number);
		if (isNaN(latitude) || isNaN(longitude)) return null;
		return { latitude, longitude };
	};

	// Debounced filter update: update key to force JobList remount/refetch
	// (Optional: If you want to debounce, you can use a useEffect with a timeout)

	return (
		<div className="flex w-full gap-8 mx-auto max-w-7xl py-6 px-4">
			<div className="sticky top-20 self-start">
				<FilterSidebar values={sidebarFilters} onChange={setFilters} />
			</div>
			<div className="flex-1">
				<JobList
					rootQuery={data}
					searchTerm={filters.speciality || null}
					coordinates={parseCoordinates(filters.coordinates)}
					proximityKm={filters.proximityKm}
					minExperience={filters.minExperience ?? null}
					maxExperience={filters.maxExperience ?? null}
					minSalary={filters.minSalary ?? null}
					maxSalary={filters.maxSalary ?? null}
				/>
			</div>
		</div>
	);
}

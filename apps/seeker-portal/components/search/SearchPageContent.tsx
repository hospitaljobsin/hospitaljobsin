import type { SearchPageContent_query$key } from "@/__generated__/SearchPageContent_query.graphql";
import pageSearchQuery, {
	type pageSearchQuery as pageSearchQueryType,
} from "@/__generated__/pageSearchQuery.graphql";
import { useEffect, useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import JobList from "../landing/JobList";
import FilterSidebar, { type FilterValues } from "./FilterSidebar";

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

const DEFAULT_FILTERS: FilterValues = {
	speciality: "",
	minExperience: 0,
	maxExperience: 0,
	minSalary: 0,
	maxSalary: 0,
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
	const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
	const [jobListKey, setJobListKey] = useState(0);

	// Debounced filter update: update key to force JobList remount/refetch
	useEffect(() => {
		const timeout = setTimeout(() => {
			setJobListKey((k) => k + 1);
		}, 300);
		return () => clearTimeout(timeout);
	}, [filters]);

	return (
		<div className="flex w-full gap-8 mx-auto max-w-7xl py-6 px-4">
			<div className="sticky top-20 self-start">
				<FilterSidebar values={filters} onChange={setFilters} />
			</div>
			<div className="flex-1">
				<JobList
					key={jobListKey}
					rootQuery={data}
					searchTerm={filters.speciality || null}
					coordinates={
						filters.coordinates ? JSON.parse(`[${filters.coordinates}]`) : null
					}
					proximityKm={filters.proximityKm}
				/>
			</div>
		</div>
	);
}

'use client';
import type PageSearchViewQueryNode from '@/__generated__/pageSearchViewQuery.graphql';
import type { pageSearchViewQuery } from '@/__generated__/pageSearchViewQuery.graphql';
import PageSearchViewQuery from '@/__generated__/pageSearchViewQuery.graphql';
import type { SearchViewClientComponentFragment$key } from '@/__generated__/SearchViewClientComponentFragment.graphql';
import type { FilterValues } from '@/components/search/FilterSidebar';
import SearchView from '@/components/search/SearchView';
import { FILTER_DEFAULTS } from '@/lib/constants';
import type { SerializablePreloadedQuery } from '@/lib/relay/serializablePreloadedQuery';
import useSerializablePreloadedQuery from '@/lib/relay/useSerializablePreloadedQuery';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { graphql, useFragment, usePreloadedQuery, useRelayEnvironment } from 'react-relay';

type Props = {
	preloadedQuery: SerializablePreloadedQuery<typeof PageSearchViewQueryNode, pageSearchViewQuery>;
	location: string | undefined;
};

export const SearchViewClientComponentFragment = graphql`
 fragment SearchViewClientComponentFragment on Query @argumentDefinitions(
		searchTerm: { type: "String" }
		minExperience: { type: "Int" }
		minSalary: { type: "Int" }
		maxSalary: { type: "Int" }
		proximityKm: { type: "Float" }
		location: { type: "String" }
		workMode: { type: "[JobWorkModeFilter!]!" }
		jobType: { type: "[JobTypeFilter!]!" }
		sortBy: { type: "JobSearchSortBy!" }
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

// Use FilterValues from FilterSidebar instead of defining Filters here

export default function SearchViewClientComponent({ preloadedQuery, location }: Props) {
	const [filters, setFilters] = useQueryStates(
		{
			minExperience: parseAsInteger,
			maxExperience: parseAsInteger,
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
	const queryRef = useSerializablePreloadedQuery<typeof PageSearchViewQueryNode, pageSearchViewQuery>(
		environment,
		preloadedQuery,
		'store-or-network'
	);

	const data = usePreloadedQuery(PageSearchViewQuery, queryRef);

	const fragmentKey = useFragment<SearchViewClientComponentFragment$key>(SearchViewClientComponentFragment, data);

	return (
		<SearchView
			location={location || null}
			speciality={null} // No speciality in main search page
			fragmentKey={fragmentKey}
			filters={filters as FilterValues}
			setFilters={setFilters as (filters: FilterValues | ((prevFilters: FilterValues) => FilterValues)) => void}
		/>
	);
}

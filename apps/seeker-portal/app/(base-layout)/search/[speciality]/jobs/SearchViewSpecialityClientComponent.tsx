'use client';

import type { SearchViewSpecialityClientComponentFragment$key } from '@/__generated__/SearchViewSpecialityClientComponentFragment.graphql';
import type PageSearchSpecialityViewQueryNode from '@/__generated__/pageSearchSpecialityViewQuery.graphql';
import type { pageSearchSpecialityViewQuery } from '@/__generated__/pageSearchSpecialityViewQuery.graphql';
import PageSearchSpecialityViewQuery from '@/__generated__/pageSearchSpecialityViewQuery.graphql';
import SearchView from '@/components/search/SearchView';
import { FILTER_DEFAULTS } from '@/lib/constants';
import type { SerializablePreloadedQuery } from '@/lib/relay/serializablePreloadedQuery';
import useSerializablePreloadedQuery from '@/lib/relay/useSerializablePreloadedQuery';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { graphql, useFragment, usePreloadedQuery, useRelayEnvironment } from 'react-relay';

type Props = {
	preloadedQuery: SerializablePreloadedQuery<typeof PageSearchSpecialityViewQueryNode, pageSearchSpecialityViewQuery>;
	speciality: string | undefined;
};

export const SearchViewSpecialityClientComponentFragment = graphql`
 fragment SearchViewSpecialityClientComponentFragment on Query @argumentDefinitions(
		searchTerm: { type: "String" }
		minExperience: { type: "Int" }
		minSalary: { type: "Int" }
		maxSalary: { type: "Int" }
		proximityKm: { type: "Float" }
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
			workMode: $workMode
			jobType: $jobType
			sortBy: $sortBy
		)
	}
`;

export type Filters = {
	minExperience?: number | null;
	maxExperience?: number | null;
	minSalary?: number | null;
	maxSalary?: number | null;
	proximityKm: number;
	workMode: string[];
	jobType: string[];
	sortBy: string;
};

export default function SearchViewClientComponent({ preloadedQuery, speciality }: Props) {
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
	const queryRef = useSerializablePreloadedQuery<typeof PageSearchSpecialityViewQueryNode, pageSearchSpecialityViewQuery>(
		environment,
		preloadedQuery,
		'store-or-network'
	);

	const data = usePreloadedQuery(PageSearchSpecialityViewQuery, queryRef);

	const fragmentKey = useFragment<SearchViewSpecialityClientComponentFragment$key>(SearchViewSpecialityClientComponentFragment, data);

	return <SearchView speciality={speciality || null} location={null} fragmentKey={fragmentKey} filters={filters} setFilters={setFilters} />;
}

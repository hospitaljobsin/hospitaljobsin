'use client';

import type { SearchViewLocationSpecialityClientComponentFragment$key } from '@/__generated__/SearchViewLocationSpecialityClientComponentFragment.graphql';
import type PageSearchLocationSpecialityViewQueryNode from '@/__generated__/pageSearchLocationSpecialityViewQuery.graphql';
import type { pageSearchLocationSpecialityViewQuery } from '@/__generated__/pageSearchLocationSpecialityViewQuery.graphql';
import PageSearchLocationSpecialityViewQuery from '@/__generated__/pageSearchLocationSpecialityViewQuery.graphql';
import SearchView from '@/components/search/SearchView';
import { FILTER_DEFAULTS } from '@/lib/constants';
import type { SerializablePreloadedQuery } from '@/lib/relay/serializablePreloadedQuery';
import useSerializablePreloadedQuery from '@/lib/relay/useSerializablePreloadedQuery';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { graphql, useFragment, usePreloadedQuery, useRelayEnvironment } from 'react-relay';

type Props = {
	preloadedQuery: SerializablePreloadedQuery<typeof PageSearchLocationSpecialityViewQueryNode, pageSearchLocationSpecialityViewQuery>;
	speciality: string | undefined;
	location: string | undefined;
};

export const SearchViewLocationSpecialityClientComponentFragment = graphql`
 fragment SearchViewLocationSpecialityClientComponentFragment on Query @argumentDefinitions(
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

export default function SearchViewClientComponent({ preloadedQuery, speciality, location }: Props) {
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
	const queryRef = useSerializablePreloadedQuery<typeof PageSearchLocationSpecialityViewQueryNode, pageSearchLocationSpecialityViewQuery>(
		environment,
		preloadedQuery,
		'store-or-network'
	);

	const data = usePreloadedQuery(PageSearchLocationSpecialityViewQuery, queryRef);

	const fragmentKey = useFragment<SearchViewLocationSpecialityClientComponentFragment$key>(
		SearchViewLocationSpecialityClientComponentFragment,
		data
	);

	return (
		<SearchView
			speciality={speciality || null}
			location={location || null}
			fragmentKey={fragmentKey}
			filters={filters}
			setFilters={setFilters}
		/>
	);
}

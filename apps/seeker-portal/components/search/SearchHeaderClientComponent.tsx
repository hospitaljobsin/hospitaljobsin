'use client';
import type { SearchHeaderClientComponentQuery as SearchHeaderClientComponentQueryType } from '@/__generated__/SearchHeaderClientComponentQuery.graphql';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import SearchHeader from './SearchHeader';

const SearchHeaderClientComponentQuery = graphql`
  query SearchHeaderClientComponentQuery {
    ...SearchHeaderFragment
  }
`;

export default function SearchHeaderClientComponent({ searchTerm, location }: { searchTerm: string | null; location: string | null }) {
	const data = useLazyLoadQuery<SearchHeaderClientComponentQueryType>(
		SearchHeaderClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network' }
	);
	return <SearchHeader query={data} searchTerm={searchTerm} location={location} />;
}

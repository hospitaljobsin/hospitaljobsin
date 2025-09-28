'use client';
import type { LanguagesClientComponentQuery as LanguagesClientComponentQueryType } from '@/__generated__/LanguagesClientComponentQuery.graphql';
import SummaryView from '@/components/resume-builder/LanguagesView';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const LanguagesClientComponentQuery = graphql`
query LanguagesClientComponentQuery {
		...LanguagesViewFragment
	}
`;

export default function LanguagesClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<LanguagesClientComponentQueryType>(
		environment,
		LanguagesClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SummaryView queryReference={queryReference} />
		</Suspense>
	);
}

'use client';
import type { SummaryClientComponentQuery as SummaryClientComponentQueryType } from '@/__generated__/SummaryClientComponentQuery.graphql';
import SummaryView from '@/components/resume-builder/SummaryView';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const SummaryClientComponentQuery = graphql`
query SummaryClientComponentQuery {
		...SummaryViewFragment
	}
`;

export default function SummaryClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<SummaryClientComponentQueryType>(
		environment,
		SummaryClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SummaryView queryReference={queryReference} />
		</Suspense>
	);
}

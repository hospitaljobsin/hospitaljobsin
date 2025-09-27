'use client';
import type { AdditionalClientComponentQuery as AdditionalClientComponentQueryType } from '@/__generated__/AdditionalClientComponentQuery.graphql';
import AdditionalView from '@/components/resume-builder/AdditionalView';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const AdditionalClientComponentQuery = graphql`
query AdditionalClientComponentQuery {
		...AdditionalViewFragment
	}
`;

export default function AdditionalClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<AdditionalClientComponentQueryType>(
		environment,
		AdditionalClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AdditionalView queryReference={queryReference} />
		</Suspense>
	);
}

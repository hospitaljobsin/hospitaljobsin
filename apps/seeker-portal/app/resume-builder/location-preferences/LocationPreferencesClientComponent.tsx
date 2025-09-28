'use client';
import type { LocationPreferencesClientComponentQuery as LocationPreferencesClientComponentQueryType } from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import SkillsView from '@/components/resume-builder/LocationPreferencesView';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const LocationPreferencesClientComponentQuery = graphql`
query LocationPreferencesClientComponentQuery {
		...LocationPreferencesViewFragment
	}
`;

export default function LocationPreferencesClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<LocationPreferencesClientComponentQueryType>(
		environment,
		LocationPreferencesClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SkillsView queryReference={queryReference} />
		</Suspense>
	);
}

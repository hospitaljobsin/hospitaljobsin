'use client';
import type { LocationPreferencesClientComponentQuery as LocationPreferencesClientComponentQueryType } from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import LocationPreferencesView from '@/components/resume-builder/location-preferences/LocationPreferencesView';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
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
		<Suspense fallback={<ResumeBuilderViewSkeleton />}>
			<LocationPreferencesView queryReference={queryReference} />
		</Suspense>
	);
}

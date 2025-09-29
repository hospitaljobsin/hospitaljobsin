'use client';
import type { LocationPreferencesClientComponentQuery as LocationPreferencesClientComponentQueryType } from '@/__generated__/LocationPreferencesClientComponentQuery.graphql';
import LocationPreferencesView from '@/components/resume-builder/location-preferences/LocationPreferencesView';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
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
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<LocationPreferencesView queryReference={queryReference} />
		</Suspense>
	);
}

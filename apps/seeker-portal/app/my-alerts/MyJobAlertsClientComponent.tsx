'use client';
import type { MyJobAlertsClientComponentQuery as MyJobAlertsClientComponentQueryType } from '@/__generated__/MyJobAlertsClientComponentQuery.graphql';
import MyJobAlertsView from '@/components/my-alerts/MyJobAlertsView';
import MyJobAlertsViewSkeleton from '@/components/my-alerts/MyJobAlertsViewSkeleton';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const MyJobAlertsClientComponentQuery = graphql`
  query MyJobAlertsClientComponentQuery {
    ...MyJobAlertsViewFragment
  }
`;

export default function MyJobAlertsClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<MyJobAlertsClientComponentQueryType>(
		environment,
		MyJobAlertsClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);
	return (
		<Suspense fallback={<MyJobAlertsViewSkeleton />}>
			<MyJobAlertsView queryReference={queryReference} />
		</Suspense>
	);
}

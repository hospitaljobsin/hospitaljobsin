'use client';
import type { LicensesClientComponentQuery as LicensesClientComponentQueryType } from '@/__generated__/LicensesClientComponentQuery.graphql';
import LicensesView from '@/components/resume-builder/licenses/LicensesView';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const LicensesClientComponentQuery = graphql`
query LicensesClientComponentQuery {
		...LicensesViewFragment
	}
`;

export default function LicensesClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<LicensesClientComponentQueryType>(
		environment,
		LicensesClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<ResumeBuilderViewSkeleton />}>
			<LicensesView queryReference={queryReference} />
		</Suspense>
	);
}

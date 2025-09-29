'use client';
import type { LicensesClientComponentQuery as LicensesClientComponentQueryType } from '@/__generated__/LicensesClientComponentQuery.graphql';
import LicensesView from '@/components/resume-builder/licenses/LicensesView';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
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
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<LicensesView queryReference={queryReference} />
		</Suspense>
	);
}

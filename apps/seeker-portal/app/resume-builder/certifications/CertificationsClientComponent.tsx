'use client';
import type { CertificationsClientComponentQuery as CertificationsClientComponentQueryType } from '@/__generated__/CertificationsClientComponentQuery.graphql';
import CertificationsView from '@/components/resume-builder/certifications/CertificationsView';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const CertificationsClientComponentQuery = graphql`
query CertificationsClientComponentQuery {
		...CertificationsViewFragment
	}
`;

export default function CertificationsClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<CertificationsClientComponentQueryType>(
		environment,
		CertificationsClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<ResumeBuilderViewSkeleton />}>
			<CertificationsView queryReference={queryReference} />
		</Suspense>
	);
}

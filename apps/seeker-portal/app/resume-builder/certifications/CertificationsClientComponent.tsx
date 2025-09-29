'use client';
import type { CertificationsClientComponentQuery as CertificationsClientComponentQueryType } from '@/__generated__/CertificationsClientComponentQuery.graphql';
import CertificationsView from '@/components/resume-builder/certifications/CertificationsView';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
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
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<CertificationsView queryReference={queryReference} />
		</Suspense>
	);
}

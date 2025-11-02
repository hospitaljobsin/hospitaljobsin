'use client';
import type { ResumeClientComponentQuery as ResumeClientComponentQueryType } from '@/__generated__/ResumeClientComponentQuery.graphql';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ResumeView from '@/components/resume-builder/resume/ResumeView';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const ResumeClientComponentQuery = graphql`
query ResumeClientComponentQuery {
        ...ResumeViewFragment
    }
`;

export default function ResumeClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<ResumeClientComponentQueryType>(
		environment,
		ResumeClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network' }
	);

	return (
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<ResumeView queryReference={queryReference} />
		</Suspense>
	);
}

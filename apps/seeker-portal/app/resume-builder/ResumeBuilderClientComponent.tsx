'use client';
import type { ResumeBuilderClientComponentQuery as ResumeBuilderClientComponentQueryType } from '@/__generated__/ResumeBuilderClientComponentQuery.graphql';
import ProfileViewSkeleton from '@/components/profile/ProfileViewSkeleton';
import { ResumeBuilderView } from '@/components/resume-builder/ResumeBuilderView';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const ResumeBuilderClientComponentQuery = graphql`
    query ResumeBuilderClientComponentQuery {
        ...ProfileViewFragment
    }
`;

export default function ResumeBuilderClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<ResumeBuilderClientComponentQueryType>(
		environment,
		ResumeBuilderClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<ProfileViewSkeleton />}>
			<ResumeBuilderView />
		</Suspense>
	);
}

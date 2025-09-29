'use client';
import type { WorkExperienceClientComponentQuery as WorkExperienceClientComponentQueryType } from '@/__generated__/WorkExperienceClientComponentQuery.graphql';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import WorkExperienceView from '@/components/resume-builder/work-experience/WorkExperienceView';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const WorkExperienceClientComponentQuery = graphql`
query WorkExperienceClientComponentQuery {
		...WorkExperienceViewFragment
	}
`;

export default function WorkExperienceClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<WorkExperienceClientComponentQueryType>(
		environment,
		WorkExperienceClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<WorkExperienceView queryReference={queryReference} />
		</Suspense>
	);
}

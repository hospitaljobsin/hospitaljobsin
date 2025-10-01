'use client';
import type { WorkExperienceClientComponentQuery as WorkExperienceClientComponentQueryType } from '@/__generated__/WorkExperienceClientComponentQuery.graphql';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
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
		{ fetchPolicy: 'store-or-network' }
	);

	return (
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<WorkExperienceView queryReference={queryReference} />
		</Suspense>
	);
}

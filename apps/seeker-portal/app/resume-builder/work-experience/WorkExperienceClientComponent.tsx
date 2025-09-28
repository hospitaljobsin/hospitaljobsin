'use client';
import type { WorkExperienceClientComponentQuery as WorkExperienceClientComponentQueryType } from '@/__generated__/WorkExperienceClientComponentQuery.graphql';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
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
		<Suspense fallback={<ResumeBuilderViewSkeleton />}>
			<WorkExperienceView queryReference={queryReference} />
		</Suspense>
	);
}

'use client';
import type { WorkExperienceClientComponentQuery as WorkExperienceClientComponentQueryType } from '@/__generated__/WorkExperienceClientComponentQuery.graphql';
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
		<Suspense fallback={<div>Loading...</div>}>
			<WorkExperienceView queryReference={queryReference} />
		</Suspense>
	);
}

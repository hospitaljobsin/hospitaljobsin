'use client';
import type { PersonalInfoClientComponentQuery as PersonalInfoClientComponentQueryType } from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import PersonalInfoView from '@/components/resume-builder/personal-info/PersonalInfoView';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const PersonalInfoClientComponentQuery = graphql`
query PersonalInfoClientComponentQuery {
		...PersonalInfoViewFragment
	}
`;

export default function PersonalInfoClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<PersonalInfoClientComponentQueryType>(
		environment,
		PersonalInfoClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<ResumeBuilderViewSkeleton />}>
			<PersonalInfoView queryReference={queryReference} />
		</Suspense>
	);
}

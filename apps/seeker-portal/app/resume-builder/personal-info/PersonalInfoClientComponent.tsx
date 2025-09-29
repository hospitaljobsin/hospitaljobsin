'use client';
import type { PersonalInfoClientComponentQuery as PersonalInfoClientComponentQueryType } from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import PersonalInfoView from '@/components/resume-builder/personal-info/PersonalInfoView';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
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
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<PersonalInfoView queryReference={queryReference} />
		</Suspense>
	);
}

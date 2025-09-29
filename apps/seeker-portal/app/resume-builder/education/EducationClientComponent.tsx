'use client';
import type { EducationClientComponentQuery as EducationClientComponentQueryType } from '@/__generated__/EducationClientComponentQuery.graphql';
import EducationView from '@/components/resume-builder/education/EducationView';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const EducationClientComponentQuery = graphql`
query EducationClientComponentQuery {
		...EducationViewFragment
	}
`;

export default function EducationClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<EducationClientComponentQueryType>(
		environment,
		EducationClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<EducationView queryReference={queryReference} />
		</Suspense>
	);
}

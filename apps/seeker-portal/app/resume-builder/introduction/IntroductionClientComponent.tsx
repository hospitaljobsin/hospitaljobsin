'use client';
import type { IntroductionClientComponentQuery as IntroductionClientComponentQueryType } from '@/__generated__/IntroductionClientComponentQuery.graphql';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import IntroductionView from '@/components/resume-builder/introduction/IntroductionView';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const IntroductionClientComponentQuery = graphql`
query IntroductionClientComponentQuery {
		...IntroductionViewFragment
	}
`;

export default function IntroductionClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<IntroductionClientComponentQueryType>(
		environment,
		IntroductionClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network' }
	);

	return (
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<IntroductionView queryReference={queryReference} />
		</Suspense>
	);
}

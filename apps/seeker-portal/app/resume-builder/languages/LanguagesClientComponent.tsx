'use client';
import type { LanguagesClientComponentQuery as LanguagesClientComponentQueryType } from '@/__generated__/LanguagesClientComponentQuery.graphql';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import LanguagesView from '@/components/resume-builder/languages/LanguagesView';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const LanguagesClientComponentQuery = graphql`
query LanguagesClientComponentQuery {
		...LanguagesViewFragment
	}
`;

export default function LanguagesClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<LanguagesClientComponentQueryType>(
		environment,
		LanguagesClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network' }
	);

	return (
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<LanguagesView queryReference={queryReference} />
		</Suspense>
	);
}

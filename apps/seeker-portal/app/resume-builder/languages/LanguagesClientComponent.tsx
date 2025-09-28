'use client';
import type { LanguagesClientComponentQuery as LanguagesClientComponentQueryType } from '@/__generated__/LanguagesClientComponentQuery.graphql';
import LanguagesView from '@/components/resume-builder/languages/LanguagesView';
import ResumeBuilderViewSkeleton from '@/components/resume-builder/ResumeBuilderViewSkeleton';
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
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<ResumeBuilderViewSkeleton />}>
			<LanguagesView queryReference={queryReference} />
		</Suspense>
	);
}

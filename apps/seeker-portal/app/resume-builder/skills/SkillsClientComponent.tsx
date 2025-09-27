'use client';
import type { SkillsClientComponentQuery as SkillsClientComponentQueryType } from '@/__generated__/SkillsClientComponentQuery.graphql';
import SkillsView from '@/components/resume-builder/SkillsView';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const SkillsClientComponentQuery = graphql`
query SkillsClientComponentQuery {
		...SkillsViewFragment
	}
`;

export default function SkillsClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<SkillsClientComponentQueryType>(
		environment,
		SkillsClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network', networkCacheConfig: { force: false } }
	);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SkillsView queryReference={queryReference} />
		</Suspense>
	);
}

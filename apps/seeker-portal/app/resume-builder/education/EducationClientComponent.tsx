'use client';
import type { EducationClientComponentQuery as EducationClientComponentQueryType } from '@/__generated__/EducationClientComponentQuery.graphql';
import EducationView from '@/components/resume-builder/EducationView';
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
		<Suspense fallback={<div>Loading...</div>}>
			<EducationView queryReference={queryReference} />
		</Suspense>
	);
}

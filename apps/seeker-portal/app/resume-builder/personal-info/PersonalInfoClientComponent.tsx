'use client';
import type { PersonalInfoClientComponentQuery as PersonalInfoClientComponentQueryType } from '@/__generated__/PersonalInfoClientComponentQuery.graphql';
import PersonalInfoView from '@/components/resume-builder/PersonalInfoView';
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
		<Suspense fallback={<div>Loading...</div>}>
			<PersonalInfoView queryReference={queryReference} />
		</Suspense>
	);
}

'use client';
import type { CareerProfileClientComponentQuery as CareerProfileClientComponentQueryType } from '@/__generated__/CareerProfileClientComponentQuery.graphql';
import CareerProfileView from '@/components/resume-builder/career-profile/CareerProfileView';
import ContentSkeleton from '@/components/resume-builder/ContentSkeleton';
import ResumeBuilderSharedLayout from '@/components/resume-builder/ResumeBuilderSharedLayout';
import { Suspense } from 'react';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import { graphql } from 'relay-runtime';

const CareerProfileClientComponentQuery = graphql`
query CareerProfileClientComponentQuery {
        ...CareerProfileViewFragment
    }
`;

export default function CareerProfileClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<CareerProfileClientComponentQueryType>(
		environment,
		CareerProfileClientComponentQuery,
		{},
		{ fetchPolicy: 'store-or-network' }
	);

	return (
		<Suspense
			fallback={<ResumeBuilderSharedLayout desktopComponent={() => <ContentSkeleton />} mobileComponent={() => <ContentSkeleton />} />}
		>
			<CareerProfileView queryReference={queryReference} />
		</Suspense>
	);
}

'use client';
import type { ResumeProgressClientComponentQuery as ResumeProgressClientComponentQueryType } from '@/__generated__/ResumeProgressClientComponentQuery.graphql';
import { Suspense } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import ResumeProgress from './ResumeProgress';
import ResumeProgressSkeleton from './ResumeProgressSkeleton';

const ResumeProgressClientComponentQuery = graphql`
	query ResumeProgressClientComponentQuery {
		...ResumeProgressFragment
	}
`;

export default function ResumeProgressClientComponent() {
	const data = useLazyLoadQuery<ResumeProgressClientComponentQueryType>(
		ResumeProgressClientComponentQuery,
		{},
		{
			fetchPolicy: 'store-or-network'
		}
	);
	return (
		<Suspense fallback={<ResumeProgressSkeleton />}>
			<ResumeProgress query={data} />
		</Suspense>
	);
}

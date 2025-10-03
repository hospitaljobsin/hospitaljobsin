'use client';
import { Suspense } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { JobListClientComponentQuery as JobListClientComponentQueryType } from '@/__generated__/JobListClientComponentQuery.graphql';
import JobList from './JobList';
import JobListSkeleton from './JobListSkeleton';

const JobListClientComponentQuery = graphql`
  query JobListClientComponentQuery {
    ...JobListFragment
  }
`;

export default function JobListClientComponent() {
	const data = useLazyLoadQuery<JobListClientComponentQueryType>(
		JobListClientComponentQuery,
		{},
		{
			fetchPolicy: 'store-or-network'
		}
	);

	return (
		<Suspense fallback={<JobListSkeleton />}>
			<JobList rootQuery={data} />
		</Suspense>
	);
}

'use client';
import { type ForwardedRef, Suspense, forwardRef } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { JobListClientComponentQuery as JobListClientComponentQueryType } from '@/__generated__/JobListClientComponentQuery.graphql';
import JobList, { type JobListHandle } from './JobList';
import JobListSkeleton from './JobListSkeleton';

const JobListClientComponentQuery = graphql`
  query JobListClientComponentQuery {
    ...JobListFragment
  }
`;

export type { JobListHandle };

function JobListClientComponent(_props: object, ref: ForwardedRef<JobListHandle>) {
	const data = useLazyLoadQuery<JobListClientComponentQueryType>(
		JobListClientComponentQuery,
		{},
		{
			fetchPolicy: 'store-or-network'
		}
	);

	return (
		<Suspense fallback={<JobListSkeleton />}>
			<JobList ref={ref} rootQuery={data} />
		</Suspense>
	);
}

export default forwardRef(JobListClientComponent);

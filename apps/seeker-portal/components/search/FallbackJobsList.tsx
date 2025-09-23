import type { FallbackJobsListAccountFragment$key } from '@/__generated__/FallbackJobsListAccountFragment.graphql';
import type { FallbackJobsListFragment$key } from '@/__generated__/FallbackJobsListFragment.graphql';
import type { FallbackJobsListQuery as FallbackJobsListQueryType } from '@/__generated__/FallbackJobsListQuery.graphql';
import { useFragment, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { WindowVirtualizer } from 'virtua';
import Job from '../landing/Job';
import JobListSkeleton from '../landing/JobListSkeleton';

const FallbackJobsListQuery = graphql`
query FallbackJobsListQuery {
  ...FallbackJobsListFragment
}
`;

const FallbackJobsListFragment = graphql`
fragment FallbackJobsListFragment on Query @refetchable(queryName: "FallbackJobsListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 25 }

  ) {
  jobs(workMode: [], jobType: [], sortBy: UPDATED_AT, first: $count, after: $cursor) @connection(key: "FallbackJobsListFragment_jobs") {
    edges {
      node {
        id
        ...JobFragment
      }
    }
    pageInfo {
        endCursor
        hasNextPage
    }
  }
}
`;

const FallbackJobsListAccountFragment = graphql`
  fragment FallbackJobsListAccountFragment on Account {
    ...JobControlsAuthFragment
  }
`;

export default function FallbackJobsList({ viewer }: { viewer: FallbackJobsListAccountFragment$key }) {
	const accountData = useFragment(FallbackJobsListAccountFragment, viewer);
	const root = useLazyLoadQuery<FallbackJobsListQueryType>(FallbackJobsListQuery, {}, { fetchPolicy: 'store-or-network' });
	const { data, loadNext, isLoadingNext } = usePaginationFragment<FallbackJobsListQueryType, FallbackJobsListFragment$key>(
		FallbackJobsListFragment,
		root
	);
	const allJobEdges = data?.jobs?.edges ?? [];
	const hasNextPage = data.jobs.pageInfo.hasNextPage;
	// Handle infinite scroll when reaching the end
	const handleScrollEnd = () => {
		if (hasNextPage && !isLoadingNext) {
			loadNext(25);
		}
	};
	return (
		<div className='w-full h-full flex flex-col gap-6'>
			<p className='text-foreground-400 text-sm'>Meanwhile, here are the latest jobs you might like.</p>
			<div className='w-full h-full overflow-y-auto'>
				<WindowVirtualizer
					onScrollEnd={handleScrollEnd}
					ssrCount={10}
					count={hasNextPage ? allJobEdges.length + 1 : allJobEdges.length}
					overscan={5}
					onScroll={() => {
						console.log('SCROLLING>>>>');
					}}
					shift={false}
					itemSize={350}
				>
					{index => {
						const jobEdge = allJobEdges[index];
						if (index === allJobEdges.length) {
							return <JobListSkeleton />;
						}

						return (
							<div key={jobEdge.node.id} className='pb-4 sm:pb-6'>
								<Job job={jobEdge.node} authQueryRef={accountData} />
							</div>
						);
					}}
				</WindowVirtualizer>
			</div>
		</div>
	);
}

'use client';
import type { LandingClientComponentQuery } from '@/__generated__/LandingClientComponentQuery.graphql';
import type { TrendingJobListFragment$key } from '@/__generated__/TrendingJobListFragment.graphql';
import type { TrendingJobListInternalFragment$key } from '@/__generated__/TrendingJobListInternalFragment.graphql';
import { FlameIcon } from 'lucide-react';
import { useTransition } from 'react';
import { useFragment, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import AuxiliaryJob from './AuxiliaryJob';
import AuxiliaryJobListSkeleton from './AuxiliaryJobsListSkeleton';

const TrendingJobListFragment = graphql`
fragment TrendingJobListFragment on Query {
    ...TrendingJobListInternalFragment
    viewer {
        ...JobControlsAuthFragment
    }
}
`;

const TrendingJobListInternalFragment = graphql`
  fragment TrendingJobListInternalFragment on Query
  @refetchable(queryName: "TrendingJobListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  ){
    trendingJobs(after: $cursor, first: $count)
      @connection(key: "TrendingJobListFragment_trendingJobs") {
      edges {
        node {
          id
          ...AuxiliaryJobFragment
          ...JobControlsFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: TrendingJobListFragment$key;
	jobDetailId: string;
};

export default function TrendingJobList({ rootQuery, jobDetailId }: Props) {
	const [_isPending, startTransition] = useTransition();
	const root = useFragment(TrendingJobListFragment, rootQuery);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<LandingClientComponentQuery, TrendingJobListInternalFragment$key>(
		TrendingJobListInternalFragment,
		root
	);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
		const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

		if (isNearBottom && data.trendingJobs.pageInfo.hasNextPage && !isLoadingNext) {
			startTransition(() => {
				loadNext(25);
			});
		}
	};

	if (data.trendingJobs.edges.length === 0 && !data.trendingJobs.pageInfo.hasNextPage) {
		return null;
	}

	return (
		<div className='h-full flex flex-col gap-4 w-full lg:w-auto'>
			<h2 className='font-medium text-foreground-600 flex items-center gap-2'>
				<FlameIcon size={20} /> Trending Jobs
			</h2>
			<div
				className='w-full scroll-smooth h-full overflow-y-auto'
				style={{
					scrollbarWidth: 'none'
				}}
				onScroll={handleScroll}
			>
				{data.trendingJobs.edges.map(jobEdge =>
					jobEdge.node.id !== jobDetailId ? (
						<div key={jobEdge.node.id} className='pb-2 sm:pb-4'>
							<AuxiliaryJob job={jobEdge.node} />
						</div>
					) : null
				)}
				{data.trendingJobs.pageInfo.hasNextPage && (
					<div className='pb-4 sm:pb-6'>
						<AuxiliaryJobListSkeleton />
					</div>
				)}
			</div>
		</div>
	);
}

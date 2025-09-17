import type { TrendingJobListFragment$key } from '@/__generated__/TrendingJobListFragment.graphql';
import { FlameIcon } from 'lucide-react';
import { graphql, readInlineData } from 'relay-runtime';
import AuxiliaryJob from './AuxiliaryJob';

const TrendingJobListFragment = graphql`
  fragment TrendingJobListFragment on Query
  @refetchable(queryName: "TrendingJobListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  ) @inline {
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
	const data = readInlineData(TrendingJobListFragment, rootQuery);

	const trendingJobsExcludingCurrent = data.trendingJobs.edges.filter(jobEdge => jobEdge.node.id !== jobDetailId);

	if (trendingJobsExcludingCurrent.length === 0 && !data.trendingJobs.pageInfo.hasNextPage) {
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
			>
				{trendingJobsExcludingCurrent.map(jobEdge => (
					<div key={jobEdge.node.id} className='pb-2 sm:pb-4'>
						<AuxiliaryJob job={jobEdge.node} />
					</div>
				))}
			</div>
		</div>
	);
}

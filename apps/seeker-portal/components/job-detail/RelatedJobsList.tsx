import type { RelatedJobsListFragment$key } from '@/__generated__/RelatedJobsListFragment.graphql';
import { SearchIcon } from 'lucide-react';
import { graphql, readInlineData } from 'relay-runtime';
import RelatedJob from './AuxiliaryJob';
import RelatedJobsListSkeleton from './AuxiliaryJobsListSkeleton';

const RelatedJobsListFragment = graphql`
  fragment RelatedJobsListFragment on Job
  @refetchable(queryName: "RelatedJobsListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 4 }
  ) @inline {
    relatedJobs(after: $cursor, first: $count)
      @connection(key: "RelatedJobsListFragment_relatedJobs") {
      edges {
        node {
          id
          ...AuxiliaryJobFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export default function RelatedJobsList({ job }: { job: RelatedJobsListFragment$key }) {
	const data = readInlineData(RelatedJobsListFragment, job);

	const handleScroll = () => {};

	if (data.relatedJobs.edges.length === 0 && !data.relatedJobs.pageInfo.hasNextPage) {
		return null;
	}

	return (
		<div className='h-full flex flex-col gap-4 w-full lg:w-auto'>
			<h2 className='font-medium text-foreground-600 flex items-center gap-2'>
				<SearchIcon size={20} /> Related Jobs
			</h2>
			<div
				className='w-full scroll-smooth h-full overflow-y-auto'
				style={{
					scrollbarWidth: 'none'
				}}
				onScroll={handleScroll}
			>
				{data.relatedJobs.edges.map(jobEdge => (
					<div key={jobEdge.node.id} className='pb-2 sm:pb-4'>
						<RelatedJob job={jobEdge.node} />
					</div>
				))}
				{data.relatedJobs.pageInfo.hasNextPage && (
					<div className='pb-4 sm:pb-6'>
						<RelatedJobsListSkeleton />
					</div>
				)}
			</div>
		</div>
	);
}

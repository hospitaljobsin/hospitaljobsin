'use client';
import AppliedJobsClientComponentQuery, {
	type AppliedJobsClientComponentQuery as AppliedJobsClientComponentQueryType
} from '@/__generated__/AppliedJobsClientComponentQuery.graphql';
import type { AppliedJobsViewFragment$key } from '@/__generated__/AppliedJobsViewFragment.graphql';
import MyJobsHeader from '@/components/layout/MyJobsHeader';
import { type PreloadedQuery, graphql, useFragment, usePreloadedQuery } from 'react-relay';
import AppliedJobsList from './AppliedJobsList';

const AppliedJobsViewFragment = graphql`
  fragment AppliedJobsViewFragment on Query {
	...MyJobsHeaderFragment
    ...AppliedJobsListFragment
  }
`;

export default function AppliedView({ queryReference }: { queryReference: PreloadedQuery<AppliedJobsClientComponentQueryType> }) {
	const query = usePreloadedQuery(AppliedJobsClientComponentQuery, queryReference);
	const data = useFragment<AppliedJobsViewFragment$key>(AppliedJobsViewFragment, query);

	return (
		<div className='w-full h-full flex flex-col'>
			<MyJobsHeader query={data} />
			<div className='w-full mx-auto bg-background-600 h-full'>
				<div className='w-full px-5 max-w-7xl mx-auto h-full'>
					<div className='w-full flex flex-col h-full py-8'>
						<AppliedJobsList rootQuery={data} />
					</div>
				</div>
			</div>
		</div>
	);
}

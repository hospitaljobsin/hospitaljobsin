'use client';
import SavedJobsClientComponentQuery, {
	type SavedJobsClientComponentQuery as SavedJobsClientComponentQueryType
} from '@/__generated__/SavedJobsClientComponentQuery.graphql';
import type { SavedJobsViewFragment$key } from '@/__generated__/SavedJobsViewFragment.graphql';
import MyJobsHeader from '@/components/layout/MyJobsHeader';
import { type PreloadedQuery, graphql, useFragment, usePreloadedQuery } from 'react-relay';
import SavedJobsList from './SavedJobsList';

const SavedJobsViewFragment = graphql`
  fragment SavedJobsViewFragment on Query {
	...MyJobsHeaderFragment
    ...SavedJobsListFragment
  }
`;

export default function SavedView({ queryReference }: { queryReference: PreloadedQuery<SavedJobsClientComponentQueryType> }) {
	const query = usePreloadedQuery(SavedJobsClientComponentQuery, queryReference);
	const data = useFragment<SavedJobsViewFragment$key>(SavedJobsViewFragment, query);

	return (
		<div className='w-full h-full flex flex-col'>
			<MyJobsHeader query={data} />
			<div className='w-full mx-auto bg-background-600 h-full'>
				<div className='w-full px-5 max-w-7xl mx-auto h-full'>
					<div className='w-full flex flex-col h-full py-8'>
						<SavedJobsList rootQuery={data} />
					</div>
				</div>
			</div>
		</div>
	);
}

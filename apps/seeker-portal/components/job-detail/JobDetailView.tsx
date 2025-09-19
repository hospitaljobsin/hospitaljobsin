'use client';
import type { JobDetailViewFragment$key } from '@/__generated__/JobDetailViewFragment.graphql';
import type { TrendingJobListFragment$key } from '@/__generated__/TrendingJobListFragment.graphql';
import useJobImpressionTracker from '@/lib/hooks/useJobImpressionTracker';
import dynamic from 'next/dynamic';
import { graphql, readInlineData } from 'react-relay';
import invariant from 'tiny-invariant';
import DashboardHeaderSkeleton from '../layout/DashboardHeaderSkeleton';
import JobDetails from './JobDetails';
import RelatedJobsList from './RelatedJobsList';
import TrendingJobList from './TrendingJobList';

const DashboardHeaderClientComponent = dynamic(() => import('../layout/DashboardHeaderClientComponent'), {
	ssr: false,
	loading: () => <DashboardHeaderSkeleton />
});

const JobDetailViewFragment = graphql`
 fragment JobDetailViewFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) @inline {
		...JobDetailsFragment @arguments(slug: $slug, jobSlug: $jobSlug)
		organization(slug: $slug) {
		__typename
		... on Organization {
			job(slug: $jobSlug) {
				__typename
				... on Job {
					id
					...RelatedJobsListFragment
				}
			}
		}
	}
  }
`;

export default function JobDetailView(props: { rootQuery: JobDetailViewFragment$key; trendingData: TrendingJobListFragment$key }) {
	const query = readInlineData(JobDetailViewFragment, props.rootQuery);
	invariant(query.organization.__typename === 'Organization', "Expected 'Organization' node type.");
	invariant(query.organization.job.__typename === 'Job', "Expected 'Job' node type.");

	useJobImpressionTracker(query.organization.job.id);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeaderClientComponent animate={false} />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto'>
					<div className='py-8 w-full h-full flex flex-col lg:flex-row items-start gap-6'>
						<JobDetails rootQuery={query} />
						<div className='flex h-full flex-col gap-6 w-full lg:w-80 xl:w-96 shrink-0'>
							<RelatedJobsList job={query.organization.job} />
							<TrendingJobList rootQuery={props.trendingData} jobDetailId={query.organization.job.id} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

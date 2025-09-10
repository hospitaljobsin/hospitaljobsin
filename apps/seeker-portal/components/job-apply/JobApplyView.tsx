import type { JobApplyViewFragment$key } from '@/__generated__/JobApplyViewFragment.graphql';
import { graphql, useFragment } from 'react-relay';
import DashboardHeader from '../layout/DashboardHeader';
import JobApplicationDetails from './JobApplicationDetails';
import JobApplyForm from './JobApplyForm';
import ProfilePreview from './ProfileReview';

const JobApplyViewFragment = graphql`
 fragment JobApplyViewFragment on Query @argumentDefinitions(
      slug: { type: "String!"}
      jobSlug: { type: "String!"}
    ) {
      ...DashboardHeaderFragment
      organization(slug: $slug) {
        __typename
        ... on Organization {
          job(slug: $jobSlug) {
            __typename
            ... on Job {
			isApplied
			externalApplicationUrl
			isVisible
              ...JobApplyFormFragment
              ...JobApplicationDetailsFragment
              ...JobDetailsInternalFragment
            }

          }
        }
      }
      viewer {
        __typename
        ... on Account {
          ...ProfileReviewFragment
		  profile @required(action: THROW) {
					isComplete
				}
        }
      }
  }
`;

export default function JobApplyView(props: { rootQuery: JobApplyViewFragment$key }) {
	const query = useFragment(JobApplyViewFragment, props.rootQuery);

	// only users who have not applied can access this page
	if (
		query.organization.__typename !== 'Organization' ||
		query.organization.job.__typename !== 'Job' ||
		!query.organization.job.isVisible ||
		query.organization.job.isApplied ||
		query.organization.job.externalApplicationUrl !== null ||
		query.viewer.__typename !== 'Account' ||
		!query.viewer.profile?.isComplete
	) {
		// TODO: make this better
		return <h1>not found</h1>;
	}

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={query} animate={false} />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto'>
					<div className='py-8 w-full h-full flex flex-col items-center gap-6'>
						<JobApplicationDetails job={query.organization.job} />
						<ProfilePreview account={query.viewer} />
						<JobApplyForm rootQuery={query.organization.job} />
					</div>
				</div>
			</div>
		</div>
	);
}

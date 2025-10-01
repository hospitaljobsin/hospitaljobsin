import type { JobApplyViewFragment$key } from '@/__generated__/JobApplyViewFragment.graphql';
import links from '@/lib/links';
import { Button } from '@heroui/react';
import { SearchX } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { graphql, useFragment } from 'react-relay';
import DashboardHeader from '../layout/DashboardHeader';
import CompleteProfileDrawer from './complete-profile/CompleteProfileDrawer';
import JobApplicationDetails from './JobApplicationDetails';
import JobApplyForm, { type JobApplyFormRef } from './JobApplyForm';
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
		  ...CompleteProfileDrawerFragment
		  profile @required(action: THROW) {
					isComplete
				}
        }
      }
  }
`;

export default function JobApplyView(props: { rootQuery: JobApplyViewFragment$key }) {
	const query = useFragment(JobApplyViewFragment, props.rootQuery);
	const [showCompleteProfileDrawer, setShowCompleteProfileDrawer] = useState(false);
	const jobApplyFormRef = useRef<JobApplyFormRef | null>(null);

	const handleProfileIncomplete = () => {
		setShowCompleteProfileDrawer(true);
	};

	const handleApplyAfterProfileComplete = () => {
		// This will be called when profile completion is done and user wants to apply
		setShowCompleteProfileDrawer(false);
		// Trigger the job application directly
		if (jobApplyFormRef.current) {
			jobApplyFormRef.current.triggerDirectApply();
		}
	};

	// only users who have not applied can access this page
	if (
		query.organization.__typename !== 'Organization' ||
		query.organization.job.__typename !== 'Job' ||
		!query.organization.job.isVisible ||
		query.organization.job.isApplied ||
		query.organization.job.externalApplicationUrl !== null ||
		query.viewer.__typename !== 'Account'
	) {
		return (
			<>
				<DashboardHeader query={query} animate={false} />
				<div className='flex flex-col items-center justify-center w-full h-full py-32 px-4 text-center gap-6'>
					<div className='flex items-center justify-center w-20 h-20 rounded-full bg-danger-50 dark:bg-danger-900/20 mb-2'>
						<SearchX className='w-10 h-10 text-danger-500 dark:text-danger-400' />
					</div>
					<h1 className='text-2xl font-medium text-foreground-900'>404 Page Not Found</h1>
					<p className='text-foreground-600 max-w-md mx-auto'>
						Sorry, we couldn't find the page you're looking for. It may have been removed or you may not be authorized.
					</p>
					<Link href={links.landing} passHref>
						<Button variant='solid' className='mt-4'>
							Back to Home
						</Button>
					</Link>
				</div>
			</>
		);
	}

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={query} animate={false} />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto'>
					<div className='py-8 w-full h-full flex flex-col items-center gap-6'>
						<JobApplicationDetails job={query.organization.job} />
						<ProfilePreview account={query.viewer} />
						<JobApplyForm
							ref={jobApplyFormRef}
							rootQuery={query.organization.job}
							isProfileComplete={query.viewer.profile.isComplete}
							onProfileIncomplete={handleProfileIncomplete}
						/>
					</div>
					<CompleteProfileDrawer
						isOpen={showCompleteProfileDrawer}
						onClose={() => setShowCompleteProfileDrawer(false)}
						account={query.viewer}
						onApply={handleApplyAfterProfileComplete}
					/>
				</div>
			</div>
		</div>
	);
}

import { Button } from '@heroui/react';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';
import type { JobApplyButtonFragment$key } from '@/__generated__/JobApplyButtonFragment.graphql';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import JobApplicationFlow from '../job-apply/JobApplicationFlow';

const JobApplyButtonFragment = graphql`
  fragment JobApplyButtonFragment on Query  @argumentDefinitions(
    slug: { type: "String!" }
    jobSlug: { type: "String!", }
  ){
    organization(slug: $slug) {
        __typename
        ... on Organization {
			slug
            job (slug: $jobSlug) {
                __typename
                ... on Job {
                    id
                    slug
                    externalApplicationUrl
                    isApplied
                    ...JobApplicationFlowJobFragment
            }
        }

    }
  }
  viewer {
    __typename
    ... on Account {
        profile @required(action: THROW) {
            isComplete
        }
        ...JobApplicationFlowFragment
    }
  }
}
  `;

export default function JobApplyButton({ query }: { query: JobApplyButtonFragment$key }) {
	const root = useFragment(JobApplyButtonFragment, query);

	invariant(root.organization.__typename === 'Organization', "Expected 'Organization' node type");

	invariant(root.organization.job.__typename === 'Job', "Expected 'Job' node type");

	const isAuthenticated = root.viewer.__typename === 'Account';

	const data = root.organization.job;
	if (data.externalApplicationUrl !== null) {
		return (
			<Button
				as={Link}
				href={data.externalApplicationUrl}
				size='lg'
				color='primary'
				className='w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3'
				target='_blank'
				rel='noopener noreferrer'
				isDisabled={data.isApplied}
				startContent={<ExternalLinkIcon size={16} />}
			>
				{data.isApplied ? 'Already Applied' : 'Apply now'}
			</Button>
		);
	}

	if (!isAuthenticated) {
		return (
			<Button
				as={Link}
				href={links.login(`${env.NEXT_PUBLIC_URL}${links.jobDetail(root.organization.slug, root.organization.job.slug)}`)}
				size='lg'
				color='primary'
				className='w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3'
			>
				Log In to Apply
			</Button>
		);
	}

	return (
		<JobApplicationFlow account={root.viewer} job={root.organization.job}>
			{({ onApply }) => (
				<Button
					onPress={onApply}
					size='lg'
					color='primary'
					className='w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3'
					isDisabled={data.isApplied}
				>
					{data.isApplied ? 'Already Applied' : 'Apply now'}
				</Button>
			)}
		</JobApplicationFlow>
	);
}

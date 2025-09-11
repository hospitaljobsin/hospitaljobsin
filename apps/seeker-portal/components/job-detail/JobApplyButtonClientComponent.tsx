import type { JobApplyButtonClientComponentQuery as JobApplyButtonClientComponentQueryType } from '@/__generated__/JobApplyButtonClientComponentQuery.graphql';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import { Button, Tooltip } from '@heroui/react';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';

const JobApplyButtonClientComponentQuery = graphql`
  query JobApplyButtonClientComponentQuery($slug: String!, $jobSlug: String!) {
    organization(slug: $slug) {
        __typename
        ... on Organization {
            job (slug: $jobSlug) {
                __typename
                ... on Job {
                    id
                    slug
                    externalApplicationUrl
                    isApplied
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
    }
  }
}
  `;
export default function JobApplyButtonClientComponent({ slug, jobSlug }: { slug: string; jobSlug: string }) {
	const root = useLazyLoadQuery<JobApplyButtonClientComponentQueryType>(JobApplyButtonClientComponentQuery, {
		slug,
		jobSlug
	});

	invariant(root.organization.__typename === 'Organization', "Expected 'Organization' node type");

	invariant(root.organization.job.__typename === 'Job', "Expected 'Job' node type");
	const isAuthenticated = root.viewer.__typename === 'Account';
	const isProfileIncomplete = isAuthenticated && !root.viewer.profile.isComplete;

	const data = root.organization.job;
	return (
		<>
			{data.externalApplicationUrl !== null ? (
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
			) : isProfileIncomplete && !data.isApplied ? (
				<Tooltip
					showArrow
					content={
						<div className='px-1 py-2'>
							<div className='text-sm'>
								<Link href={links.profile}>Complete your profile</Link> to apply for this job
							</div>
						</div>
					}
				>
					<span className='w-full sm:w-auto'>
						<Button
							as={Link}
							href={links.jobDetailApply(slug, jobSlug)}
							size='lg'
							color='primary'
							className='w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3'
							isDisabled
						>
							Apply now
						</Button>
					</span>
				</Tooltip>
			) : (
				<Button
					as={Link}
					href={
						isAuthenticated
							? links.jobDetailApply(slug, jobSlug)
							: links.login(`${env.NEXT_PUBLIC_URL}${links.jobDetailApply(slug, jobSlug)}`)
					}
					size='lg'
					color='primary'
					className='w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3'
					isDisabled={data.isApplied}
				>
					{!isAuthenticated ? 'Log In to Apply' : data.isApplied ? 'Already Applied' : 'Apply now'}
				</Button>
			)}
		</>
	);
}

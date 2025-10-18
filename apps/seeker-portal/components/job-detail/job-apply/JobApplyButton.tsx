import { Button } from '@heroui/react';
import { Clock, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
                    expiresAt
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

function getTimeRemaining(expiresAt: string | null) {
	if (!expiresAt) return null;
	const now = new Date();
	const expiry = new Date(expiresAt);
	const diff = expiry.getTime() - now.getTime();
	if (diff <= 0) return { expired: true, text: 'Expired' };
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	if (days > 0) return { expired: false, text: `${days}d left`, urgent: days <= 3 };
	return { expired: false, text: `${hours}h left`, urgent: true };
}

export default function JobApplyButton({ query, sticky = false }: { query: JobApplyButtonFragment$key; sticky?: boolean }) {
	const root = useFragment(JobApplyButtonFragment, query);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	invariant(root.organization.__typename === 'Organization', "Expected 'Organization' node type");

	invariant(root.organization.job.__typename === 'Job', "Expected 'Job' node type");

	const isAuthenticated = root.viewer.__typename === 'Account';

	const data = root.organization.job;
	const timeRemaining = getTimeRemaining(data.expiresAt);

	const buttonContent = () => {
		if (data.externalApplicationUrl !== null) {
			return (
				<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto'>
					<Button
						as={Link}
						href={data.externalApplicationUrl}
						size='lg'
						color='primary'
						className='w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-4'
						target='_blank'
						rel='noopener noreferrer'
						isDisabled={data.isApplied || timeRemaining?.expired}
						startContent={<ExternalLinkIcon size={16} />}
					>
						{data.isApplied ? 'Already Applied' : timeRemaining?.expired ? 'Expired' : 'Apply now'}
					</Button>
					{timeRemaining && !timeRemaining.expired && (
						<div
							className={`flex items-center gap-2 text-primary-foreground ${timeRemaining.urgent ? 'font-semibold animate-pulse' : 'font-medium'}`}
						>
							<Clock size={16} />
							<span className='text-sm font-semibold whitespace-nowrap'>{timeRemaining.text}</span>
						</div>
					)}
				</div>
			);
		}

		if (!isAuthenticated) {
			return (
				<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto'>
					<Button
						as={Link}
						href={links.login(`${env.NEXT_PUBLIC_URL}${links.jobDetail(root.organization.slug, root.organization.job.slug)}`)}
						size='lg'
						color='primary'
						className='w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-4'
						isDisabled={timeRemaining?.expired}
					>
						{timeRemaining?.expired ? 'Expired' : 'Log In to Apply'}
						{timeRemaining && !timeRemaining.expired && (
							<div
								className={`flex items-center gap-2 text-primary-foreground ${timeRemaining.urgent ? 'font-semibold animate-pulse' : 'font-medium'}`}
							>
								<Clock size={16} />
								<span className='text-sm font-semibold whitespace-nowrap'>{timeRemaining.text}</span>
							</div>
						)}
					</Button>
				</div>
			);
		}

		return (
			<JobApplicationFlow account={root.viewer} job={root.organization.job}>
				{({ onApply }) => (
					<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto'>
						<Button
							onPress={onApply}
							size='lg'
							color='primary'
							className='w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-4'
							isDisabled={data.isApplied || timeRemaining?.expired}
						>
							{data.isApplied ? 'Already Applied' : timeRemaining?.expired ? 'Expired' : 'Apply now'}
							{timeRemaining && !timeRemaining.expired && (
								<div
									className={`flex items-center gap-2 text-primary-foreground ${timeRemaining.urgent ? 'font-semibold animate-pulse' : 'font-medium'}`}
								>
									<Clock size={16} />
									<span className='text-sm font-semibold whitespace-nowrap'>{timeRemaining.text}</span>
								</div>
							)}
						</Button>
					</div>
				)}
			</JobApplicationFlow>
		);
	};

	if (sticky && mounted) {
		return createPortal(
			<div className='fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-divider z-20 sm:hidden shadow-lg'>
				{buttonContent()}
			</div>,
			document.body
		);
	}

	if (sticky && !mounted) {
		return null;
	}

	return <div className='hidden sm:flex'>{buttonContent()}</div>;
}

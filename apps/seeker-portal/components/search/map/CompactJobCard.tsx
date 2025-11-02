'use client';

import { Card, CardBody, Tooltip } from '@heroui/react';
import { Briefcase, Globe, IndianRupee, MapPin, VerifiedIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { graphql, useFragment } from 'react-relay';
import type { CompactJobCard_job$key } from '@/__generated__/CompactJobCard_job.graphql';
import type { JobType } from '@/__generated__/JobDetailsInternalFragment.graphql';
import type { WorkMode } from '@/__generated__/JobFragment.graphql';
import { salaryFormat } from '@/lib/intl';
import links from '@/lib/links';

// GraphQL fragment for CompactJobCard component
export const CompactJobCardFragment = graphql`
	fragment CompactJobCard_job on Job {
		id
		slug
		title
		location
		minSalary
		maxSalary
		currency
		minExperience
		maxExperience
		type
		workMode
		skills
		organization {
			name
			slug
			logoUrl
			verificationStatus {
				... on Verified {
					verifiedAt
				}
			}
		}
	}
`;

interface CompactJobCardProps {
	job: CompactJobCard_job$key;
	className?: string;
}

/**
 * CompactJobCard Component
 *
 * A compact job card designed for map clusters using Relay fragments.
 * Optimized for small spaces while showing essential job information.
 */
export default function CompactJobCard({ job: jobKey, className = '' }: CompactJobCardProps) {
	const job = useFragment(CompactJobCardFragment, jobKey);

	// Map currency to icons (matching Job.tsx)
	const currencyIcon = (currency: string) => {
		switch (currency) {
			case 'INR':
				return <IndianRupee size={16} />;
			default:
				return null;
		}
	};

	// Job type formatter (matching Job.tsx)
	const jobType = (type: JobType) => {
		switch (type) {
			case 'CONTRACT':
				return 'Contract';
			case 'FULL_TIME':
				return 'Full Time';
			case 'INTERNSHIP':
				return 'Internship';
			case 'PART_TIME':
				return 'Part Time';
			case 'LOCUM':
				return 'Locum';
			default:
				return null;
		}
	};

	// Work mode formatter (matching Job.tsx)
	const workMode = (mode: WorkMode) => {
		switch (mode) {
			case 'HYBRID':
				return 'Hybrid';
			case 'OFFICE':
				return 'Office';
			case 'REMOTE':
				return 'Remote';
			default:
				return null;
		}
	};

	// Salary range formatter (matching Job.tsx)
	const salaryRange =
		job.minSalary && job.maxSalary ? (
			<div className='flex items-center gap-2 text-xl font-medium text-nowrap'>
				{currencyIcon(job.currency)}
				{`${salaryFormat.format(job.minSalary ?? 0)} - ${salaryFormat.format(job.maxSalary ?? 0)}`}{' '}
				<p className='text-foreground-500 text-sm'>/ month</p>
			</div>
		) : job.minSalary || job.maxSalary ? (
			<div className='flex items-center gap-2 text-xl font-medium'>
				{currencyIcon(job.currency)}
				{`${salaryFormat.format(job.minSalary ?? job.maxSalary ?? 0)}`} <p className='text-foreground-500 text-sm'>/ month</p>
			</div>
		) : (
			<div className='flex items-center gap-2 text-xl font-medium'>
				{currencyIcon(job.currency)}
				{'Not disclosed'}
			</div>
		);

	// Experience range formatter (matching Job.tsx)
	function formatExperienceRange({
		minExperience,
		maxExperience
	}: {
		minExperience: number | null | undefined;
		maxExperience: number | null | undefined;
	}) {
		if (minExperience && maxExperience) {
			return `${minExperience} - ${maxExperience} years`;
		}

		if (minExperience || maxExperience) {
			if (!minExperience) {
				return `Maximum ${maxExperience} years`;
			}
			if (!maxExperience) {
				return `Minimum ${minExperience} years`;
			}
		}
		return 'Not specified';
	}

	const isVerified = !!job.organization?.verificationStatus?.verifiedAt;

	const cardContent = (
		<Card className={`w-full transition-colors ${className}`} shadow='none'>
			<CardBody className='p-4 space-y-4'>
				{/* Header with Organization */}
				{job.organization && (
					<div className='flex items-center gap-3 sm:gap-4 min-w-0'>
						{job.organization.logoUrl && (
							<div className='relative aspect-square h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0'>
								<Image
									src={job.organization.logoUrl}
									alt={job.organization.name}
									fill
									sizes='(max-width: 640px) 48px, 56px'
									className='rounded-md object-cover'
								/>
							</div>
						)}
						<div className='flex flex-col gap-1 items-start min-w-0 flex-1'>
							<h4 className='text-base sm:text-xl font-medium truncate w-full'>{job.title}</h4>
							{job.organization.name && (
								<div className='flex flex-row items-center gap-2 min-w-0'>
									<p className='text-xs sm:text-base font-normal text-foreground-500 truncate'>{job.organization.name}</p>
									{isVerified && (
										<Tooltip content='This organization is verified' placement='right'>
											<VerifiedIcon className='w-4 h-4 text-primary' strokeWidth={2.5} />
										</Tooltip>
									)}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Salary Range */}
				<div className='mt-2 sm:mt-0 w-full sm:w-auto sm:flex-shrink-0 flex justify-start'>{salaryRange}</div>

				{/* Job Details with consistent styling */}
				<div className='flex flex-wrap justify-start gap-2 sm:gap-4 mt-4 items-start text-foreground-600 w-full text-left sm:text-center'>
					{job.type && (
						<p className='text-xs sm:text-base px-2 py-1 sm:p-0 bg-default-100 rounded-md sm:bg-transparent'>{jobType(job.type)}</p>
					)}
					{job.location && (
						<div className='flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 py-1 sm:p-0 bg-default-100 rounded-md sm:bg-transparent'>
							<MapPin size={14} className='sm:hidden' />
							<MapPin size={16} className='hidden sm:inline' />
							{job.location}
						</div>
					)}
					<div className='flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 py-1 sm:p-0 bg-default-100 rounded-md sm:bg-transparent'>
						<Briefcase size={14} className='sm:hidden' />
						<Briefcase size={16} className='hidden sm:inline' />
						{formatExperienceRange({
							minExperience: job.minExperience,
							maxExperience: job.maxExperience
						})}
					</div>
					{job.workMode && (
						<div className='flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 py-1 sm:p-0 bg-default-100 rounded-md sm:bg-transparent'>
							<Globe size={14} className='sm:hidden' />
							<Globe size={16} className='hidden sm:inline' />
							{workMode(job.workMode)}
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);

	return (
		<Link href={links.jobDetail(job.organization?.slug ?? '', job.slug)} className='block w-full' target='_blank' rel='noopener noreferrer'>
			{cardContent}
		</Link>
	);
}

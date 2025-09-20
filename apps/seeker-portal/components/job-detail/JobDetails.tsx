'use client';
import type { JobDetailsFragment$key } from '@/__generated__/JobDetailsFragment.graphql';
import type {
	JobDetailsInternalFragment$key as JobDetailsInternalFragmentType,
	JobType,
	WorkMode
} from '@/__generated__/JobDetailsInternalFragment.graphql';
import { dateFormat, salaryFormat } from '@/lib/intl';
import links from '@/lib/links';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Tooltip } from '@heroui/react';
import { Briefcase, Clock, ExternalLinkIcon, Globe, HandshakeIcon, IndianRupee, MapPin, Users, VerifiedIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { graphql, readInlineData } from 'react-relay';
import invariant from 'tiny-invariant';
import OneStepCreateJobAlertModal from '../shared/OneStepCreateJobAlertModal';
import JobControlsSkeleton from './JobControlsSkeleton';

const JobControlsClientComponent = dynamic(() => import('./JobControlsClientComponent'), {
	ssr: false,
	loading: () => <JobControlsSkeleton />
});

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) @inline {
		organization(slug: $slug) {
		__typename
		... on Organization {
			job(slug: $jobSlug) {
				__typename
				... on Job {
					...JobDetailsInternalFragment
				}
			}
		}
	}
  }
`;

const JobDetailsInternalFragment = graphql`
  fragment JobDetailsInternalFragment on Job @inline {
    title
	slug
    description
	descriptionHtml
    type
    workMode
    location
    skills
    currency
    minSalary
    maxSalary
    minExperience
    maxExperience
    createdAt
	vacancies
    isSalaryNegotiable
    organization {
      slug
      name
      description
      logoUrl
	  verificationStatus {
		__typename
		... on Verified @alias(as: "verified") {
			verifiedAt
		}
		... on Rejected {
			rejectedAt
		}
		... on Pending {
			requestedAt
		}
		... on NotRequested {
			message
		}
	}
    }
  }
`;

export default function JobDetails({ rootQuery }: { rootQuery: JobDetailsFragment$key }) {
	const [showAlertModal, setShowAlertModal] = useState(false);
	const root = readInlineData(JobDetailsFragment, rootQuery);

	invariant(root.organization, 'Organization not found');

	invariant(root.organization.__typename === 'Organization', "Expected 'Organization' node type");

	invariant(root.organization.job.__typename === 'Job', "Expected 'Job' node type");

	const data = readInlineData<JobDetailsInternalFragmentType>(JobDetailsInternalFragment, root.organization.job);

	const formattedCreatedAt = dateFormat.format(new Date(data.createdAt));

	// Map currency to icons
	const currencyIcon = (currency: string) => {
		switch (currency) {
			case 'INR':
				return <IndianRupee size={16} />;
			default:
				return null; // Handle other currencies or add more cases
		}
	};

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

	const salaryRange =
		data.minSalary && data.maxSalary ? (
			<div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base text-foreground-600'>
				<div className='w-full flex items-center flex-wrap gap-2'>
					{currencyIcon(data.currency)}
					{`${salaryFormat.format(data.minSalary)} - ${salaryFormat.format(data.maxSalary)}`} <p className='text-xs sm:text-sm'>/ month</p>
					{data.isSalaryNegotiable && (
						<Tooltip content='Negotiable'>
							<div className='flex px-2 rounded-md text-primary-400'>
								<HandshakeIcon size={20} />
							</div>
						</Tooltip>
					)}
				</div>
			</div>
		) : data.minSalary || data.maxSalary ? (
			<div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base text-foreground-600'>
				<div className='w-full flex items-center flex-wrap gap-2'>
					{currencyIcon(data.currency)}
					{`${salaryFormat.format(data.minSalary ?? data.maxSalary ?? 0)}`} <p className='text-xs sm:text-sm'>/ month</p>
				</div>
			</div>
		) : (
			<div className='flex items-center gap-2 text-sm sm:text-base text-foreground-600'>
				{currencyIcon(data.currency)}
				Not disclosed
			</div>
		);

	return (
		<div className='w-full h-full flex flex-col gap-6 flex-1'>
			{/* Job Title and Company */}
			<Card fullWidth className='p-4 sm:p-6 gap-4' shadow='none'>
				<CardHeader>
					<div className='flex flex-col sm:flex-row w-full justify-between gap-3 sm:gap-4 items-start sm:items-center'>
						<h2 className='text-lg sm:text-xl md:text-2xl font-medium break-words max-w-full leading-snug text-foreground-900'>
							{data.title}
						</h2>
						<JobControlsClientComponent slug={data.organization?.slug || ''} jobSlug={data.slug} />
					</div>
				</CardHeader>
				<CardBody className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 w-full'>
					<div className='flex flex-col border-t border-foreground-300 sm:border-none sm:pt-0 pt-8 sm:flex-row flex-wrap gap-x-4 sm:gap-x-12 gap-y-6 items-start sm:items-center text-foreground-600 w-full'>
						{salaryRange}
						{data.location && (
							<div className='flex items-center gap-2 text-sm sm:text-base'>
								<MapPin size={16} />
								{data.location}
							</div>
						)}
						{data.type && (
							<div className='flex items-center gap-2 text-sm sm:text-base'>
								<Clock size={16} />
								{jobType(data.type)}
							</div>
						)}
						<div className='flex items-center gap-2 text-sm sm:text-base'>
							<Briefcase size={16} />{' '}
							{formatExperienceRange({
								minExperience: data.minExperience,
								maxExperience: data.maxExperience
							})}
						</div>
						{data.workMode && (
							<div className='flex items-center gap-2 text-sm sm:text-base'>
								<Globe size={16} /> {workMode(data.workMode)}
							</div>
						)}
					</div>
				</CardBody>
				<Divider />
				<CardFooter className='flex flex-col w-full items-start gap-2'>
					<div className='flex flex-col sm:flex-row justify-between items-end sm:items-center w-full gap-4 sm:gap-6'>
						<div className='justify-between w-full gap-8 items-center hidden sm:flex'>
							<p className='text-foreground-500 text-base font-normal'>Posted on {formattedCreatedAt}</p>
							{typeof data.vacancies === 'number' && (
								<div className='flex items-center gap-2 text-sm sm:text-base font-normal text-foreground-500'>
									<Users size={16} />
									<span>
										{data.vacancies} {data.vacancies === 1 ? 'Vacancy' : 'Vacancies'}
									</span>
								</div>
							)}
						</div>
						<div className='w-full sm:w-auto flex justify-end items-center gap-4 sm:hidden'>
							<div className='flex-col gap-4 items-center flex w-full'>
								<p className='text-foreground-500 text-xs block sm:hidden w-full'>{formattedCreatedAt}</p>
								{typeof data.vacancies === 'number' && (
									<div className='flex items-center gap-2 text-xs font-medium text-foreground-500 w-full'>
										<Users size={14} />
										<span>
											{data.vacancies} {data.vacancies === 1 ? 'Vacancy' : 'Vacancies'}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</CardFooter>
			</Card>
			<Card shadow='none' className='px-6 py-4'>
				<CardBody className='w-full flex flex-row items-center justify-between gap-6'>
					<p className='text-sm sm:text-base text-foreground-600'>Send me jobs like this</p>
					<Button type='button' variant='flat' size='md' onPress={() => setShowAlertModal(true)}>
						Create alert
					</Button>
				</CardBody>
			</Card>
			<OneStepCreateJobAlertModal
				filters={{
					jobType: data.type ? [data.type] : [],
					workMode: data.workMode ? [data.workMode] : [],
					minExperience: data.minExperience ?? undefined,
					maxExperience: data.maxExperience ?? undefined,
					minSalary: data.minSalary ?? undefined,
					maxSalary: data.maxSalary ?? undefined,
					location: data.location,
					searchTerm: data.title
				}}
				isOpen={showAlertModal}
				onOpenChange={setShowAlertModal}
			/>
			{/* Job and Company Details */}

			<Card fullWidth className='p-4 sm:p-6' shadow='none'>
				<CardBody className='flex items-center gap-4 sm:gap-6 flex-row w-full'>
					<div className='relative aspect-square h-12 w-12 sm:h-14 sm:w-14 min-w-[3rem] sm:min-w-[3.5rem]'>
						<Image
							src={data.organization?.logoUrl || ''}
							alt={data.organization?.name || ''}
							fill
							className='rounded-md object-cover'
							sizes='(max-width: 640px) 48px, 56px'
						/>
					</div>

					<div className='w-full flex flex-col gap-1 sm:gap-2'>
						<Link
							color='foreground'
							target='_blank'
							rel='noopener noreferrer'
							href={links.organizationDetail(data.organization?.slug || '')}
							className='text-base sm:text-lg font-medium flex items-center gap-2'
						>
							{data.organization?.name}

							{data.organization?.verificationStatus.verified && (
								<Tooltip content='This organization is verified' placement='right'>
									<VerifiedIcon className='w-4 h-4 text-primary' strokeWidth={2.5} />
								</Tooltip>
							)}
							<ExternalLinkIcon className='w-4 h-4 text-foreground-600' />
						</Link>
						{data.organization?.description && (
							<p className='text-xs sm:text-base text-default-500 leading-tight line-clamp-2'>{data.organization.description}</p>
						)}
					</div>
				</CardBody>
			</Card>

			{/* Job Description */}
			<Card className='p-4 sm:p-6 h-full' fullWidth shadow='none'>
				<CardHeader>
					<h3 className='font-medium text-foreground-500 text-base sm:text-lg'>About the Job</h3>
				</CardHeader>
				<Divider />
				<CardBody>
					<div
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
						className='prose prose-foreground prose-sm max-w-none prose-headings:mt-6 prose-headings:mb-4 prose-p:mt-0 prose-p:mb-3 prose-ul:mt-1 prose-ul:mb-2 prose-li:mt-1 prose-li:mb-2 prose-strong:font-semibold prose-blockquote:mt-1 prose-blockquote:mb-2 prose-code:mt-1 prose-code:mb-2 prose-pre:mt-1 prose-pre:mb-2 prose-table:mt-1 prose-table:mb-2 prose-thead:mt-1 prose-thead:mb-2 prose-tbody:mt-1 prose-tbody:mb-2 prose-tfoot:mt-1 prose-tfoot:mb-2 prose-tr:mt-1 prose-tr:mb-2 prose-th:mt-1 prose-th:mb-2 prose-td:mt-1 prose-td:mb-2'
					/>
				</CardBody>
				<CardFooter>
					<div className='flex flex-wrap gap-2 sm:gap-4 mt-2 w-full'>
						{data.skills.map(skill => (
							<Chip variant='flat' key={skill} className='text-xs sm:text-base px-2 sm:px-3 py-1 sm:py-2'>
								{skill}
							</Chip>
						))}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

import { Card, CardBody, CardFooter, CardHeader, Skeleton, Tooltip } from '@heroui/react';
import { Briefcase, Clock, Globe, HandshakeIcon, IndianRupee, MapPin, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { graphql, useFragment } from 'react-relay';
import type { JobType, WorkMode } from '@/__generated__/JobDetailsInternalFragment.graphql';
import type { JobOverviewFragment$key } from '@/__generated__/JobOverviewFragment.graphql';
import { dateFormat, salaryFormat } from '@/lib/intl';

const JobControlsClientComponent = dynamic(() => import('./JobControlsClientComponent'), { ssr: false });

const JobApplyButtonClientComponent = dynamic(() => import('./job-apply/JobApplyButton'), {
	ssr: false,
	loading: () => <Skeleton className='h-12 rounded-lg w-full sm:w-32' />
});

const JobOverviewFragment = graphql`
  fragment JobOverviewFragment on Job {
    title
    slug
    type
    workMode
    location
    currency
    minSalary
    maxSalary
    minExperience
    maxExperience
    createdAt
    vacancies
    isSalaryNegotiable
    organization @required(action: THROW) {
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

export default function JobDetails({ rootQuery }: { rootQuery: JobOverviewFragment$key }) {
	const data = useFragment(JobOverviewFragment, rootQuery);

	const formattedCreatedAt = dateFormat.format(new Date(data.createdAt));

	// Map currency to icons
	const currencyIcon = (currency: string) => {
		switch (currency) {
			case 'INR':
				return <IndianRupee size={14} />;
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
			<div className='flex flex-col sm:flex-row sm:items-center gap-2 text-md sm:text-xl text-foreground-500'>
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
			<div className='flex flex-col sm:flex-row sm:items-center gap-2 text-md sm:text-xl text-foreground-500'>
				<div className='w-full flex items-center flex-wrap gap-2'>
					{currencyIcon(data.currency)}
					{`${salaryFormat.format(data.minSalary ?? data.maxSalary ?? 0)}`} <p className='text-xs sm:text-sm'>/ month</p>
				</div>
			</div>
		) : (
			<div className='flex items-center gap-2 text-sm sm:text-base text-foreground-500'>
				{currencyIcon(data.currency)}
				Not disclosed
			</div>
		);

	return (
		<Card fullWidth className='p-4 sm:p-6' shadow='none'>
			<CardHeader>
				<div className='flex flex-col sm:flex-row w-full justify-between gap-3 sm:gap-4 items-start sm:items-center'>
					<h4 className='text-lg sm:text-xl font-medium break-words max-w-full leading-snug text-foreground-900'>{data.title}</h4>
					<JobApplyButtonClientComponent slug={data.organization.slug} jobSlug={data.slug} />
				</div>
			</CardHeader>
			<CardBody className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 w-full'>
				<div className='flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 sm:gap-8 w-full'>
					<p className='text-foreground-500 text-base font-normal hidden sm:block'>Posted on {formattedCreatedAt}</p>
					{salaryRange}
				</div>
			</CardBody>
			<CardFooter className='flex flex-col sm:flex-row justify-between items-end sm:items-center w-full gap-4 sm:gap-6'>
				<div className='flex flex-col border-t border-foreground-300 sm:border-none sm:pt-0 pt-8 sm:flex-row flex-wrap gap-4 sm:gap-8 items-start sm:items-center text-foreground-600 w-full'>
					{data.type && (
						<div className='flex items-center gap-2 text-sm sm:text-base'>
							<Clock size={16} />
							{jobType(data.type)}
						</div>
					)}

					{data.location && (
						<div className='flex items-center gap-2 text-sm sm:text-base'>
							<MapPin size={16} />
							{data.location}
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
					{typeof data.vacancies === 'number' && (
						<div className='flex items-center gap-2 text-sm sm:text-base font-medium text-foreground-500'>
							<Users size={16} />
							<span>
								{data.vacancies} {data.vacancies === 1 ? 'Vacancy' : 'Vacancies'}
							</span>
						</div>
					)}
				</div>
				<div className='w-full sm:w-auto flex justify-end items-center gap-4'>
					<p className='text-foreground-500 text-xs block sm:hidden w-full'>{formattedCreatedAt}</p>
					<div className='w-full sm:w-auto flex justify-end'>
						<JobControlsClientComponent slug={data.organization.slug} jobSlug={data.slug} />
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}

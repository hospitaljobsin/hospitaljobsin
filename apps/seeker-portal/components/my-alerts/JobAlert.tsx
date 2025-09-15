import type { JobAlertFragment$key, JobAlertFrequency, JobTypeFilter, WorkMode } from '@/__generated__/JobAlertFragment.graphql';
import { dateTimeFormat } from '@/lib/intl';
import { Card, CardBody, CardFooter, CardHeader, Tooltip } from '@heroui/react';
import { BellIcon, Briefcase, Clock, IndianRupee } from 'lucide-react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import JobAlertControls from './JobAlertControls';

const JobAlertFragment = graphql`
  fragment JobAlertFragment on JobAlert {
    id
    createdAt
    frequency
    filters {
        jobType
        workMode
        location
        maxExperience
        minExperience
        maxSalary
        minSalary
        searchTerm
    }
    ...JobAlertControlsFragment
  }
`;

export default function JobAlert({ jobAlert }: { jobAlert: JobAlertFragment$key }) {
	const data = useFragment(JobAlertFragment, jobAlert);

	// Format frequency to be more readable
	const formatFrequency = (frequency: JobAlertFrequency) => {
		switch (frequency) {
			case 'DAILY':
				return 'Daily';
			case 'WEEKLY':
				return 'Weekly';
			case 'MONTHLY':
				return 'Monthly';
			default:
				return frequency.charAt(0) + frequency.slice(1).toLowerCase();
		}
	};

	// Format job type to be more readable
	const formatJobType = (jobTypes: ReadonlyArray<JobTypeFilter> | null | undefined) => {
		if (!jobTypes || jobTypes.length === 0) return null;

		// Just display the first job type for simplicity
		const jobType = jobTypes[0];

		switch (jobType) {
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
				return jobType.charAt(0) + jobType.slice(1).toLowerCase();
		}
	};

	// Format work mode to be more readable
	const formatWorkMode = (workModes: ReadonlyArray<WorkMode> | null | undefined) => {
		if (!workModes || workModes.length === 0) return null;

		// Just display the first work mode for simplicity
		const workMode = workModes[0];

		switch (workMode) {
			case 'HYBRID':
				return 'Hybrid';
			case 'OFFICE':
				return 'Office';
			case 'REMOTE':
				return 'Remote';
			default:
				return workMode.charAt(0) + workMode.slice(1).toLowerCase();
		}
	};

	// Format experience range
	const formatExperienceRange = (minExperience: number | null | undefined, maxExperience: number | null | undefined) => {
		if (minExperience && maxExperience) {
			return `${minExperience} - ${maxExperience} years`;
		}
		if (minExperience) {
			return `${minExperience}+ years`;
		}
		if (maxExperience) {
			return `Up to ${maxExperience} years`;
		}
		return null;
	};

	// Format salary range
	const formatSalaryRange = (minSalary: number | null | undefined, maxSalary: number | null | undefined) => {
		const formatSalary = (salary: number) => {
			return new Intl.NumberFormat('en-IN', {
				maximumFractionDigits: 0
			}).format(salary);
		};

		if (minSalary && maxSalary) {
			return `₹${formatSalary(minSalary)} - ₹${formatSalary(maxSalary)}`;
		}
		if (minSalary) {
			return `₹${formatSalary(minSalary)}+`;
		}
		if (maxSalary) {
			return `Up to ₹${formatSalary(maxSalary)}`;
		}
		return null;
	};

	// Check if job alert has any filters
	const hasFilters =
		data.filters.searchTerm ||
		(data.filters.jobType && data.filters.jobType.length > 0) ||
		(data.filters.workMode && data.filters.workMode.length > 0) ||
		data.filters.location ||
		data.filters.minExperience ||
		data.filters.maxExperience ||
		data.filters.minSalary ||
		data.filters.maxSalary;

	// Removed unused chip rendering functions

	// Function to join job types into a readable string
	const joinJobTypes = (jobTypes: ReadonlyArray<JobTypeFilter> | null | undefined) => {
		if (!jobTypes || jobTypes.length === 0) return null;
		if (jobTypes.length === 1) return formatJobType([jobTypes[0]]);
		if (jobTypes.length === 2) return `${formatJobType([jobTypes[0]])} or ${formatJobType([jobTypes[1]])}`;
		return `${formatJobType([jobTypes[0]])} + ${jobTypes.length - 1} more`;
	};

	// Function to join work modes into a readable string
	const joinWorkModes = (workModes: ReadonlyArray<WorkMode> | null | undefined) => {
		if (!workModes || workModes.length === 0) return null;
		if (workModes.length === 1) return formatWorkMode([workModes[0]]);
		if (workModes.length === 2) return `${formatWorkMode([workModes[0]])} or ${formatWorkMode([workModes[1]])}`;
		return `${formatWorkMode([workModes[0]])} + ${workModes.length - 1} more`;
	};

	// Create a summary of the most important filters
	const createFilterSummary = () => {
		const parts: string[] = [];

		if (data.filters.jobType && data.filters.jobType.length > 0) {
			const jobTypeText = joinJobTypes(data.filters.jobType);
			if (jobTypeText) parts.push(jobTypeText);
		}

		if (data.filters.workMode && data.filters.workMode.length > 0) {
			const workModeText = joinWorkModes(data.filters.workMode);
			if (workModeText) parts.push(workModeText);
		}

		if (data.filters.location) {
			parts.push(data.filters.location);
		}

		return parts.join(' • ');
	};

	const filterSummary = createFilterSummary();

	return (
		<Card radius='md' shadow='none'>
			<CardHeader className='pb-0 pt-4 px-4'>
				<div className='flex justify-between items-start w-full'>
					<div className='flex items-center gap-3'>
						<div className='bg-primary/10 p-2 rounded-full flex-shrink-0'>
							<BellIcon className='h-5 w-5 text-primary' />
						</div>
						<div>
							<h3 className='font-medium text-lg text-neutral-800'>{data.filters.searchTerm || 'Job Alert'}</h3>
							{filterSummary && <p className='text-sm text-neutral-500 mt-0.5 line-clamp-1'>{filterSummary}</p>}
						</div>
					</div>
					<div className='flex items-center gap-1'>
						<Tooltip content={`${formatFrequency(data.frequency)} updates`}>
							<div className='flex items-center text-xs text-primary font-medium bg-primary/5 py-1 px-2.5 rounded-full'>
								<Clock size={12} className='mr-1' />
								{formatFrequency(data.frequency)}
							</div>
						</Tooltip>
					</div>
				</div>
			</CardHeader>

			{hasFilters && (
				<CardBody className='py-3 px-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-2'>
						{formatExperienceRange(data.filters.minExperience, data.filters.maxExperience) && (
							<div className='flex items-center gap-2'>
								<Briefcase size={14} className='text-neutral-400 flex-shrink-0' />
								<span className='text-sm text-neutral-600'>
									{formatExperienceRange(data.filters.minExperience, data.filters.maxExperience)}
								</span>
							</div>
						)}

						{formatSalaryRange(data.filters.minSalary, data.filters.maxSalary) && (
							<div className='flex items-center gap-2'>
								<IndianRupee size={14} className='text-neutral-400 flex-shrink-0' />
								<span className='text-sm text-neutral-600'>{formatSalaryRange(data.filters.minSalary, data.filters.maxSalary)}</span>
							</div>
						)}
					</div>
				</CardBody>
			)}

			<CardFooter className='flex justify-between gap-2 border-t border-neutral-100 py-3 px-4 bg-neutral-50/50 w-full'>
				<p className='text-xs text-neutral-400 mt-1'>Created {dateTimeFormat.format(new Date(data.createdAt))}</p>
				<JobAlertControls jobAlert={data} />
			</CardFooter>
		</Card>
	);
}

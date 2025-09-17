import type { JobAlertFragment$key, JobAlertFrequency, JobTypeFilter, WorkMode } from '@/__generated__/JobAlertFragment.graphql';
import { dateTimeFormat } from '@/lib/intl';
import { Card, CardBody, Chip, Tooltip } from '@heroui/react';
import { BellIcon, Briefcase, Clock, IndianRupee, MapPin } from 'lucide-react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import JobAlertControls from './JobAlertControls';

const JobAlertFragment = graphql`
  fragment JobAlertFragment on JobAlert {
    id
    createdAt
	lastSentAt
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

	return (
		<Card radius='md' className='hover:bg-neutral-50 transition-colors border-neutral-100 shadow-none'>
			<CardBody className='p-6'>
				<div className='flex flex-row items-start justify-between w-full gap-2'>
					{/* Left Section: Alert Icon & Title */}
					<div className='flex items-center gap-4 min-w-0 flex-1'>
						<div className='bg-foreground-600/10 p-1.5 rounded-full flex-shrink-0'>
							<BellIcon size={20} className='text-foreground-600' />
						</div>
						<div className='min-w-0 flex-1 flex flex-col gap-2'>
							<div className='flex items-center gap-3'>
								<h3 className='font-medium truncate text-lg'>{data.filters.searchTerm}</h3>
								<Tooltip content={`${formatFrequency(data.frequency)} updates`}>
									<Chip
										size='lg'
										startContent={<Clock size={14} />}
										variant='flat'
										className='bg-primary/10 text-primary text-xs font-medium px-1.5 py-0.5 h-auto'
									>
										{formatFrequency(data.frequency)}
									</Chip>
								</Tooltip>
							</div>

							{/* Creation Date */}
							<div className='flex gap-6 items-center justify-start'>
								<p className='text-xs text-neutral-400 mt-0.5'>Created {dateTimeFormat.format(new Date(data.createdAt))}</p>
								{data.lastSentAt && (
									<p className='text-xs text-neutral-400 mt-0.5'>Last Sent {dateTimeFormat.format(new Date(data.lastSentAt))}</p>
								)}
							</div>
						</div>
					</div>

					{/* Right Section: Controls */}
					<JobAlertControls jobAlert={data} />
				</div>

				{/* Job Filters - Grid Layout */}
				{hasFilters && (
					<div className='flex items-center justify-start gap-4 flex-wrap mt-8 border-t border-neutral-100 pt-2'>
						{data.filters.jobType && data.filters.jobType.length > 0 && (
							<div className='flex items-center gap-2 text-sm text-neutral-600'>
								<Briefcase size={14} className='text-neutral-400 flex-shrink-0' />
								<span className='truncate'>{joinJobTypes(data.filters.jobType)}</span>
							</div>
						)}

						{data.filters.workMode && data.filters.workMode.length > 0 && (
							<div className='flex items-center gap-2 text-sm text-neutral-600'>
								<Clock size={14} className='text-neutral-400 flex-shrink-0' />
								<span className='truncate'>{joinWorkModes(data.filters.workMode)}</span>
							</div>
						)}

						{data.filters.location && (
							<div className='flex items-center gap-2 text-sm text-neutral-600'>
								<MapPin size={14} className='text-neutral-400 flex-shrink-0' />
								<span className='truncate'>{data.filters.location}</span>
							</div>
						)}

						{formatExperienceRange(data.filters.minExperience, data.filters.maxExperience) && (
							<div className='flex items-center gap-2 text-sm text-neutral-600'>
								<Briefcase size={14} className='text-neutral-400 flex-shrink-0' />
								<span className='truncate'>{formatExperienceRange(data.filters.minExperience, data.filters.maxExperience)}</span>
							</div>
						)}

						{formatSalaryRange(data.filters.minSalary, data.filters.maxSalary) && (
							<div className='flex items-center gap-2 text-sm text-neutral-600'>
								<IndianRupee size={14} className='text-neutral-400 flex-shrink-0' />
								<span className='truncate'>{formatSalaryRange(data.filters.minSalary, data.filters.maxSalary)}</span>
							</div>
						)}
					</div>
				)}
			</CardBody>
		</Card>
	);
}

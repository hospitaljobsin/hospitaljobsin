import type { JobAlertFragment$key, JobAlertFrequency, JobTypeFilter, WorkMode } from '@/__generated__/JobAlertFragment.graphql';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Tooltip } from '@heroui/react';
import { BellIcon, Briefcase, Clock, Globe, IndianRupee, MapPin, Search } from 'lucide-react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

const JobAlertFragment = graphql`
  fragment JobAlertFragment on JobAlert {
    id
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

	// Display all job types as chips if there are multiple
	const renderJobTypeChips = () => {
		if (!data.filters.jobType || data.filters.jobType.length === 0) return null;

		return (
			<div className='flex flex-wrap gap-2 mt-2'>
				{data.filters.jobType.map(jobType => (
					<Chip key={jobType} variant='flat' size='sm' color='secondary' className='text-xs'>
						{formatJobType([jobType])}
					</Chip>
				))}
			</div>
		);
	};

	// Display all work modes as chips if there are multiple
	const renderWorkModeChips = () => {
		if (!data.filters.workMode || data.filters.workMode.length === 0) return null;

		return (
			<div className='flex flex-wrap gap-2 mt-2'>
				{data.filters.workMode.map(workMode => (
					<Chip key={workMode} variant='flat' size='sm' color='success' className='text-xs'>
						{formatWorkMode([workMode])}
					</Chip>
				))}
			</div>
		);
	};

	return (
		<Card className='p-6' radius='md' shadow='none'>
			<CardHeader className='flex flex-row justify-between items-start pb-2'>
				<div className='flex items-center gap-2'>
					<div className='bg-primary/10 p-2 rounded-full'>
						<BellIcon className='h-5 w-5 text-primary' />
					</div>
					<div>
						<h3 className='text-lg font-medium'>{data.filters.searchTerm || 'Job Alert'}</h3>
						<div className='flex items-center text-sm text-foreground-500'>
							<Clock size={14} className='mr-1' />
							{formatFrequency(data.frequency)} updates
						</div>
					</div>
				</div>
				<Tooltip content='Notifications frequency'>
					<Chip color='primary' variant='flat' size='sm' className='capitalize'>
						{formatFrequency(data.frequency)}
					</Chip>
				</Tooltip>
			</CardHeader>

			<CardBody className='py-3'>
				{hasFilters ? (
					<div className='flex flex-col gap-3'>
						{data.filters.searchTerm && (
							<div className='flex items-center gap-2'>
								<Search size={16} className='text-foreground-500 flex-shrink-0' />
								<span className='text-sm font-medium'>{data.filters.searchTerm}</span>
							</div>
						)}

						{data.filters.jobType && data.filters.jobType.length > 0 && (
							<div className='flex flex-col gap-1'>
								<div className='flex items-center gap-2'>
									<Briefcase size={16} className='text-foreground-500 flex-shrink-0' />
									<span className='text-sm'>Job Type</span>
								</div>
								{renderJobTypeChips()}
							</div>
						)}

						{data.filters.workMode && data.filters.workMode.length > 0 && (
							<div className='flex flex-col gap-1'>
								<div className='flex items-center gap-2'>
									<Globe size={16} className='text-foreground-500 flex-shrink-0' />
									<span className='text-sm'>Work Mode</span>
								</div>
								{renderWorkModeChips()}
							</div>
						)}

						{data.filters.location && (
							<div className='flex items-center gap-2'>
								<MapPin size={16} className='text-foreground-500 flex-shrink-0' />
								<span className='text-sm'>{data.filters.location}</span>
							</div>
						)}

						{formatExperienceRange(data.filters.minExperience, data.filters.maxExperience) && (
							<div className='flex items-center gap-2'>
								<Briefcase size={16} className='text-foreground-500 flex-shrink-0' />
								<span className='text-sm'>{formatExperienceRange(data.filters.minExperience, data.filters.maxExperience)}</span>
							</div>
						)}

						{formatSalaryRange(data.filters.minSalary, data.filters.maxSalary) && (
							<div className='flex items-center gap-2'>
								<IndianRupee size={16} className='text-foreground-500 flex-shrink-0' />
								<span className='text-sm'>{formatSalaryRange(data.filters.minSalary, data.filters.maxSalary)}</span>
							</div>
						)}
					</div>
				) : (
					<div className='text-center text-foreground-500 text-sm py-2'>No filters configured</div>
				)}
			</CardBody>

			<CardFooter className='pt-3 flex justify-between items-center'>
				<Button color='primary' variant='flat' size='sm' radius='full'>
					Edit Alert
				</Button>

				<Button color='danger' variant='light' size='sm' radius='full'>
					Delete
				</Button>
			</CardFooter>
		</Card>
	);
}

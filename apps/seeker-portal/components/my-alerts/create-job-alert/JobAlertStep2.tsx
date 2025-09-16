'use client';

import { Button, Select, SelectItem } from '@heroui/react';
import { BriefcaseIcon, Globe } from 'lucide-react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CreateAlertFormValues } from './JobAlertFormMachine';
import JobAlertFormContext from './JobAlertFormMachine';

// Job types and work modes for selection
const JOB_TYPES = [
	{ value: 'FULL_TIME', label: 'Full Time' },
	{ value: 'PART_TIME', label: 'Part Time' },
	{ value: 'INTERNSHIP', label: 'Internship' },
	{ value: 'CONTRACT', label: 'Contract' },
	{ value: 'LOCUM', label: 'Locum' }
];

const WORK_MODES = [
	{ value: 'REMOTE', label: 'Remote' },
	{ value: 'HYBRID', label: 'Hybrid' },
	{ value: 'OFFICE', label: 'Office' }
];

type Step2Props = {
	control: Control<CreateAlertFormValues>;
	errors: FieldErrors<CreateAlertFormValues>;
};

export default function JobAlertStep2({ control, errors }: Step2Props) {
	const { send } = JobAlertFormContext.useActorRef();

	return (
		<div className='space-y-8'>
			<div className='space-y-8'>
				<div className='space-y-2'>
					<h3 className='text-lg font-semibold text-foreground-800'>Job Details (Optional)</h3>
					<p className='text-sm text-foreground-500'>Add more specifics to refine your job alerts</p>
				</div>

				{/* Job Types */}
				<div className='mb-4'>
					<Controller
						name='jobType'
						control={control}
						render={({ field }) => (
							<Select
								label='Job Types'
								placeholder='Select job types'
								selectionMode='multiple'
								startContent={<BriefcaseIcon size={16} />}
								selectedKeys={new Set(field.value || [])}
								onSelectionChange={keys => {
									const valuesArray = Array.from(keys as Set<string>);
									field.onChange(valuesArray);
									send({ type: 'UPDATE_FIELD', field: 'jobType', value: valuesArray });
								}}
								errorMessage={errors.jobType?.message}
								isInvalid={!!errors.jobType}
								classNames={{
									trigger: 'min-h-unit-12'
								}}
							>
								{JOB_TYPES.map(jobType => (
									<SelectItem key={jobType.value}>{jobType.label}</SelectItem>
								))}
							</Select>
						)}
					/>
				</div>

				{/* Work Modes */}
				<div className='mb-4'>
					<Controller
						name='workMode'
						control={control}
						render={({ field }) => (
							<Select
								label='Work Modes'
								placeholder='Select work modes'
								selectionMode='multiple'
								startContent={<Globe size={16} />}
								selectedKeys={new Set(field.value || [])}
								onSelectionChange={keys => {
									const valuesArray = Array.from(keys as Set<string>);
									field.onChange(valuesArray);
									send({ type: 'UPDATE_FIELD', field: 'workMode', value: valuesArray });
								}}
								errorMessage={errors.workMode?.message}
								isInvalid={!!errors.workMode}
								classNames={{
									trigger: 'min-h-unit-12'
								}}
							>
								{WORK_MODES.map(mode => (
									<SelectItem key={mode.value}>{mode.label}</SelectItem>
								))}
							</Select>
						)}
					/>
				</div>

				{/* No experience range here anymore */}
			</div>

			{/* Navigation */}
			<div className='flex justify-between gap-6'>
				<Button variant='flat' onPress={() => send({ type: 'BACK' })} fullWidth>
					Back
				</Button>
				<Button color='primary' onPress={() => send({ type: 'NEXT' })} fullWidth>
					Next
				</Button>
			</div>
		</div>
	);
}

'use client';

import type { EditJobAlertModalFragment$key } from '@/__generated__/EditJobAlertModalFragment.graphql';
import type { EditJobAlertModalMutation as EditJobAlertModalMutationType } from '@/__generated__/EditJobAlertModalMutation.graphql';
import {
	Accordion,
	AccordionItem,
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	NumberInput,
	Radio,
	RadioGroup,
	Select,
	SelectItem
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { BellIcon, BriefcaseIcon, Clock, Globe, IndianRupee, StarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import { z } from 'zod';
import JobSearchAutocomplete from '../forms/JobSearchAutocomplete';
import LocationAutocomplete from '../forms/LocationAutocomplete';

const EditJobAlertModalFragment = graphql`
  fragment EditJobAlertModalFragment on JobAlert {
    id
    filters {
      searchTerm
      jobType
      workMode
      location
      minExperience
      maxExperience
      minSalary
      maxSalary
    }
    frequency
  }
`;

const UpdateJobAlertMutation = graphql`
  mutation EditJobAlertModalMutation(
    $jobAlertId: ID!,
    $filters: AlertFiltersInput!,
    $frequency: JobAlertFrequency!
  ) {
    updateJobAlert(
      jobAlertId: $jobAlertId,
      filters: $filters,
      frequency: $frequency
    ) {
      __typename
      ... on JobAlert {
        ...JobAlertFragment
        ...EditJobAlertModalFragment
      }
      ... on JobAlertAlreadyExistsError {
        message
      }
      ... on JobAlertNotFoundError {
        message
      }
    }
  }
`;

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

// Alert frequency options
const ALERT_FREQUENCIES = [
	{ value: 'DAILY', label: 'Daily' },
	{ value: 'WEEKLY', label: 'Weekly' },
	{ value: 'MONTHLY', label: 'Monthly' }
];

// Form schema for validation
const editAlertSchema = z
	.object({
		searchTerm: z.string().min(1, 'Search term is required'),
		jobType: z
			.array(z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'LOCUM']))
			.optional()
			.nullable(),
		workMode: z
			.array(z.enum(['HYBRID', 'OFFICE', 'REMOTE']))
			.optional()
			.nullable(),
		location: z.string().optional().nullable(),
		minExperience: z.number().nonnegative().optional().nullable(),
		maxExperience: z.number().positive().optional().nullable(),
		minSalary: z.number().nonnegative().optional().nullable(),
		maxSalary: z.number().positive().optional().nullable(),
		frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY'])
	})
	.refine(
		data => {
			// At least one filter should be present
			return Boolean(
				data.searchTerm ||
					(data.jobType && data.jobType.length > 0) ||
					(data.workMode && data.workMode.length > 0) ||
					data.location ||
					data.minExperience ||
					data.maxExperience ||
					data.minSalary ||
					data.maxSalary
			);
		},
		{
			message: 'Please add at least one job search criteria',
			path: ['searchTerm']
		}
	)
	.refine(
		data => {
			// If both min and max experience are provided, max should be >= min
			if (data.minExperience != null && data.maxExperience != null) {
				return data.maxExperience >= data.minExperience;
			}
			return true;
		},
		{
			message: 'Maximum experience must be greater than or equal to minimum experience',
			path: ['maxExperience']
		}
	)
	.refine(
		data => {
			// If both min and max salary are provided, max should be >= min
			if (data.minSalary != null && data.maxSalary != null) {
				return data.maxSalary >= data.minSalary;
			}
			return true;
		},
		{
			message: 'Maximum salary must be greater than or equal to minimum salary',
			path: ['maxSalary']
		}
	);

type EditAlertFormValues = z.infer<typeof editAlertSchema>;

interface EditJobAlertModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	jobAlert: EditJobAlertModalFragment$key;
}

export default function EditJobAlertModal({ isOpen, onOpenChange, jobAlert }: EditJobAlertModalProps) {
	const data = useFragment(EditJobAlertModalFragment, jobAlert);
	const [updateJobAlert, isUpdatingJobAlert] = useMutation<EditJobAlertModalMutationType>(UpdateJobAlertMutation);

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset
	} = useForm<EditAlertFormValues>({
		resolver: zodResolver(editAlertSchema),
		defaultValues: {
			searchTerm: data.filters.searchTerm,
			jobType: data.filters.jobType ? ([...data.filters.jobType] as any) : [],
			workMode: data.filters.workMode ? ([...data.filters.workMode] as any) : [],
			location: data.filters.location || null,
			minExperience: data.filters.minExperience || null,
			maxExperience: data.filters.maxExperience || null,
			minSalary: data.filters.minSalary || null,
			maxSalary: data.filters.maxSalary || null,
			frequency: data.frequency as 'DAILY' | 'WEEKLY' | 'MONTHLY'
		},
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	// Reset form when modal closes
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			reset();
		}
		onOpenChange(open);
	};

	const onSubmit = (formData: EditAlertFormValues) => {
		updateJobAlert({
			variables: {
				jobAlertId: data.id,
				filters: {
					searchTerm: formData.searchTerm,
					jobType: formData.jobType?.length ? formData.jobType : null,
					workMode: formData.workMode?.length ? formData.workMode : null,
					location: formData.location || null,
					minExperience: formData.minExperience,
					maxExperience: formData.maxExperience,
					minSalary: formData.minSalary,
					maxSalary: formData.maxSalary
				},
				frequency: formData.frequency
			},
			onCompleted: response => {
				if (response.updateJobAlert.__typename === 'JobAlert') {
					addToast({
						title: 'Success!',
						description: 'Job alert updated successfully',
						color: 'success'
					});
					reset({
						...formData
					});
					handleOpenChange(false);
				} else if (
					response.updateJobAlert.__typename === 'JobAlertAlreadyExistsError' ||
					response.updateJobAlert.__typename === 'JobAlertNotFoundError'
				) {
					addToast({
						title: 'Error',
						description: response.updateJobAlert.message,
						color: 'danger'
					});
				}
			},
			onError: error => {
				addToast({
					title: 'Error',
					description: 'Failed to update job alert. Please try again.',
					color: 'danger'
				});
				console.error('Error updating job alert:', error);
			}
		});
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='4xl' className='overflow-y-auto p-6' scrollBehavior='inside'>
			<ModalContent className='max-h-[90vh]'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader className='flex flex-col gap-1 pb-2 text-sm text-foreground-600'>
						<div className='flex items-center gap-2'>
							<BellIcon size={16} className='text-foreground-600' />
							<span>Edit Job Alert</span>
						</div>
						<p className='text-sm text-foreground-500 font-normal mt-1'>Update your preferences to receive more relevant job matches</p>
					</ModalHeader>

					<ModalBody className='overflow-y-auto py-6 gap-12'>
						{/* Essential Fields Section */}
						<div className='flex flex-col gap-8'>
							<div className='flex items-center mb-1'>
								<StarIcon className='mr-2 h-5 w-5 text-foreground-700' />
								<h3 className='text-md font-medium text-foreground-700'>Primary Job Criteria</h3>
							</div>

							<div className='flex flex-col gap-6'>
								<Controller
									name='searchTerm'
									control={control}
									render={({ field }) => (
										<JobSearchAutocomplete
											label='Job Title or Keyword'
											placeholder='Enter job titles, specialties, or skills'
											value={field.value || ''}
											onValueChange={value => field.onChange(value)}
											onJobSelect={job => field.onChange(job.displayName)}
											errorMessage={errors.searchTerm?.message}
											isInvalid={!!errors.searchTerm}
											isRequired
											validationBehavior='aria'
											classNames={{
												base: 'text-base'
											}}
										/>
									)}
								/>

								<Controller
									name='location'
									control={control}
									render={({ field }) => (
										<LocationAutocomplete
											label='Location'
											placeholder='City, state, or country'
											value={field.value || ''}
											onValueChange={value => field.onChange(value || null)}
											onChange={location => field.onChange(location.address.displayName || null)}
											errorMessage={errors.location?.message}
											isInvalid={!!errors.location}
											allowsCustomValue
											isClearable
											onClear={() => field.onChange(null)}
										/>
									)}
								/>
							</div>
						</div>
						{/* Alert Frequency */}
						<div className='flex flex-col gap-6'>
							<div className='flex items-center mb-1'>
								<Clock className='mr-2 h-5 w-5 text-foreground-700' />
								<h3 className='text-md font-medium text-foreground-700'>Alert Frequency</h3>
							</div>
							<p className='text-sm text-foreground-500 mb-3'>How often would you like to receive job alerts?</p>
							<Controller
								name='frequency'
								control={control}
								render={({ field }) => (
									<RadioGroup
										orientation='horizontal'
										value={field.value}
										onValueChange={field.onChange}
										errorMessage={errors.frequency?.message}
										isInvalid={!!errors.frequency}
										classNames={{
											wrapper: 'gap-4'
										}}
									>
										{ALERT_FREQUENCIES.map(freq => (
											<Radio key={freq.value} value={freq.value}>
												{freq.label}
											</Radio>
										))}
									</RadioGroup>
								)}
							/>
						</div>
						{/* Filters Accordion */}
						<Accordion className='mb-6' selectionMode='multiple' variant='light'>
							{/* Job Preferences Section */}
							<AccordionItem
								key='job-preferences'
								aria-label='Job Preferences'
								startContent={<BriefcaseIcon size={16} className='text-neutral-700' />}
								title={<span className='text-md font-medium text-foreground-700'>Job Preferences</span>}
							>
								<div className='flex flex-col gap-6 mb-6'>
									{/* Job Types */}
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
													field.onChange(Array.from(keys as Set<string>));
												}}
												errorMessage={errors.jobType?.message}
												isInvalid={!!errors.jobType}
												classNames={{
													trigger: 'min-h-unit-10'
												}}
											>
												{JOB_TYPES.map(jobType => (
													<SelectItem key={jobType.value}>{jobType.label}</SelectItem>
												))}
											</Select>
										)}
									/>

									{/* Work Modes */}
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
													field.onChange(Array.from(keys as Set<string>));
												}}
												errorMessage={errors.workMode?.message}
												isInvalid={!!errors.workMode}
												classNames={{
													trigger: 'min-h-unit-10'
												}}
											>
												{WORK_MODES.map(mode => (
													<SelectItem key={mode.value}>{mode.label}</SelectItem>
												))}
											</Select>
										)}
									/>
								</div>
							</AccordionItem>

							{/* Experience & Salary Section */}
							<AccordionItem
								key='exp-salary'
								aria-label='Experience and Salary'
								startContent={<IndianRupee size={16} className='text-neutral-700' />}
								title={<span className='text-md font-medium text-foreground-700'>Experience & Salary</span>}
							>
								<div className='flex flex-col gap-6 mb-6'>
									{/* Experience Range */}
									<div className='flex flex-col gap-2'>
										<div className='text-sm font-medium text-foreground-700 gap-2 flex items-center'>
											<Clock size={16} className='mr-1.5 text-neutral-600' />
											Experience (in years)
										</div>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
											<Controller
												name='minExperience'
												control={control}
												render={({ field }) => (
													<NumberInput
														label='Minimum'
														placeholder='Min years'
														min={0}
														size='sm'
														value={field.value as number | undefined}
														onValueChange={value => {
															field.onChange(value);
														}}
														errorMessage={errors.minExperience?.message}
														isInvalid={!!errors.minExperience}
														isClearable
														onClear={() => field.onChange(null)}
													/>
												)}
											/>
											<Controller
												name='maxExperience'
												control={control}
												render={({ field }) => (
													<NumberInput
														label='Maximum'
														placeholder='Max years'
														min={0}
														size='sm'
														value={field.value as number | undefined}
														onValueChange={value => {
															field.onChange(value);
														}}
														errorMessage={errors.maxExperience?.message}
														isInvalid={!!errors.maxExperience}
														isClearable
														onClear={() => field.onChange(null)}
													/>
												)}
											/>
										</div>
									</div>

									{/* Salary Range */}
									<div className='flex flex-col gap-2'>
										<div className='text-sm font-medium text-foreground-700 gap-2 flex items-center'>
											<IndianRupee size={16} className='mr-1.5 text-neutral-600' />
											Salary Range (INR)
										</div>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
											<Controller
												name='minSalary'
												control={control}
												render={({ field }) => (
													<NumberInput
														label='Minimum'
														placeholder='Min salary'
														min={0}
														size='sm'
														startContent={<IndianRupee size={14} />}
														value={field.value as number | undefined}
														onValueChange={value => {
															field.onChange(value);
														}}
														errorMessage={errors.minSalary?.message}
														isInvalid={!!errors.minSalary}
														isClearable
														onClear={() => field.onChange(null)}
													/>
												)}
											/>
											<Controller
												name='maxSalary'
												control={control}
												render={({ field }) => (
													<NumberInput
														label='Maximum'
														placeholder='Max salary'
														min={0}
														size='sm'
														startContent={<IndianRupee size={14} />}
														value={field.value as number | undefined}
														onValueChange={value => {
															field.onChange(value);
														}}
														errorMessage={errors.maxSalary?.message}
														isInvalid={!!errors.maxSalary}
														isClearable
														onClear={() => field.onChange(null)}
													/>
												)}
											/>
										</div>
									</div>
								</div>
							</AccordionItem>
						</Accordion>
					</ModalBody>

					<ModalFooter>
						<Button variant='light' onPress={() => handleOpenChange(false)}>
							Cancel
						</Button>
						<Button color='primary' type='submit' isDisabled={!isValid || !isDirty} isLoading={isUpdatingJobAlert} className='px-6'>
							Update Alert
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}

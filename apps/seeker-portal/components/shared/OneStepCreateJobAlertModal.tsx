'use client';

import type { CreateJobAlertModalMutation as CreateJobAlertMutationType } from '@/__generated__/CreateJobAlertModalMutation.graphql';
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
import { BellIcon, BriefcaseIcon, IndianRupee } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-relay';
import { ConnectionHandler, graphql } from 'relay-runtime';
import { z } from 'zod';
import JobSearchAutocomplete from '../forms/JobSearchAutocomplete';
import LocationAutocomplete from '../forms/LocationAutocomplete';

// Job alert creation mutation
const CreateJobAlertMutation = graphql`
	mutation OneStepCreateJobAlertModalMutation($filters: AlertFiltersInput!, $frequency: JobAlertFrequency!) {
		createJobAlert(filters: $filters, frequency: $frequency) {
			__typename
			... on JobAlert {
				id
				frequency
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
			}
			... on JobAlertAlreadyExistsError {
				message
			}
			... on MaxJobAlertsReachedError {
				message
			}
		}
	}
`;

// Form schema for validation
const createAlertSchema = z
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

type CreateAlertFormValues = z.infer<typeof createAlertSchema>;

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

type Props = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	filters: {
		searchTerm: string;
		location?: string | null;
		minExperience?: number | null;
		maxExperience?: number | null;
		minSalary?: number | null;
		maxSalary?: number | null;
		workMode: ('HYBRID' | 'OFFICE' | 'REMOTE')[];
		jobType: ('FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'LOCUM')[];
	};
	frequency?: string;
};

export default function OneStepCreateJobAlertModal({ isOpen, onOpenChange, filters, frequency = 'WEEKLY' }: Props) {
	const [createJobAlert, isCreatingJobAlert] = useMutation<CreateJobAlertMutationType>(CreateJobAlertMutation);

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset
	} = useForm<CreateAlertFormValues>({
		resolver: zodResolver(createAlertSchema),
		defaultValues: {
			searchTerm: filters.searchTerm,
			jobType: filters.jobType || [],
			workMode: filters.workMode || [],
			location: filters.location || null,
			minExperience: filters.minExperience || null,
			maxExperience: filters.maxExperience || null,
			minSalary: filters.minSalary || null,
			maxSalary: filters.maxSalary || null,
			frequency: frequency as 'DAILY' | 'WEEKLY' | 'MONTHLY'
		},
		mode: 'onChange'
	});

	// Reset form when modal closes
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			reset();
		}
		onOpenChange(open);
	};

	const onSubmit = (data: CreateAlertFormValues) => {
		createJobAlert({
			variables: {
				filters: {
					searchTerm: data.searchTerm,
					jobType: data.jobType?.length ? data.jobType : null,
					workMode: data.workMode?.length ? data.workMode : null,
					location: data.location || null,
					minExperience: data.minExperience,
					maxExperience: data.maxExperience,
					minSalary: data.minSalary,
					maxSalary: data.maxSalary
				},
				frequency: data.frequency
			},
			updater: store => {
				const payload = store.getRootField('createJobAlert');
				if (!payload || payload.getValue('__typename') !== 'JobAlert') return;

				// Find the job alerts connection to update the cache
				const rootRecord = store.getRoot();
				const viewer = rootRecord.getLinkedRecord('viewer');
				if (!viewer) return;

				const connectionRecord = ConnectionHandler.getConnection(viewer, 'JobAlertsList_jobAlerts');
				if (connectionRecord) {
					const newEdge = ConnectionHandler.createEdge(store, connectionRecord, payload, 'JobAlertEdge');
					ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
				}
			},
			onCompleted: response => {
				if (response.createJobAlert.__typename === 'JobAlert') {
					addToast({
						title: 'Success!',
						description: 'Job alert created successfully',
						color: 'success'
					});
					onOpenChange(false);
				} else if (response.createJobAlert.__typename === 'JobAlertAlreadyExistsError') {
					addToast({
						title: 'Error',
						description: response.createJobAlert.message,
						color: 'danger'
					});
				} else if (response.createJobAlert.__typename === 'MaxJobAlertsReachedError') {
					addToast({
						title: 'Maximum Alerts Reached',
						description: response.createJobAlert.message,
						color: 'danger'
					});
				}
			},
			onError: error => {
				addToast({
					title: 'Error',
					description: 'Failed to create job alert. Please try again.',
					color: 'danger'
				});
				console.error('Error creating job alert:', error);
			}
		});
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='3xl' scrollBehavior='inside' className='overflow-y-auto'>
			<ModalContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader className='flex items-center gap-2 pb-2 text-sm text-foreground-600'>
						<BellIcon className='h-5 w-5 text-foreground-600' />
						Create Job Alert
					</ModalHeader>

					<ModalBody className='gap-6'>
						{/* Essential Fields Section */}
						<div className='flex flex-col gap-6'>
							{/* Search Term */}
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
									/>
								)}
							/>

							{/* Location */}
							<Controller
								name='location'
								control={control}
								render={({ field }) => (
									<LocationAutocomplete
										label='Location'
										placeholder='e.g. Chennai, Mumbai, Bangalore'
										allowsCustomValue
										value={field.value || ''}
										onValueChange={value => field.onChange(value || null)}
										onChange={location => {
											field.onChange(location?.address?.displayName || null);
										}}
										errorMessage={errors.location?.message}
										isInvalid={!!errors.location}
									/>
								)}
							/>

							{/* Frequency */}
							<Controller
								name='frequency'
								control={control}
								render={({ field }) => (
									<RadioGroup
										label='How often should we send alerts?'
										value={field.value}
										onValueChange={field.onChange}
										orientation='horizontal'
										classNames={{
											wrapper: 'gap-6'
										}}
									>
										<Radio value='DAILY'>Daily</Radio>
										<Radio value='WEEKLY'>Weekly</Radio>
										<Radio value='MONTHLY'>Monthly</Radio>
									</RadioGroup>
								)}
							/>
						</div>

						{/* Accordion for Optional Filters */}
						<Accordion variant='light' selectionMode='multiple' defaultExpandedKeys={[]}>
							{/* Job Preferences Section */}
							<AccordionItem
								key='job-preferences'
								aria-label='Job Preferences'
								startContent={<BriefcaseIcon size={16} className='text-neutral-700' />}
								title={<span className='text-sm font-medium text-foreground-700'>Job Preferences</span>}
							>
								<div className='flex flex-col gap-6 mb-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										{/* Job Types */}
										<Controller
											name='jobType'
											control={control}
											render={({ field }) => (
												<Select
													label='Job Types'
													placeholder='Select job types'
													selectionMode='multiple'
													selectedKeys={new Set(field.value || [])}
													onSelectionChange={keys => {
														field.onChange(Array.from(keys as Set<string>));
													}}
													classNames={{
														trigger: 'min-h-unit-12'
													}}
												>
													{JOB_TYPES.map(type => (
														<SelectItem key={type.value}>{type.label}</SelectItem>
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
													selectedKeys={new Set(field.value || [])}
													onSelectionChange={keys => {
														field.onChange(Array.from(keys as Set<string>));
													}}
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
								</div>
							</AccordionItem>

							{/* Experience Range Section */}
							<AccordionItem
								key='experience-range'
								aria-label='Experience Range'
								startContent={<BriefcaseIcon size={16} className='text-neutral-700' />}
								title={<span className='text-sm font-medium text-foreground-700'>Experience Range</span>}
							>
								<div className='flex flex-col gap-6 mb-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<Controller
											name='minExperience'
											control={control}
											render={({ field }) => (
												<NumberInput
													label='Minimum Experience (Years)'
													placeholder='e.g. 2'
													value={field.value ?? undefined}
													onValueChange={value => field.onChange(value ?? null)}
													formatOptions={{
														useGrouping: false
													}}
													errorMessage={errors.minExperience?.message}
													isInvalid={!!errors.minExperience}
												/>
											)}
										/>

										<Controller
											name='maxExperience'
											control={control}
											render={({ field }) => (
												<NumberInput
													label='Maximum Experience (Years)'
													placeholder='e.g. 5'
													value={field.value ?? undefined}
													onValueChange={value => field.onChange(value ?? null)}
													formatOptions={{
														useGrouping: false
													}}
													errorMessage={errors.maxExperience?.message}
													isInvalid={!!errors.maxExperience}
												/>
											)}
										/>
									</div>
								</div>
							</AccordionItem>

							{/* Salary Range Section */}
							<AccordionItem
								key='salary-range'
								aria-label='Salary Range'
								startContent={<IndianRupee size={16} className='text-neutral-700' />}
								title={<span className='text-sm font-medium text-foreground-700'>Salary Range</span>}
							>
								<div className='flex flex-col gap-6 mb-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<Controller
											name='minSalary'
											control={control}
											render={({ field }) => (
												<NumberInput
													label='Minimum Salary (₹/month)'
													placeholder='e.g. 50000'
													value={field.value ?? undefined}
													onValueChange={value => field.onChange(value ?? null)}
													formatOptions={{
														style: 'currency',
														currency: 'INR',
														currencyDisplay: 'code',
														currencySign: 'accounting'
													}}
													errorMessage={errors.minSalary?.message}
													isInvalid={!!errors.minSalary}
												/>
											)}
										/>

										<Controller
											name='maxSalary'
											control={control}
											render={({ field }) => (
												<NumberInput
													label='Maximum Salary (₹/month)'
													placeholder='e.g. 100000'
													value={field.value ?? undefined}
													onValueChange={value => field.onChange(value ?? null)}
													formatOptions={{
														style: 'currency',
														currency: 'INR',
														currencyDisplay: 'code',
														currencySign: 'accounting'
													}}
													errorMessage={errors.maxSalary?.message}
													isInvalid={!!errors.maxSalary}
												/>
											)}
										/>
									</div>
								</div>
							</AccordionItem>
						</Accordion>
					</ModalBody>

					<ModalFooter className='gap-2'>
						<Button variant='flat' onPress={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button color='primary' type='submit' isLoading={isCreatingJobAlert}>
							Create Job Alert
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}

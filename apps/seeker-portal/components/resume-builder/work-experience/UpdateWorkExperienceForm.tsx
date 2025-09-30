import type { UpdateWorkExperienceFormFragment$key } from '@/__generated__/UpdateWorkExperienceFormFragment.graphql';
import type { UpdateWorkExperienceFormMutation as UpdateWorkExperienceFormMutationType } from '@/__generated__/UpdateWorkExperienceFormMutation.graphql';
import { Button, Checkbox, Input, Kbd, Select, SelectItem, Textarea } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Plus, TrafficConeIcon, Trash } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import { ChipsInput } from '../../forms/ChipsInput';
import type { MonthYearValue } from '../../forms/MonthYearPicker';
import { MonthYearPicker, parseMonthYear, toDateString } from '../../forms/MonthYearPicker';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const UpdateWorkExperienceFormMutation = graphql`
mutation UpdateWorkExperienceFormMutation($workExperience: [WorkExperienceInput!]!) {
  updateProfileExperience(workExperience: $workExperience) {
    ...on Account {
		...IncompleteProfileBannerFragment
		...ResumeProgressAccountFragment
      profile {
          ...UpdateWorkExperienceFormFragment
		  workExperience {
      title
	  description
      organization
      startedAt
      completedAt
      employmentType
      skills
    }
      }
    }
  }
}
`;

const UpdateWorkExperienceFormFragment = graphql`
  fragment UpdateWorkExperienceFormFragment on Profile {
    __typename
    workExperience {
      title
	  description
      organization
      startedAt
      completedAt
      employmentType
      skills
    }
  }
`;

type EmploymentType = '' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'TEMPORARY' | 'VOLUNTEER' | 'OTHER';

type WorkExperienceFormType = {
	workExperience: Array<{
		title: string;
		description: string | null;
		organization: string;
		employmentType: EmploymentType;
		skills: { value: string }[];
		startedAt: MonthYearValue;
		completedAt: MonthYearValue;
		isCurrentRole?: boolean;
	}>;
};

type Props = {
	rootQuery: UpdateWorkExperienceFormFragment$key;
	onSaveChanges: () => void;
};

const EMPLOYMENT_TYPE_OPTIONS = [
	{ value: 'FULL_TIME', label: 'Full Time' },
	{ value: 'PART_TIME', label: 'Part Time' },
	{ value: 'CONTRACT', label: 'Contract' },
	{ value: 'INTERNSHIP', label: 'Internship' },
	{ value: 'TEMPORARY', label: 'Temporary' },
	{ value: 'VOLUNTEER', label: 'Volunteer' },
	{ value: 'OTHER', label: 'Other' }
];

const allowedEmploymentTypes: EmploymentType[] = [
	'',
	'FULL_TIME',
	'PART_TIME',
	'CONTRACT',
	'INTERNSHIP',
	'TEMPORARY',
	'VOLUNTEER',
	'OTHER'
];

function toEmploymentType(val: string | null | undefined): EmploymentType {
	return allowedEmploymentTypes.includes(val as EmploymentType) ? (val as EmploymentType) : '';
}

const formSchema = z.object({
	workExperience: z.array(
		z
			.object({
				title: z.string().check(z.minLength(1, 'This field is required'), z.maxLength(100)),
				description: z.nullable(z.string()),
				organization: z.string().check(z.minLength(1, 'This field is required'), z.maxLength(100)),
				employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'VOLUNTEER', 'OTHER', '']),
				skills: z.array(z.object({ value: z.string() })),
				startedAt: z.custom<MonthYearValue>(
					data => {
						if (typeof data === 'object' && data !== null && typeof data.month === 'number' && typeof data.year === 'number') {
							const now = new Date();
							if (data.year > now.getFullYear() || (data.year === now.getFullYear() && data.month > now.getMonth() + 1)) {
								return false;
							}
							return true;
						}
						return false;
					},
					{ error: 'Start date cannot be in the future' }
				),
				completedAt: z.custom<MonthYearValue>(
					data => {
						if (data === null) return true;
						if (typeof data === 'object' && data !== null && typeof data.month === 'number' && typeof data.year === 'number') {
							const now = new Date();
							if (data.year > now.getFullYear() || (data.year === now.getFullYear() && data.month > now.getMonth() + 1)) {
								return false;
							}
							return true;
						}
						return false;
					},
					{ error: 'End date cannot be in the future' }
				),
				isCurrentRole: z.boolean()
			})
			.refine(
				data => {
					if (data.startedAt && data.completedAt) {
						if (data.startedAt.year > data.completedAt.year) {
							return false;
						}
					}
					return true;
				},
				{
					message: 'Start date cannot be after end date',
					path: ['completedAt']
				}
			)
	)
});

export default function UpdateWorkExperienceForm({ rootQuery, onSaveChanges }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation<UpdateWorkExperienceFormMutationType>(UpdateWorkExperienceFormMutation);
	const data = useFragment(UpdateWorkExperienceFormFragment, rootQuery);

	const defaultWorkExperience = {
		title: '',
		description: null,
		organization: '',
		employmentType: '',
		skills: [],
		startedAt: null,
		completedAt: null,
		isCurrentRole: true
	};

	const defaultValues = useMemo(
		() =>
			data.workExperience.length > 0
				? {
						workExperience: data.workExperience.map(exp => ({
							title: exp.title,
							description: exp.description || null,
							organization: exp.organization,
							employmentType: toEmploymentType(exp.employmentType),
							skills: exp.skills.map((skill: string) => ({ value: skill })),
							startedAt: parseMonthYear(exp.startedAt),
							completedAt: parseMonthYear(exp.completedAt),
							isCurrentRole: !exp.completedAt
						}))
					}
				: {
						workExperience: []
					},
		[data.workExperience]
	);

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting, isDirty, isValid },
		reset
	} = useForm<WorkExperienceFormType>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues,
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const value = useWatch({
		control,
		name: 'workExperience'
	});

	const { fields, prepend, remove } = useFieldArray<WorkExperienceFormType>({
		control: control,
		name: 'workExperience'
	});

	function onSubmit(formData: WorkExperienceFormType) {
		commitMutation({
			variables: {
				workExperience: formData.workExperience.map(exp => ({
					title: exp.title,
					description: exp.description,
					organization: exp.organization,
					employmentType: exp.employmentType || null,
					skills: exp.skills.flatMap(skill => skill.value),
					startedAt: toDateString(exp.startedAt),
					completedAt: exp.isCurrentRole ? null : toDateString(exp.completedAt)
				}))
			},
			onCompleted(data) {
				reset({
					workExperience: data.updateProfileExperience.profile?.workExperience.map(exp => ({
						title: exp.title,
						description: exp.description || null,
						organization: exp.organization,
						employmentType: toEmploymentType(exp.employmentType),
						skills: exp.skills.map((skill: string) => ({ value: skill })),
						startedAt: parseMonthYear(exp.startedAt),
						completedAt: parseMonthYear(exp.completedAt),
						isCurrentRole: !exp.completedAt
					}))
				});
				onSaveChanges();
			}
		});
	}

	return (
		<UnsavedChangesFormWrapper
			isDirty={isDirty}
			isValid={isValid}
			onSave={handleSubmit(onSubmit)}
			onCancel={() => reset()}
			isLoading={isSubmitting || isMutationInFlight}
		>
			<form className='space-y-12'>
				<div className='pb-6 space-y-6'>
					<div className='flex flex-col sm:flex-row sm:items-center gap-4 justify-between w-full'>
						<h1 className='text-xl text-foreground-500 font-medium'>Work Experience</h1>
						{fields.length > 0 && (
							<Button
								type='button'
								variant='bordered'
								className='w-full sm:w-auto'
								startContent={<Plus size={18} />}
								onPress={() => prepend({ ...defaultWorkExperience }, { shouldFocus: true })}
							>
								Add Work Experience
							</Button>
						)}
					</div>
					<div className='w-full space-y-12 items-center'>
						{fields.length === 0 ? (
							<div className='flex flex-col items-center gap-8 rounded-lg border-foreground-300 border-2 border-dashed p-12 text-center'>
								<div className='w-16 h-16 rounded-full bg-foreground-200 flex items-center justify-center'>
									<TrafficConeIcon className='w-8 h-8 text-foreground-600' />
								</div>
								<div className='space-y-2'>
									<h3 className='text-base sm:text-lg font-semibold text-foreground-700'>Build Your Career Story</h3>
									<p className='text-foreground-500 max-w-sm text-sm sm:text-base'>
										Showcase your professional journey. Add your work experience to help employers understand your background.
									</p>
								</div>
								<Button
									type='button'
									color='default'
									size='lg'
									startContent={<Plus size={20} />}
									onPress={() => prepend(defaultWorkExperience, { shouldFocus: true })}
								>
									Add Your First Experience
								</Button>
							</div>
						) : (
							fields.map((item, index) => (
								<div key={item.id} className='flex flex-col gap-8 items-end w-full'>
									<div className='w-full space-y-4'>
										<Controller
											name={`workExperience.${index}.title`}
											control={control}
											defaultValue=''
											render={({ field }) => (
												<Input
													{...field}
													fullWidth
													label='Title'
													placeholder='Add job title'
													variant='bordered'
													errorMessage={errors.workExperience?.[index]?.title?.message}
													isInvalid={!!errors.workExperience?.[index]?.title}
													classNames={{
														inputWrapper: 'bg-background'
													}}
												/>
											)}
										/>
									</div>
									<div className='w-full space-y-4'>
										<Controller
											name={`workExperience.${index}.organization`}
											control={control}
											defaultValue=''
											render={({ field }) => (
												<Input
													{...field}
													fullWidth
													variant='bordered'
													label='Organization'
													placeholder='Add organization'
													errorMessage={errors.workExperience?.[index]?.organization?.message}
													isInvalid={!!errors.workExperience?.[index]?.organization}
													classNames={{
														inputWrapper: 'bg-background'
													}}
												/>
											)}
										/>
									</div>
									<div className='w-full space-y-4'>
										<Controller
											name={`workExperience.${index}.employmentType`}
											control={control}
											defaultValue={''}
											render={({ field }) => (
												<Select
													{...field}
													variant='bordered'
													label='Employment Type'
													placeholder='Select employment type'
													selectionMode='single'
													selectedKeys={field.value ? [field.value] : ['']}
													defaultSelectedKeys={field.value ? [field.value] : ['']}
													onSelectionChange={keys => {
														const value = Array.from(keys)[0] as EmploymentType;
														field.onChange(value);
													}}
													errorMessage={errors.workExperience?.[index]?.employmentType?.message}
													isInvalid={!!errors.workExperience?.[index]?.employmentType}
													classNames={{
														trigger: 'bg-background'
													}}
												>
													{EMPLOYMENT_TYPE_OPTIONS.map(option => (
														<SelectItem key={option.value}>{option.label}</SelectItem>
													))}
												</Select>
											)}
										/>
									</div>
									<div className='w-full flex gap-4 items-center'>
										<Controller
											name={`workExperience.${index}.isCurrentRole`}
											control={control}
											render={({ field }) => (
												<Checkbox
													isSelected={field.value}
													onValueChange={field.onChange}
													aria-label='I am currently working in this role'
													className='mb-2'
												>
													I am currently working in this role
												</Checkbox>
											)}
										/>
									</div>
									<div className='w-full flex flex-col sm:flex-row gap-4'>
										<Controller
											name={`workExperience.${index}.startedAt`}
											control={control}
											render={({ field }) => (
												<MonthYearPicker
													variant='bordered'
													label='Start Date'
													value={field.value}
													onChange={field.onChange}
													errorMessage={errors.workExperience?.[index]?.startedAt?.message}
													isInvalid={!!errors.workExperience?.[index]?.startedAt}
													selectProps={{
														classNames: {
															trigger: 'bg-background'
														}
													}}
												/>
											)}
										/>
										<Controller
											name={`workExperience.${index}.completedAt`}
											control={control}
											render={({ field }) => {
												const isCurrentRole = value[index]?.isCurrentRole || false;
												return (
													<MonthYearPicker
														variant='bordered'
														label='End Date'
														value={isCurrentRole ? null : field.value}
														onChange={field.onChange}
														isDisabled={isCurrentRole}
														errorMessage={errors.workExperience?.[index]?.completedAt?.message}
														isInvalid={!!errors.workExperience?.[index]?.completedAt}
														selectProps={{
															classNames: {
																trigger: 'bg-background'
															}
														}}
													/>
												);
											}}
										/>
									</div>
									<div className='w-full space-y-4'>
										<Controller
											name={`workExperience.${index}.description`}
											control={control}
											render={({ field }) => (
												<Textarea
													{...field}
													variant='bordered'
													fullWidth
													value={field.value || ''}
													label='Description'
													placeholder='List your major responsibilities and achievements, highlighting standout projects.'
													errorMessage={errors.workExperience?.[index]?.description?.message}
													isInvalid={!!errors.workExperience?.[index]?.description}
													classNames={{
														inputWrapper: 'bg-background'
													}}
												/>
											)}
										/>
									</div>
									<div className='w-full space-y-4'>
										<ChipsInput<WorkExperienceFormType, `workExperience.${number}.skills`>
											name={`workExperience.${index}.skills`}
											control={control}
											label='Skills'
											variant='bordered'
											delimiters={[',', 'Enter']}
											inputProps={{
												variant: 'bordered',
												placeholder: 'Enter skills...',
												description: (
													<p className='mt-2'>
														Separate skills with commas or Enter <Kbd keys={['enter']} classNames={{ base: 'p-0 px-2 shadow-none' }} />
													</p>
												),
												classNames: {
													inputWrapper: 'bg-background'
												}
											}}
										/>
									</div>

									<Button
										type='button'
										variant='bordered'
										startContent={<Trash size={18} />}
										onPress={() => {
											remove(index);
										}}
									>
										Delete Experience
									</Button>
								</div>
							))
						)}
					</div>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}

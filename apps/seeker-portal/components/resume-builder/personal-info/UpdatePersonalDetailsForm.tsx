import type { UpdatePersonalDetailsFormFragment$key } from '@/__generated__/UpdatePersonalDetailsFormFragment.graphql';
import type { UpdatePersonalDetailsFormMutation as UpdatePersonalDetailsFormMutationType } from '@/__generated__/UpdatePersonalDetailsFormMutation.graphql';
import LocationAutocomplete from '@/components/forms/LocationAutocomplete';
import { DatePicker, Input, Select, SelectItem } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { CalendarDate, parseDate } from '@internationalized/date';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4-mini';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const UpdatePersonalDetailsFormMutation = graphql`
mutation UpdatePersonalDetailsFormMutation($gender: GenderType, $dateOfBirth: Date, $maritalStatus: MaritalStatusType, $category: String, $address: String) {
	updateProfilePersonalDetails(gender: $gender, dateOfBirth: $dateOfBirth, maritalStatus: $maritalStatus, category: $category,address: $address) {
		__typename
		...on Account {
			...IncompleteProfileBannerFragment
			...ResumeProgressAccountFragment
			profile {
				...UpdatePersonalDetailsFormFragment
			}
		}
		... on InvalidLocationError {
			message
		}
	}
}
`;
const UpdatePersonalDetailsFormFragment = graphql`
  fragment UpdatePersonalDetailsFormFragment on  Profile {
    gender
    dateOfBirth
    maritalStatus
    category
	address
  }
`;

type Props = {
	rootQuery: UpdatePersonalDetailsFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	gender: z.union([z.literal('MALE'), z.literal('FEMALE'), z.literal('OTHER'), z.null()]),
	dateOfBirth: z.nullable(z.custom<CalendarDate>(data => data instanceof CalendarDate)),
	maritalStatus: z.union([z.literal('MARRIED'), z.literal('SINGLE'), z.null()]),
	category: z.nullable(z.string().check(z.maxLength(25, 'Category is too long'))),
	address: z.nullable(z.string())
});

export default function UpdatePersonalDetailsForm({ rootQuery, onSaveChanges }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation<UpdatePersonalDetailsFormMutationType>(UpdatePersonalDetailsFormMutation);
	const data = useFragment(UpdatePersonalDetailsFormFragment, rootQuery);

	const defaultValues: z.infer<typeof formSchema> = {
		category: data.category ?? null,
		gender: ['MALE', 'FEMALE', 'OTHER'].includes(data.gender ?? '') ? (data.gender as 'MALE' | 'FEMALE' | 'OTHER') : null,
		maritalStatus: ['MARRIED', 'SINGLE'].includes(data.maritalStatus ?? '') ? (data.maritalStatus as 'MARRIED' | 'SINGLE') : null,
		dateOfBirth: data.dateOfBirth ? parseDate(data.dateOfBirth) : null,
		address: String(data.address ?? '')
	};

	const {
		handleSubmit,
		control,
		reset,
		setError,
		formState: { errors, isSubmitting, isDirty, isValid }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				gender: formData.gender || null,
				dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toString() : null,
				category: formData.category || null,
				maritalStatus: formData.maritalStatus || null,
				address: formData.address || null
			},
			onCompleted(data) {
				if (data.updateProfilePersonalDetails.__typename === 'InvalidLocationError') {
					setError('address', { message: data.updateProfilePersonalDetails.message });
					return;
				}
				reset(formData);
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
					<h1 className='w-full text-xl text-foreground-500 font-medium'>Personal Details</h1>
					<div className='mb-12'>
						<Controller
							name='gender'
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									fullWidth
									label='Gender'
									placeholder='Add your gender'
									selectionMode='single'
									value={field.value ?? ''}
									selectedKeys={[field.value ?? '']}
									defaultSelectedKeys={[field.value ?? '']}
									onSelectionChange={field.onChange}
									errorMessage={errors.gender?.message}
									isInvalid={!!errors.gender}
									classNames={{
										trigger: 'bg-background'
									}}
								>
									<SelectItem key={'MALE'}>Male</SelectItem>
									<SelectItem key={'FEMALE'}>Female</SelectItem>
									<SelectItem key={'OTHER'}>Other</SelectItem>
								</Select>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='dateOfBirth'
							control={control}
							render={({ field }) => {
								return (
									<DatePicker
										fullWidth
										showMonthAndYearPickers
										label='Date of Birth'
										{...field}
										value={field.value as any}
										onChange={field.onChange}
										errorMessage={errors.dateOfBirth?.message}
										isInvalid={!!errors.dateOfBirth}
										classNames={{
											inputWrapper: 'bg-background'
										}}
									/>
								);
							}}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='maritalStatus'
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									fullWidth
									label='Marital Status'
									placeholder='Add your marital status'
									selectionMode='single'
									value={field.value ?? ''}
									selectedKeys={[field.value ?? '']}
									defaultSelectedKeys={[field.value ?? '']}
									onSelectionChange={field.onChange}
									errorMessage={errors.maritalStatus?.message}
									isInvalid={!!errors.maritalStatus}
									classNames={{
										trigger: 'bg-background'
									}}
								>
									<SelectItem key={'SINGLE'}>Single</SelectItem>
									<SelectItem key={'MARRIED'}>Married</SelectItem>
								</Select>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='category'
							control={control}
							defaultValue=''
							render={({ field }) => (
								<Input
									{...field}
									label='Category'
									placeholder='Add your category'
									value={field.value ?? ''}
									errorMessage={errors.category?.message}
									isInvalid={!!errors.category}
									classNames={{
										inputWrapper: 'bg-background'
									}}
								/>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='address'
							control={control}
							render={({ field }) => (
								<LocationAutocomplete
									label='Current Address'
									labelPlacement='outside'
									value={field.value || ''}
									onValueChange={field.onChange}
									onChange={location => {
										if (location.address.displayName) field.onChange(location.address.displayName);
									}}
									placeholder='Enter your address'
									errorMessage={errors.address?.message}
									isInvalid={!!errors.address}
									inputProps={{
										classNames: {
											inputWrapper: 'bg-background'
										}
									}}
								/>
							)}
						/>
					</div>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}

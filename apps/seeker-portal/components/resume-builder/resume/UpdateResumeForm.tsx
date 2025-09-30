import type { UpdateResumeFormFragment$key } from '@/__generated__/UpdateResumeFormFragment.graphql';
import { Checkbox, CheckboxGroup, Chip, Divider, Input, Switch } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import LocationAutocomplete from '../../forms/LocationAutocomplete';
import { SteppableNumberInput } from '../../forms/SteppableNumberInput';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const UpdateResumeFormMutation = graphql`
mutation UpdateResumeFormMutation($resumeUrl: String!) {
  updateProfileResume(Resume: $Resume) {
    ...on Account {
        ...IncompleteProfileBannerFragment
        ...ResumeProgressAccountFragment
      profile {
          ...UpdateResumeFormFragment
      }
    }
  }
}
`;

const UpdateResumeFormFragment = graphql`
  fragment UpdateResumeFormFragment on Profile {
    __typename

  }
`;

type Props = {
	rootQuery: UpdateResumeFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	currentIndustry: z.nullable(z.string()),
	desiredJobTypes: z.array(z.string()),
	desiredWorkModes: z.array(z.string()),
	expectedSalary: z.nullable(z.number().min(0)),
	openToRelocationAnywhere: z.boolean(),
	locationsOpenToWork: z.array(z.string())
});

export default function UpdateResumeForm({ rootQuery, onSaveChanges }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(UpdateResumeFormMutation);
	const data = useFragment(UpdateResumeFormFragment, rootQuery);
	const [inputValue, setInputValue] = useState('');

	const defaultValues: z.infer<typeof formSchema> = {
		currentIndustry: data.Resume?.currentIndustry ?? null,
		desiredJobTypes: data.Resume?.desiredJobTypes ?? [],
		desiredWorkModes: data.Resume?.desiredWorkModes ?? [],
		expectedSalary: data.Resume?.expectedSalary ?? null,
		openToRelocationAnywhere: data.Resume?.openToRelocationAnywhere || false,
		locationsOpenToWork: (data.Resume?.locationsOpenToWork || []) as string[]
	};

	const {
		handleSubmit,
		control,
		setValue,
		reset,
		formState: { errors, isSubmitting, isDirty, isValid }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues
	});

	const locations = useWatch({ control, name: 'locationsOpenToWork' }) || [];

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				Resume: {
					currentIndustry: formData.currentIndustry,
					desiredJobTypes: formData.desiredJobTypes,
					desiredWorkModes: formData.desiredWorkModes,
					expectedSalary: formData.expectedSalary,
					locationsOpenToWork: formData.locationsOpenToWork || [],
					openToRelocationAnywhere: formData.openToRelocationAnywhere
				}
			},
			onCompleted() {
				reset(formData);
				onSaveChanges();
			}
		});
	}

	function handleRemoveLocation(loc: string) {
		setValue('locationsOpenToWork', locations.filter((l: string) => l !== loc) as string[], { shouldDirty: true, shouldValidate: true });
	}

	return (
		<UnsavedChangesFormWrapper isDirty={isDirty} isValid={isValid} onSave={handleSubmit(onSubmit)} onCancel={() => reset()}>
			<form className='space-y-12'>
				<div className='pb-6 space-y-6'>
					<h1 className='w-full text-xl text-foreground-500 font-medium'>Career Profile</h1>
					<div className='mb-12'>
						<Controller
							name='currentIndustry'
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									label='Current Industry'
									placeholder='Enter your current industry'
									value={field.value ?? ''}
									errorMessage={errors.currentIndustry?.message}
									isInvalid={!!errors.currentIndustry}
									classNames={{
										inputWrapper: 'bg-background'
									}}
								/>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='expectedSalary'
							control={control}
							render={({ field }) => (
								<SteppableNumberInput
									{...field}
									label='Expected Salary'
									placeholder='Enter expected salary'
									formatOptions={{
										style: 'currency',
										currency: 'INR',
										currencyDisplay: 'code',
										currencySign: 'accounting'
									}}
									value={field.value as number | undefined}
									onValueChange={field.onChange}
									step={1000}
									isClearable
									onClear={() => field.onChange(null)}
									errorMessage={errors.expectedSalary?.message}
									isInvalid={!!errors.expectedSalary}
									classNames={{
										inputWrapper: 'bg-background'
									}}
								/>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='desiredWorkModes'
							control={control}
							render={({ field }) => (
								<CheckboxGroup
									label='Desired Work Modes'
									value={field.value}
									onValueChange={field.onChange}
									classNames={{
										base: 'gap-4',
										wrapper: 'gap-6 flex w-full items-center flex-wrap'
									}}
									orientation='horizontal'
									errorMessage={errors.desiredWorkModes?.message}
									isInvalid={!!errors.desiredWorkModes}
								>
									<Checkbox value='REMOTE'>Remote</Checkbox>
									<Checkbox value='HYBRID'>Hybrid</Checkbox>
									<Checkbox value='OFFICE'>Office</Checkbox>
								</CheckboxGroup>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='desiredJobTypes'
							control={control}
							render={({ field }) => (
								<CheckboxGroup
									label='Desired Job Types'
									value={field.value}
									onValueChange={field.onChange}
									classNames={{
										base: 'gap-4',
										wrapper: 'gap-6 flex w-full items-center flex-wrap'
									}}
									orientation='horizontal'
									errorMessage={errors.desiredJobTypes?.message}
									isInvalid={!!errors.desiredJobTypes}
								>
									<Checkbox value='FULL_TIME'>Full Time</Checkbox>
									<Checkbox value='PART_TIME'>Part Time</Checkbox>
									<Checkbox value='INTERNSHIP'>Internship</Checkbox>
									<Checkbox value='CONTRACT'>Contract</Checkbox>
									<Checkbox value='LOCUM'>Locum</Checkbox>
								</CheckboxGroup>
							)}
						/>
					</div>
					<Divider />
					<div className='mb-12 flex flex-col gap-6'>
						<div className='flex items-center gap-4 mb-4'>
							<Controller
								name='openToRelocationAnywhere'
								control={control}
								render={({ field }) => <Switch isSelected={field.value} onValueChange={field.onChange} />}
							/>
							<span>Open to relocation anywhere</span>
						</div>
						{errors.locationsOpenToWork && <div className='text-red-500 text-sm mb-2'>{errors.locationsOpenToWork.message}</div>}
						<div className='flex flex-col w-full gap-2'>
							<div className='block'>Preferred work locations</div>

							<LocationAutocomplete
								value={inputValue}
								onValueChange={setInputValue}
								onChange={location => {
									if (location.address.displayName && !locations.includes(location.address.displayName)) {
										setValue('locationsOpenToWork', [...locations, location.address.displayName] as string[], {
											shouldValidate: true,
											shouldDirty: true
										});
									}
									setInputValue('');
								}}
								onClear={() => setInputValue('')}
								placeholder='Add a location'
								inputProps={{
									classNames: {
										inputWrapper: 'bg-background'
									}
								}}
							/>
							{locations && (
								<div className='flex flex-wrap gap-2 mt-4'>
									{locations?.map((loc: string) => (
										<Chip key={loc} isCloseable size='md' onClose={() => handleRemoveLocation(loc)}>
											{loc}
										</Chip>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}

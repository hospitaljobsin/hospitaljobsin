import type { UpdateLocationPreferencesFormFragment$key } from '@/__generated__/UpdateLocationPreferencesFormFragment.graphql';
import { Button, Chip, Switch } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4-mini';
import LocationAutocomplete from '../../forms/LocationAutocomplete';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const UpdateLocationPreferencesFormFragment = graphql`
  fragment UpdateLocationPreferencesFormFragment on Profile {
    locationsOpenToWork
    openToRelocationAnywhere
    address
  }
`;

const UpdateLocationPreferencesMutation = graphql`
  mutation UpdateLocationPreferencesFormMutation($locationsOpenToWork: [String!]!, $openToRelocationAnywhere: Boolean!, $address: String!) {
    updateProfileLocationPreferences(locationsOpenToWork: $locationsOpenToWork, openToRelocationAnywhere: $openToRelocationAnywhere, address: $address) {
      ... on Account {
		...IncompleteProfileBannerFragment
		...ResumeProgressAccountFragment
        profile {
            ...UpdateLocationPreferencesFormFragment
        }
      }
    }
  }
`;

const formSchema = z.object({
	openToRelocationAnywhere: z.boolean(),
	locationsOpenToWork: z.array(z.string()),
	address: z.string().check(z.minLength(3, 'Address is required'))
});

export default function UpdateLocationPreferencesForm({
	rootQuery,
	onSaveChanges
}: {
	rootQuery: UpdateLocationPreferencesFormFragment$key;
	onSaveChanges: () => void;
}) {
	const data = useFragment(UpdateLocationPreferencesFormFragment, rootQuery);
	const [commit, isInFlight] = useMutation(UpdateLocationPreferencesMutation);
	const [inputValue, setInputValue] = useState('');

	const defaultValues = {
		openToRelocationAnywhere: data.openToRelocationAnywhere || false,
		locationsOpenToWork: (data.locationsOpenToWork || []) as string[],
		address: String(data.address ?? '')
	};

	const {
		handleSubmit,
		control,
		setValue,
		reset,
		formState: { errors, isSubmitting, isDirty }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues
	});

	const locations = useWatch({ control, name: 'locationsOpenToWork' }) || [];

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commit({
			variables: {
				locationsOpenToWork: formData.locationsOpenToWork || [],
				openToRelocationAnywhere: formData.openToRelocationAnywhere,
				address: formData.address
			},
			onCompleted() {
				onSaveChanges();
			}
		});
	}

	function handleRemoveLocation(loc: string) {
		setValue('locationsOpenToWork', locations.filter((l: string) => l !== loc) as string[]);
	}

	return (
		<UnsavedChangesFormWrapper isDirty={isDirty} onSave={() => handleSubmit(onSubmit)()} onCancel={() => reset()}>
			<form className='space-y-12' onSubmit={handleSubmit(onSubmit)}>
				<div className='pb-4 sm:pb-6 space-y-4 sm:space-y-6 w-full'>
					<h1 className='w-full text-xl text-foreground-500 font-medium'>Location Preferences</h1>
					<div className='w-full flex flex-col gap-8'>
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
						<div className='flex items-center gap-4'>
							<Controller
								name='openToRelocationAnywhere'
								control={control}
								render={({ field }) => <Switch isSelected={field.value} onValueChange={e => field.onChange(e)} />}
							/>
							<span>Open to relocation anywhere</span>
						</div>
						{errors.locationsOpenToWork && <div className='text-red-500 text-sm'>{errors.locationsOpenToWork.message}</div>}
						<div className='mt-4  flex flex-col w-full gap-4'>
							<div className='block mb-2'>Preferred work locations</div>
							<div className='flex flex-wrap gap-2 mb-2'>
								{locations?.map((loc: string) => (
									<Chip key={loc} isCloseable size='lg' onClose={() => handleRemoveLocation(loc)}>
										{loc}
									</Chip>
								))}
							</div>
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
								placeholder='Add a location'
								inputProps={{
									classNames: {
										inputWrapper: 'bg-background'
									}
								}}
							/>
						</div>
					</div>
				</div>
				<div className='flex flex-col-reverse sm:flex-row justify-end gap-4 w-full'>
					<Button type='submit' isLoading={isSubmitting || isInFlight} className='w-full sm:w-auto'>
						Save Changes
					</Button>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}

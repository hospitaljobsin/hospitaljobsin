'use client';

import LocationAutocomplete from '@/components/forms/LocationAutocomplete';
import { Button, Chip, Divider, Switch } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { graphql, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import type { CareerProfileStepMutation as CareerProfileStepMutationType } from '@/__generated__/CareerProfileStepMutation.graphql';
import CompleteProfileContext from '../CompleteProfileContext';

const CareerProfileStepMutation = graphql`
mutation CareerProfileStepMutation($locationsOpenToWork: [String!]!, $openToRelocationAnywhere: Boolean!) {
	updateProfileCareerProfile(locationsOpenToWork: $locationsOpenToWork, openToRelocationAnywhere: $openToRelocationAnywhere, desiredJobTypes: [], desiredWorkModes: []) {
		...on Account {
			profile {
				careerProfile {
					locationsOpenToWork
					openToRelocationAnywhere
				}
			}
		}
	}
}
`;

const careerProfileSchema = z.object({
	openToRelocationAnywhere: z.boolean(),
	locationsOpenToWork: z.array(z.string())
});

export default function CareerProfileStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const locationsOpenToWork = CompleteProfileContext.useSelector(state => state.context.locationsOpenToWork);
	const openToRelocationAnywhere = CompleteProfileContext.useSelector(state => state.context.openToRelocationAnywhere);

	const [inputValue, setInputValue] = useState('');

	const { control, handleSubmit, formState, setValue } = useForm<z.infer<typeof careerProfileSchema>>({
		resolver: standardSchemaResolver(careerProfileSchema),
		defaultValues: {
			locationsOpenToWork: locationsOpenToWork || [],
			openToRelocationAnywhere: openToRelocationAnywhere || false
		}
	});

	const locations = useWatch({ control, name: 'locationsOpenToWork' }) || [];

	const [commitMutation] = useMutation<CareerProfileStepMutationType>(CareerProfileStepMutation);

	const onSubmit = (data: z.infer<typeof careerProfileSchema>) => {
		commitMutation({
			variables: {
				locationsOpenToWork: data.locationsOpenToWork || [],
				openToRelocationAnywhere: data.openToRelocationAnywhere
			},
			onCompleted() {
				send({
					type: 'SUBMIT_CAREER_PROFILE',
					locationsOpenToWork: data.locationsOpenToWork || [],
					openToRelocationAnywhere: data.openToRelocationAnywhere
				});
			}
		});
	};

	const handlePrevious = () => {
		send({ type: 'PREVIOUS_STEP' });
	};

	function handleRemoveLocation(loc: string) {
		setValue('locationsOpenToWork', locations.filter((l: string) => l !== loc) as string[], { shouldDirty: true, shouldValidate: true });
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Career Profile</h3>
				<p className='text-sm text-foreground-600'>Let employers know where you're willing to work.</p>
			</div>

			<Divider />
			<div className='flex flex-col gap-6'>
				<div className='flex items-center gap-4 mb-4'>
					<Controller
						name='openToRelocationAnywhere'
						control={control}
						render={({ field }) => <Switch isSelected={field.value} onValueChange={field.onChange} />}
					/>
					<span>Open to relocation anywhere</span>
				</div>
				{formState.errors.locationsOpenToWork && (
					<div className='text-red-500 text-sm mb-2'>{formState.errors.locationsOpenToWork.message}</div>
				)}
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
								setInputValue('');
							}
						}}
						onClear={() => setInputValue('')}
						placeholder='Add a location'
						variant='bordered'
						inputProps={{
							classNames: {
								inputWrapper: 'bg-background'
							},
							variant: 'bordered'
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

			<div className='flex gap-3'>
				<Button type='button' variant='flat' fullWidth onPress={handlePrevious}>
					Previous
				</Button>
				<Button type='submit' color='primary' fullWidth isLoading={formState.isSubmitting}>
					Continue
				</Button>
			</div>
		</form>
	);
}

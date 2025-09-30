'use client';

import { Button, Checkbox, Input } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import CompleteProfileContext from '../CompleteProfileContext';

const careerProfileSchema = z
	.object({
		locationsOpenToWork: z.array(z.string()).optional(),
		openToRelocationAnywhere: z.boolean()
	})
	.refine(data => data.openToRelocationAnywhere || (data.locationsOpenToWork && data.locationsOpenToWork.length > 0), {
		message: 'Please either select specific locations or indicate you are open to relocation anywhere',
		path: ['root']
	});

export default function CareerProfileStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const locationsOpenToWork = CompleteProfileContext.useSelector(state => state.context.locationsOpenToWork);
	const openToRelocationAnywhere = CompleteProfileContext.useSelector(state => state.context.openToRelocationAnywhere);

	const [newLocation, setNewLocation] = useState('');
	const [locations, setLocations] = useState<string[]>(locationsOpenToWork || []);

	const { control, handleSubmit, formState, watch, setValue } = useForm<z.infer<typeof careerProfileSchema>>({
		resolver: standardSchemaResolver(careerProfileSchema),
		defaultValues: {
			locationsOpenToWork: locationsOpenToWork || [],
			openToRelocationAnywhere: openToRelocationAnywhere || false
		}
	});

	const watchOpenToRelocationAnywhere = watch('openToRelocationAnywhere');

	const onSubmit = async (data: z.infer<typeof careerProfileSchema>) => {
		// Mock mutation call
		console.log('Saving career profile:', data);

		send({
			type: 'SUBMIT_CAREER_PROFILE',
			locationsOpenToWork: data.locationsOpenToWork || [],
			openToRelocationAnywhere: data.openToRelocationAnywhere
		});
	};

	const handlePrevious = () => {
		send({ type: 'PREVIOUS_STEP' });
	};

	const addLocation = () => {
		if (newLocation.trim() && !locations.includes(newLocation.trim())) {
			const updatedLocations = [...locations, newLocation.trim()];
			setLocations(updatedLocations);
			setValue('locationsOpenToWork', updatedLocations);
			setNewLocation('');
		}
	};

	const removeLocation = (locationToRemove: string) => {
		const updatedLocations = locations.filter(loc => loc !== locationToRemove);
		setLocations(updatedLocations);
		setValue('locationsOpenToWork', updatedLocations);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Career Profile</h3>
				<p className='text-sm text-foreground-600'>Let employers know where you're willing to work.</p>
			</div>

			<Controller
				name='openToRelocationAnywhere'
				control={control}
				render={({ field }) => (
					<Checkbox isSelected={field.value} onValueChange={field.onChange}>
						I am open to relocation anywhere
					</Checkbox>
				)}
			/>

			{!watchOpenToRelocationAnywhere && (
				<div className='space-y-4'>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Specific Locations</label>
						<div className='flex gap-2'>
							<Input
								value={newLocation}
								onChange={e => setNewLocation(e.target.value)}
								placeholder='Enter a city or state'
								onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addLocation())}
							/>
							<Button type='button' color='primary' variant='flat' isIconOnly onPress={addLocation} isDisabled={!newLocation.trim()}>
								<Plus size={16} />
							</Button>
						</div>
					</div>

					{locations.length > 0 && (
						<div className='space-y-2'>
							<p className='text-sm text-foreground-600'>Selected locations:</p>
							<div className='flex flex-wrap gap-2'>
								{locations.map(location => (
									<div key={location} className='flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm'>
										{location}
										<button type='button' onClick={() => removeLocation(location)} className='ml-1 hover:text-primary-900'>
											<X size={14} />
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{formState.errors.root && <p className='text-danger text-sm'>{formState.errors.root.message}</p>}

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

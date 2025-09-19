'use client';

import { Button } from '@heroui/react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import JobSearchAutocomplete from '../../forms/JobSearchAutocomplete';
import LocationAutocomplete from '../../forms/LocationAutocomplete';
import type { CreateAlertFormValues } from './JobAlertFormMachine';
import JobAlertFormContext from './JobAlertFormMachine';

type Step1Props = {
	control: Control<CreateAlertFormValues>;
	errors: FieldErrors<CreateAlertFormValues>;
};

export default function JobAlertStep1({ control, errors }: Step1Props) {
	const { send } = JobAlertFormContext.useActorRef();

	// Watch the searchTerm field to enable/disable the Next button
	const searchTerm = useWatch({
		control,
		name: 'searchTerm',
		defaultValue: ''
	});

	// The Next button is enabled if there is a search term value
	const canProceed = Boolean(searchTerm);

	return (
		<div className='space-y-8'>
			<div className='space-y-8'>
				<div className='space-y-2'>
					<h3 className='text-lg font-semibold text-foreground-800'>Primary Job Criteria</h3>
					<p className='text-sm text-foreground-500'>Start with the most important details for your job alert</p>
				</div>

				{/* Search Term */}
				<div className='mb-4'>
					<Controller
						name='searchTerm'
						control={control}
						render={({ field }) => (
							<JobSearchAutocomplete
								label='Job Title or Keyword'
								placeholder='Enter job titles, specialties, or skills'
								value={field.value || ''}
								onValueChange={value => {
									field.onChange(value || '');
									send({ type: 'UPDATE_FIELD', field: 'searchTerm', value: value || '' });
								}}
								onJobSelect={job => {
									field.onChange(job.displayName);
									send({ type: 'UPDATE_FIELD', field: 'searchTerm', value: job.displayName });
								}}
								errorMessage={errors.searchTerm?.message}
								isInvalid={!!errors.searchTerm}
								isRequired
								validationBehavior='aria'
							/>
						)}
					/>
				</div>

				{/* Location */}
				<div className='mb-4'>
					<Controller
						name='location'
						control={control}
						render={({ field }) => (
							<LocationAutocomplete
								label='Location'
								placeholder='City, state, or country'
								value={field.value || ''}
								onValueChange={value => {
									field.onChange(value || null);
									send({ type: 'UPDATE_FIELD', field: 'location', value: value || null });
								}}
								onChange={location => {
									field.onChange(location.address.displayName || null);
									send({ type: 'UPDATE_FIELD', field: 'location', value: location.address.displayName || null });
								}}
								errorMessage={errors.location?.message}
								isInvalid={!!errors.location}
								allowsCustomValue
							/>
						)}
					/>
				</div>
			</div>

			{/* Navigation */}
			<div className='flex justify-end'>
				<Button color='primary' onPress={() => send({ type: 'NEXT' })} isDisabled={!canProceed} fullWidth>
					Next
				</Button>
			</div>
		</div>
	);
}

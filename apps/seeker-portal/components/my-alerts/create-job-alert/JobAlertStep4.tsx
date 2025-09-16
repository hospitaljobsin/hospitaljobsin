'use client';

import { Button, Radio, RadioGroup } from '@heroui/react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CreateAlertFormValues } from './JobAlertFormMachine';
import JobAlertFormContext from './JobAlertFormMachine';

// Alert frequency options
const ALERT_FREQUENCIES = [
	{ value: 'DAILY', label: 'Daily' },
	{ value: 'WEEKLY', label: 'Weekly' },
	{ value: 'MONTHLY', label: 'Monthly' }
];

type Step4Props = {
	control: Control<CreateAlertFormValues>;
	errors: FieldErrors<CreateAlertFormValues>;
	handleSubmit: () => void;
	isSubmitting: boolean;
};

export default function JobAlertStep4({ control, errors, handleSubmit, isSubmitting }: Step4Props) {
	const { send } = JobAlertFormContext.useActorRef();

	return (
		<div className='space-y-8'>
			<div className='space-y-8'>
				<div className='space-y-2'>
					<h3 className='text-lg font-semibold text-foreground-800'>Notification Frequency</h3>
					<p className='text-sm text-foreground-500'>Choose how often you want to receive job alerts</p>
				</div>

				{/* Alert Frequency */}

				<Controller
					name='frequency'
					control={control}
					render={({ field }) => (
						<RadioGroup
							orientation='horizontal'
							value={field.value}
							onValueChange={value => {
								field.onChange(value);
								send({ type: 'UPDATE_FIELD', field: 'frequency', value });
							}}
							errorMessage={errors.frequency?.message}
							isInvalid={!!errors.frequency}
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

			{/* Navigation */}
			<div className='flex justify-between gap-6'>
				<Button variant='flat' onPress={() => send({ type: 'BACK' })} fullWidth>
					Back
				</Button>
				<Button
					color='primary'
					onPress={() => {
						send({ type: 'SUBMIT' });
						handleSubmit();
					}}
					isLoading={isSubmitting}
					fullWidth
				>
					Create Alert
				</Button>
			</div>
		</div>
	);
}

'use client';

import { Button, Card, CardBody, Radio, RadioGroup } from '@heroui/react';
import { Clock } from 'lucide-react';
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
			<div className='space-y-4'>
				<h3 className='text-lg font-semibold text-foreground-800'>Notification Frequency</h3>
				<p className='text-sm text-foreground-500'>Choose how often you want to receive job alerts</p>

				{/* Alert Frequency */}
				<Card shadow='sm' className='p-0'>
					<CardBody className='py-3 px-4'>
						<div className='flex items-center mb-1'>
							<Clock className='mr-2 h-5 w-5 text-primary' />
							<h3 className='text-md font-medium text-foreground-700'>Alert Frequency</h3>
						</div>
						<p className='text-sm text-foreground-500 mb-2'>How often would you like to receive job alerts?</p>
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
					</CardBody>
				</Card>
			</div>

			{/* Navigation */}
			<div className='flex justify-between'>
				<Button variant='flat' onPress={() => send({ type: 'BACK' })}>
					Back
				</Button>
				<Button
					color='primary'
					onPress={() => {
						send({ type: 'SUBMIT' });
						handleSubmit();
					}}
					isLoading={isSubmitting}
				>
					Create Alert
				</Button>
			</div>
		</div>
	);
}

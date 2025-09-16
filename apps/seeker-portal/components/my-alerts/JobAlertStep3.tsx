'use client';

import { Button, NumberInput } from '@heroui/react';
import { Clock, IndianRupee } from 'lucide-react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CreateAlertFormValues } from './JobAlertFormMachine';
import JobAlertFormContext from './JobAlertFormMachine';

type Step3Props = {
	control: Control<CreateAlertFormValues>;
	errors: FieldErrors<CreateAlertFormValues>;
};

export default function JobAlertStep3({ control, errors }: Step3Props) {
	const { send } = JobAlertFormContext.useActorRef();

	return (
		<div className='space-y-8'>
			<div className='space-y-4'>
				<h3 className='text-lg font-semibold text-foreground-800'>Experience & Salary Range</h3>
				<p className='text-sm text-foreground-500'>Set your preferred experience and salary requirements</p>

				{/* Experience Range */}
				<div className='mb-6'>
					<div className='text-sm font-medium text-foreground-700 mb-2'>Experience (in years)</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<Controller
							name='minExperience'
							control={control}
							render={({ field }) => (
								<NumberInput
									label='Minimum'
									placeholder='Min years'
									min={0}
									size='sm'
									startContent={<Clock size={16} />}
									value={field.value as number | undefined}
									onValueChange={value => {
										field.onChange(value);
										send({ type: 'UPDATE_FIELD', field: 'minExperience', value });
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
									label='Maximum'
									placeholder='Max years'
									min={0}
									size='sm'
									startContent={<Clock size={16} />}
									value={field.value as number | undefined}
									onValueChange={value => {
										field.onChange(value);
										send({ type: 'UPDATE_FIELD', field: 'maxExperience', value });
									}}
									errorMessage={errors.maxExperience?.message}
									isInvalid={!!errors.maxExperience}
								/>
							)}
						/>
					</div>
				</div>

				{/* Salary Range */}
				<div className='mb-6'>
					<div className='text-sm font-medium text-foreground-700 mb-2'>Salary Range (INR)</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<Controller
							name='minSalary'
							control={control}
							render={({ field }) => (
								<NumberInput
									label='Minimum'
									placeholder='Min salary'
									min={0}
									size='sm'
									startContent={<IndianRupee size={16} />}
									value={field.value as number | undefined}
									onValueChange={value => {
										field.onChange(value);
										send({ type: 'UPDATE_FIELD', field: 'minSalary', value });
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
									label='Maximum'
									placeholder='Max salary'
									min={0}
									size='sm'
									startContent={<IndianRupee size={16} />}
									value={field.value as number | undefined}
									onValueChange={value => {
										field.onChange(value);
										send({ type: 'UPDATE_FIELD', field: 'maxSalary', value });
									}}
									errorMessage={errors.maxSalary?.message}
									isInvalid={!!errors.maxSalary}
								/>
							)}
						/>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className='flex justify-between'>
				<Button variant='flat' onPress={() => send({ type: 'BACK' })}>
					Back
				</Button>
				<Button color='primary' onPress={() => send({ type: 'NEXT' })}>
					Next
				</Button>
			</div>
		</div>
	);
}

'use client';

import { Button, DatePicker } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { parseDate } from '@internationalized/date';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import type { DateOfBirthStepMutation as DateOfBirthStepMutationType } from '@/__generated__/DateOfBirthStepMutation.graphql';
import CompleteProfileContext from '../CompleteProfileContext';

const DateOfBirthStepMutation = graphql`
mutation DateOfBirthStepMutation($dateOfBirth: Date) {
	updateProfilePersonalDetails(dateOfBirth: $dateOfBirth) {
		__typename
		...on Account {
			profile {
				dateOfBirth
			}
		}
	}
}
`;

const dateOfBirthSchema = z.object({
	dateOfBirth: z.string().min(1, 'Date of birth is required')
});

export default function DateOfBirthStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const dateOfBirth = CompleteProfileContext.useSelector(state => state.context.dateOfBirth);

	const { control, handleSubmit, formState } = useForm<z.infer<typeof dateOfBirthSchema>>({
		resolver: standardSchemaResolver(dateOfBirthSchema),
		defaultValues: { dateOfBirth: dateOfBirth || '' }
	});

	const [commitMutation, isMutationInFlight] = useMutation<DateOfBirthStepMutationType>(DateOfBirthStepMutation);

	const onSubmit = (data: z.infer<typeof dateOfBirthSchema>) => {
		commitMutation({
			variables: {
				dateOfBirth: data.dateOfBirth
			},
			onCompleted() {
				send({
					type: 'SUBMIT_DATE_OF_BIRTH',
					dateOfBirth: data.dateOfBirth
				});
			}
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Date of Birth</h3>
				<p className='text-sm text-foreground-600'>Please provide your date of birth for profile completion.</p>
			</div>

			<Controller
				name='dateOfBirth'
				control={control}
				render={({ field, fieldState }) => (
					<DatePicker
						label='Date of Birth'
						value={field.value ? parseDate(field.value) : null}
						onChange={date => field.onChange(date?.toString())}
						errorMessage={fieldState.error?.message}
						isInvalid={!!fieldState.error}
						showMonthAndYearPickers
						maxValue={parseDate(new Date().toISOString().split('T')[0])}
					/>
				)}
			/>

			<Button type='submit' color='primary' fullWidth isLoading={formState.isSubmitting || isMutationInFlight}>
				Continue
			</Button>
		</form>
	);
}

'use client';

import { Button, DatePicker } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { parseDate } from '@internationalized/date';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import type { DateOfBirthStepFragment$key } from '@/__generated__/DateOfBirthStepFragment.graphql';
import type { DateOfBirthStepMutation as DateOfBirthStepMutationType } from '@/__generated__/DateOfBirthStepMutation.graphql';
import CompleteProfileContext from '../CompleteProfileContext';

const DateOfBirthStepFragment = graphql`
fragment DateOfBirthStepFragment on Account {
	profile @required(action: THROW) {
		dateOfBirth
	}
}
`;

const DateOfBirthStepMutation = graphql`
mutation DateOfBirthStepMutation($dateOfBirth: Date) {
	updateProfilePersonalDetails(dateOfBirth: $dateOfBirth) {
		__typename
		...on Account {
			...CompleteProfileDrawerFragment
		}
	}
}
`;

const dateOfBirthSchema = z.object({
	dateOfBirth: z.string().min(1, 'Date of birth is required')
});

interface DateOfBirthStepProps {
	account: DateOfBirthStepFragment$key;
}

export default function DateOfBirthStep({ account }: DateOfBirthStepProps) {
	const data = useFragment(DateOfBirthStepFragment, account);
	const { send } = CompleteProfileContext.useActorRef();

	const { control, handleSubmit, formState } = useForm<z.infer<typeof dateOfBirthSchema>>({
		resolver: standardSchemaResolver(dateOfBirthSchema),
		defaultValues: { dateOfBirth: data.profile.dateOfBirth || '' }
	});

	const [commitMutation, isMutationInFlight] = useMutation<DateOfBirthStepMutationType>(DateOfBirthStepMutation);

	const onSubmit = (formData: z.infer<typeof dateOfBirthSchema>) => {
		commitMutation({
			variables: {
				dateOfBirth: formData.dateOfBirth
			},
			onCompleted() {
				send({ type: 'STEP_COMPLETED' });
			}
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-medium'>Date of Birth</h3>
				<p className='text-sm text-foreground-600'>We couldn't find this in your resume.</p>
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

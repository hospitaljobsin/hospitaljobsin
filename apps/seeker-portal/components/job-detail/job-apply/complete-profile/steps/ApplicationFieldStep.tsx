'use client';

import { Button, Textarea } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import CompleteProfileContext from '../CompleteProfileContext';

const applicationFieldSchema = z.object({
	fieldValue: z.string().min(1, 'This field is required')
});

export default function ApplicationFieldStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const currentFieldIndex = CompleteProfileContext.useSelector(state => state.context.currentFieldIndex);
	const missingFieldsLength = CompleteProfileContext.useSelector(state => state.context.missingFields.length);
	const applicationFields = CompleteProfileContext.useSelector(state => state.context.applicationFields);

	const applicationFieldIndex = currentFieldIndex - missingFieldsLength;
	const currentField = applicationFields[applicationFieldIndex];

	const { handleSubmit, formState, control, reset } = useForm<z.infer<typeof applicationFieldSchema>>({
		resolver: standardSchemaResolver(applicationFieldSchema),
		defaultValues: { fieldValue: currentField?.fieldValue || currentField?.defaultValue || '' }
	});

	useEffect(() => {
		reset({ fieldValue: currentField?.fieldValue || currentField?.defaultValue || '' });
	}, [applicationFieldIndex, reset, currentField?.fieldValue, currentField?.defaultValue]);

	const onSubmit = (formData: z.infer<typeof applicationFieldSchema>) => {
		send({
			type: 'SUBMIT_APPLICATION_FIELD',
			fieldIndex: applicationFieldIndex,
			fieldValue: formData.fieldValue
		});
	};

	const handlePrevious = () => {
		send({ type: 'PREVIOUS_STEP' });
	};

	if (!currentField) return null;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>{currentField.fieldName}</h3>
				<p className='text-sm text-foreground-600'>Please provide your response to this screening question.</p>
			</div>

			<Controller
				name='fieldValue'
				control={control}
				defaultValue={currentField?.fieldValue || currentField?.defaultValue || ''}
				render={({ field }) => (
					<Textarea
						{...field}
						key={applicationFieldIndex}
						isRequired={currentField.isRequired}
						errorMessage={formState.errors.fieldValue?.message}
						isInvalid={!!formState.errors.fieldValue}
						autoFocus
					/>
				)}
			/>

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

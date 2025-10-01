'use client';

import { Button, Textarea } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { graphql, useFragment } from 'react-relay';
import { z } from 'zod/v4';
import type { ApplicationFieldStepFragment$key } from '@/__generated__/ApplicationFieldStepFragment.graphql';
import CompleteProfileContext from '../CompleteProfileContext';

const ApplicationFieldStepFragment = graphql`
fragment ApplicationFieldStepFragment on Job {
	applicationForm {
		fields {
			fieldName
			defaultValue
			isRequired
		}
	}
}
`;

const applicationFieldSchema = z.object({
	fieldValue: z.string().min(1, 'This field is required')
});

interface ApplicationFieldStepProps {
	job: ApplicationFieldStepFragment$key;
}

export default function ApplicationFieldStep({ job }: ApplicationFieldStepProps) {
	const data = useFragment(ApplicationFieldStepFragment, job);
	const { send } = CompleteProfileContext.useActorRef();
	const currentFieldIndex = CompleteProfileContext.useSelector(state => state.context.currentFieldIndex);
	const missingFieldsLength = CompleteProfileContext.useSelector(state => state.context.missingFields.length);
	const applicationFields = CompleteProfileContext.useSelector(state => state.context.applicationFields);
	const isLastStep = CompleteProfileContext.useSelector(state => state.context.currentFieldIndex + 1 >= state.context.totalSteps);

	const applicationFieldIndex = currentFieldIndex - missingFieldsLength;
	const currentField = applicationFields[applicationFieldIndex];

	const { register, handleSubmit, formState } = useForm<z.infer<typeof applicationFieldSchema>>({
		resolver: standardSchemaResolver(applicationFieldSchema),
		defaultValues: { fieldValue: currentField?.fieldValue || currentField?.defaultValue || '' }
	});

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

			<Textarea
				{...register('fieldValue')}
				isRequired={currentField.isRequired}
				errorMessage={formState.errors.fieldValue?.message}
				isInvalid={!!formState.errors.fieldValue}
				autoFocus
			/>

			<div className='flex gap-3'>
				<Button type='button' variant='flat' fullWidth onPress={handlePrevious}>
					Previous
				</Button>
				<Button type='submit' color='primary' fullWidth isLoading={formState.isSubmitting}>
					{isLastStep ? 'Apply' : 'Continue'}
				</Button>
			</div>
		</form>
	);
}

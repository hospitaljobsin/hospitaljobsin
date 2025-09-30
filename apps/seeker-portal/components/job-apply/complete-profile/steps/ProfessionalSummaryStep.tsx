'use client';

import { Button, Textarea } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import CompleteProfileContext from '../CompleteProfileContext';

const professionalSummarySchema = z.object({
	professionalSummary: z
		.string()
		.min(50, 'Professional summary should be at least 50 characters')
		.max(500, 'Professional summary should not exceed 500 characters')
});

export default function ProfessionalSummaryStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const professionalSummary = CompleteProfileContext.useSelector(state => state.context.professionalSummary);

	const { register, handleSubmit, formState, watch } = useForm<z.infer<typeof professionalSummarySchema>>({
		resolver: standardSchemaResolver(professionalSummarySchema),
		defaultValues: { professionalSummary: professionalSummary || '' }
	});

	const watchedSummary = watch('professionalSummary');

	const onSubmit = async (data: z.infer<typeof professionalSummarySchema>) => {
		// Mock mutation call
		console.log('Saving professional summary:', data.professionalSummary);

		send({
			type: 'SUBMIT_PROFESSIONAL_SUMMARY',
			professionalSummary: data.professionalSummary
		});
	};

	const handlePrevious = () => {
		send({ type: 'PREVIOUS_STEP' });
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Professional Summary</h3>
				<p className='text-sm text-foreground-600'>
					Write a brief summary of your professional experience and skills. This will help employers understand your background.
				</p>
			</div>

			<div className='space-y-2'>
				<Textarea
					{...register('professionalSummary')}
					label='Professional Summary'
					placeholder='e.g., Experienced registered nurse with 5+ years in critical care. Skilled in patient assessment, medication administration, and emergency response. Passionate about providing compassionate care and improving patient outcomes.'
					minRows={4}
					maxRows={8}
					errorMessage={formState.errors.professionalSummary?.message}
					isInvalid={!!formState.errors.professionalSummary}
				/>
				<div className='flex justify-between text-xs text-foreground-500'>
					<span>Minimum 50 characters</span>
					<span>{watchedSummary?.length || 0}/500</span>
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

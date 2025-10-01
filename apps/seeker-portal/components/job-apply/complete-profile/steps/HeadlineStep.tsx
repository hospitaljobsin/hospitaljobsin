'use client';

import { Button, Input } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import type { HeadlineStepFragment$key } from '@/__generated__/HeadlineStepFragment.graphql';
import type { HeadlineStepMutation as HeadlineStepMutationType } from '@/__generated__/HeadlineStepMutation.graphql';
import CompleteProfileContext from '../CompleteProfileContext';

const HeadlineStepFragment = graphql`
fragment HeadlineStepFragment on Account {
	profile @required(action: THROW) {
		headline
	}
}
`;

const HeadlineStepMutation = graphql`
mutation HeadlineStepMutation($headline: String!) {
	updateProfileAboutMe(headline: $headline, professionalSummary: "") {
		... on Account {
			...CompleteProfileDrawerFragment
		}
	}
}
`;

const headlineSchema = z.object({
	headline: z.string().min(10, 'Headline should be at least 10 characters').max(100, 'Headline should not exceed 100 characters')
});

interface HeadlineStepProps {
	account: HeadlineStepFragment$key;
}

export default function HeadlineStep({ account }: HeadlineStepProps) {
	const data = useFragment(HeadlineStepFragment, account);
	const { send } = CompleteProfileContext.useActorRef();
	const isLastStep = CompleteProfileContext.useSelector(state => state.context.currentFieldIndex + 1 >= state.context.totalSteps);

	const { register, handleSubmit, formState, watch } = useForm<z.infer<typeof headlineSchema>>({
		resolver: standardSchemaResolver(headlineSchema),
		defaultValues: { headline: data.profile.headline || '' }
	});

	const watchedHeadline = watch('headline');

	const [commitMutation] = useMutation<HeadlineStepMutationType>(HeadlineStepMutation);

	const onSubmit = (formData: z.infer<typeof headlineSchema>) => {
		commitMutation({
			variables: {
				headline: formData.headline
			},
			onCompleted() {
				send({ type: 'STEP_COMPLETED' });
			}
		});
	};

	const handlePrevious = () => {
		send({ type: 'PREVIOUS_STEP' });
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Professional Headline</h3>
				<p className='text-sm text-foreground-600'>
					Create a compelling headline that summarizes your professional identity. This will be the first thing employers see.
				</p>
			</div>

			<div className='space-y-2'>
				<Input
					{...register('headline')}
					label='Professional Headline'
					placeholder='e.g., Experienced ICU Nurse | Critical Care Specialist | Patient Advocate'
					errorMessage={formState.errors.headline?.message}
					isInvalid={!!formState.errors.headline}
				/>
				<div className='flex justify-between text-xs text-foreground-500'>
					<span>Minimum 10 characters</span>
					<span>{watchedHeadline?.length || 0}/100</span>
				</div>
			</div>

			<div className='bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg'>
				<h4 className='font-medium text-primary-700 dark:text-primary-300 mb-2'>Tips for a great headline:</h4>
				<ul className='text-sm text-primary-600 dark:text-primary-400 space-y-1'>
					<li>• Include your job title or specialty</li>
					<li>• Mention key skills or certifications</li>
					<li>• Keep it professional and concise</li>
					<li>• Use keywords relevant to your field</li>
				</ul>
			</div>

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

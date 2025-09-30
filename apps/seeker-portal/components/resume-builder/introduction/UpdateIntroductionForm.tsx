import type { UpdateIntroductionFormFragment$key } from '@/__generated__/UpdateIntroductionFormFragment.graphql';
import type { UpdateIntroductionFormMutation as UpdateIntroductionFormMutationType } from '@/__generated__/UpdateIntroductionFormMutation.graphql';
import MarkdownEditor from '@/components/forms/text-editor/MarkdownEditor';
import { cn, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const ProfessionalSummaryFragment = graphql`
  fragment UpdateIntroductionFormFragment on Profile {
    professionalSummary
	headline
  }
`;

const UpdateIntroductionFormMutation = graphql`
  mutation UpdateIntroductionFormMutation($professionalSummary: String!, $headline: String!) {
    updateProfileAboutMe(professionalSummary: $professionalSummary, headline: $headline) {
      ... on Account {
        ...IncompleteProfileBannerFragment
        profile {
          ...UpdateIntroductionFormFragment
        }
      }
    }
  }
`;

const formSchema = z.object({
	professionalSummary: z.string(),
	headline: z.string()
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateIntroductionForm({
	rootQuery,
	onSaveChanges
}: {
	rootQuery: UpdateIntroductionFormFragment$key;
	onSaveChanges: () => void;
}) {
	const data = useFragment(ProfessionalSummaryFragment, rootQuery);
	const [commitMutation, isInFlight] = useMutation<UpdateIntroductionFormMutationType>(UpdateIntroductionFormMutation);

	const {
		handleSubmit,
		control,
		register,
		reset,
		formState: { errors, isDirty, isValid }
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			professionalSummary: data.professionalSummary ?? '',
			headline: data.headline ?? ''
		}
	});

	const onSubmit = (formData: FormValues) => {
		commitMutation({
			variables: {
				professionalSummary: formData.professionalSummary,
				headline: formData.headline
			},
			onCompleted: () => {
				reset(formData);
				onSaveChanges();
			}
		});
	};

	return (
		<UnsavedChangesFormWrapper
			isDirty={isDirty}
			isValid={isValid}
			onSave={handleSubmit(onSubmit)}
			onCancel={() => reset()}
			isLoading={isInFlight}
		>
			<form className='space-y-8 sm:space-y-12'>
				<div className='flex flex-col gap-8 sm:gap-12'>
					<h1 className='w-full text-xl text-foreground-500 font-medium'>Introduction</h1>
					<Input
						{...register('headline')}
						label='Headline'
						placeholder='Enter your headline'
						type='text'
						variant='bordered'
						errorMessage={errors.headline?.message}
						isInvalid={!!errors.headline}
						className='w-full'
						classNames={{
							inputWrapper: 'bg-background'
						}}
					/>
					<Controller
						control={control}
						name='professionalSummary'
						render={({ field }) => (
							<div className='flex flex-col gap-2 sm:gap-4 w-full'>
								<h2
									className={cn('text-sm inline-flex gap-0.5 text-foreground-600', {
										'text-danger': errors.professionalSummary
									})}
								>
									Professional Summary
								</h2>
								<MarkdownEditor
									initialValue={field.value}
									onValueChange={value => {
										field.onChange(value);
									}}
									isInvalid={errors.professionalSummary != null}
									description={
										errors.professionalSummary ? (
											<p className='text-tiny text-danger'>{errors.professionalSummary.message}</p>
										) : (
											<p className='text-tiny text-foreground-400'>Rich text editing is supported.</p>
										)
									}
									className='bg-background'
								/>
							</div>
						)}
					/>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}

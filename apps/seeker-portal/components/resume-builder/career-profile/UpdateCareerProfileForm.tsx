import type { UpdateCareerProfileFormFragment$key } from '@/__generated__/UpdateCareerProfileFormFragment.graphql';
import { Checkbox, CheckboxGroup, Input } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import { SteppableNumberInput } from '../../forms/SteppableNumberInput';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const UpdateCareerProfileFormMutation = graphql`
mutation UpdateCareerProfileFormMutation($careerProfile: CareerProfileInput!) {
  updateProfileCareerProfile(careerProfile: $careerProfile) {
    ...on Account {
        ...IncompleteProfileBannerFragment
        ...ResumeProgressAccountFragment
      profile {
          ...UpdateCareerProfileFormFragment
      }
    }
  }
}
`;

const UpdateCareerProfileFormFragment = graphql`
  fragment UpdateCareerProfileFormFragment on Profile {
    __typename
    careerProfile {
		currentIndustry
		desiredJobTypes
		desiredWorkModes
		expectedSalary
	}
  }
`;

type Props = {
	rootQuery: UpdateCareerProfileFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	currentIndustry: z.nullable(z.string()),
	desiredJobTypes: z.array(z.string()),
	desiredWorkModes: z.array(z.string()),
	expectedSalary: z.nullable(z.number().min(0))
});

export default function UpdateCareerProfileForm({ rootQuery, onSaveChanges }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(UpdateCareerProfileFormMutation);
	const data = useFragment(UpdateCareerProfileFormFragment, rootQuery);

	const defaultValues: z.infer<typeof formSchema> = {
		currentIndustry: data.careerProfile?.currentIndustry ?? null,
		desiredJobTypes: data.careerProfile?.desiredJobTypes ?? [],
		desiredWorkModes: data.careerProfile?.desiredWorkModes ?? [],
		expectedSalary: data.careerProfile?.expectedSalary ?? null
	};

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting, isDirty, isValid }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				careerProfile: {
					currentIndustry: formData.currentIndustry,
					desiredJobTypes: formData.desiredJobTypes,
					desiredWorkModes: formData.desiredWorkModes,
					expectedSalary: formData.expectedSalary
				}
			},
			onCompleted() {
				reset(formData);
				onSaveChanges();
			}
		});
	}

	return (
		<UnsavedChangesFormWrapper isDirty={isDirty} isValid={isValid} onSave={handleSubmit(onSubmit)} onCancel={() => reset()}>
			<form className='space-y-12'>
				<div className='pb-6 space-y-6'>
					<h1 className='w-full text-xl text-foreground-500 font-medium'>Career Profile</h1>
					<div className='mb-12'>
						<Controller
							name='currentIndustry'
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									label='Current Industry'
									placeholder='Enter your current industry'
									value={field.value ?? ''}
									errorMessage={errors.currentIndustry?.message}
									isInvalid={!!errors.currentIndustry}
									classNames={{
										inputWrapper: 'bg-background'
									}}
								/>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='expectedSalary'
							control={control}
							render={({ field }) => (
								<SteppableNumberInput
									{...field}
									label='Expected Salary'
									placeholder='Enter expected salary'
									formatOptions={{
										style: 'currency',
										currency: 'INR',
										currencyDisplay: 'code',
										currencySign: 'accounting'
									}}
									value={field.value as number | undefined}
									onValueChange={field.onChange}
									step={1000}
									isClearable
									onClear={() => field.onChange(null)}
									errorMessage={errors.expectedSalary?.message}
									isInvalid={!!errors.expectedSalary}
									classNames={{
										inputWrapper: 'bg-background'
									}}
								/>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='desiredWorkModes'
							control={control}
							render={({ field }) => (
								<CheckboxGroup
									label='Desired Work Modes'
									value={field.value}
									onValueChange={field.onChange}
									className='w-full'
									orientation='horizontal'
									errorMessage={errors.desiredWorkModes?.message}
									isInvalid={!!errors.desiredWorkModes}
								>
									<Checkbox value='REMOTE'>Remote</Checkbox>
									<Checkbox value='HYBRID'>Hybrid</Checkbox>
									<Checkbox value='OFFICE'>Office</Checkbox>
								</CheckboxGroup>
							)}
						/>
					</div>
					<div className='mb-12'>
						<Controller
							name='desiredJobTypes'
							control={control}
							render={({ field }) => (
								<CheckboxGroup
									label='Desired Job Types'
									value={field.value}
									onValueChange={field.onChange}
									className='w-full'
									orientation='horizontal'
									errorMessage={errors.desiredJobTypes?.message}
									isInvalid={!!errors.desiredJobTypes}
								>
									<Checkbox value='FULL_TIME'>Full Time</Checkbox>
									<Checkbox value='PART_TIME'>Part Time</Checkbox>
									<Checkbox value='INTERNSHIP'>Internship</Checkbox>
									<Checkbox value='CONTRACT'>Contract</Checkbox>
									<Checkbox value='LOCUM'>Locum</Checkbox>
								</CheckboxGroup>
							)}
						/>
					</div>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}

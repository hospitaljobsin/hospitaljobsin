import type { UpdateLicensesFormFragment$key } from '@/__generated__/UpdateLicensesFormFragment.graphql';
import { YearPicker } from '@/components/forms/YearPicker';
import { Button, Input } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { IdCardIcon, Plus, Trash } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4-mini';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const UpdateLicensesFormMutation = graphql`
mutation UpdateLicensesFormMutation($licenses: [LicenseInput!]!) {
  updateProfileLicenses(licenses: $licenses) {
    ...on Account {
		...ResumeProgressAccountFragment
      profile {
          ...UpdateLicensesFormFragment
      }
    }
  }
}
`;

const UpdateLicensesFormFragment = graphql`
  fragment UpdateLicensesFormFragment on Profile {
    __typename
    licenses {
      name
      issuer
      licenseNumber
	  registrationYear
    }
  }
`;

type Props = {
	rootQuery: UpdateLicensesFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	licenses: z.array(
		z.object({
			name: z.string().check(z.minLength(1, 'This field is required'), z.maxLength(100)),
			issuer: z.string().check(z.minLength(1, 'This field is required'), z.maxLength(100)),
			licenseNumber: z.string().check(z.minLength(1, 'This field is required'), z.maxLength(100)),
			registrationYear: z
				.number()
				.check(
					z.minimum(1900, 'Invalid Registration Year'),
					z.maximum(new Date().getFullYear(), 'Registration Year cannot be in the future')
				)
		})
	)
});

export default function UpdateLicensesForm({ rootQuery, onSaveChanges }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(UpdateLicensesFormMutation);
	const data = useFragment(UpdateLicensesFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting, isDirty, isValid }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues:
			data.licenses.length > 0
				? {
						licenses: data.licenses.map(lic => ({
							name: lic.name,
							issuer: lic.issuer,
							licenseNumber: lic.licenseNumber,
							registrationYear: lic.registrationYear
						}))
					}
				: {
						licenses: []
					}
	});

	const { fields, append, prepend, remove } = useFieldArray({
		control: control,
		name: 'licenses'
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				licenses: formData.licenses.map(lic => ({
					name: lic.name,
					issuer: lic.issuer,
					licenseNumber: lic.licenseNumber,
					registrationYear: lic.registrationYear
				}))
			},
			onCompleted() {
				reset(formData);
				onSaveChanges();
			}
		});
	}

	return (
		<UnsavedChangesFormWrapper
			isDirty={isDirty}
			isValid={isValid}
			onSave={handleSubmit(onSubmit)}
			onCancel={() => reset()}
			isLoading={isSubmitting || isMutationInFlight}
		>
			<form className='space-y-12'>
				<div className='pb-4 sm:pb-6 space-y-4 sm:space-y-6 w-full'>
					<div className='flex flex-col sm:flex-row sm:items-center gap-4 justify-between w-full'>
						<h1 className='text-xl text-foreground-500 font-medium'>Licenses</h1>
						{fields.length > 0 && (
							<Button
								type='button'
								variant='bordered'
								className='w-full sm:w-auto'
								startContent={<Plus size={18} />}
								onPress={() =>
									prepend(
										{
											name: '',
											issuer: '',
											licenseNumber: '',
											registrationYear: new Date().getFullYear()
										},
										{ shouldFocus: true }
									)
								}
							>
								Add License
							</Button>
						)}
					</div>
					<div className='w-full flex flex-col'>
						<div className='w-full space-y-12 items-center'>
							{fields.length === 0 ? (
								<div className='flex flex-col items-center gap-6 rounded-lg border-foreground-300 border-2 border-dashed p-12 text-center'>
									<div className='w-16 h-16 rounded-full bg-foreground-200 flex items-center justify-center'>
										<IdCardIcon className='text-foreground-600' />
									</div>
									<div className='space-y-2'>
										<h3 className='text-lg font-semibold text-foreground-700'>Display Your Licenses</h3>
										<p className='text-foreground-500 max-w-sm'>
											Add your professional licenses to demonstrate your qualifications and regulatory compliance.
										</p>
									</div>
									<Button
										type='button'
										color='default'
										size='lg'
										startContent={<Plus size={20} />}
										onPress={() =>
											prepend(
												{
													name: '',
													issuer: '',
													licenseNumber: '',
													registrationYear: new Date().getFullYear()
												},
												{ shouldFocus: true }
											)
										}
									>
										Add Your First License
									</Button>
								</div>
							) : (
								fields.map((item, index) => (
									<div key={`field-${item.name}-${index}`} className='flex gap-8 items-end w-full flex-col'>
										<div className='w-full space-y-4'>
											<Controller
												name={`licenses.${index}.name`}
												control={control}
												defaultValue=''
												render={({ field }) => (
													<Input
														{...field}
														variant='bordered'
														fullWidth
														label='Name'
														placeholder='License name'
														errorMessage={errors.licenses?.[index]?.name?.message}
														isInvalid={!!errors.licenses?.[index]?.name}
														classNames={{
															inputWrapper: 'bg-background'
														}}
													/>
												)}
											/>
										</div>
										<div className='w-full space-y-4'>
											<Controller
												name={`licenses.${index}.issuer`}
												control={control}
												defaultValue=''
												render={({ field }) => (
													<Input
														{...field}
														variant='bordered'
														fullWidth
														label='Issuer'
														placeholder='License issuer'
														errorMessage={errors.licenses?.[index]?.issuer?.message}
														isInvalid={!!errors.licenses?.[index]?.issuer}
														classNames={{
															inputWrapper: 'bg-background'
														}}
													/>
												)}
											/>
										</div>
										<div className='w-full space-y-4'>
											<Controller
												name={`licenses.${index}.licenseNumber`}
												control={control}
												defaultValue=''
												render={({ field }) => (
													<Input
														{...field}
														variant='bordered'
														fullWidth
														label='License Number'
														placeholder='License number'
														errorMessage={errors.licenses?.[index]?.licenseNumber?.message}
														isInvalid={!!errors.licenses?.[index]?.licenseNumber}
														classNames={{
															inputWrapper: 'bg-background'
														}}
													/>
												)}
											/>
										</div>
										<div className='w-full space-y-4'>
											<Controller
												name={`licenses.${index}.registrationYear`}
												control={control}
												defaultValue={undefined}
												render={({ field }) => (
													<YearPicker
														{...field}
														variant='bordered'
														label='Registration Year'
														errorMessage={errors.licenses?.[index]?.registrationYear?.message}
														isInvalid={!!errors.licenses?.[index]?.registrationYear}
														selectProps={{
															classNames: {
																trigger: 'bg-background'
															}
														}}
													/>
												)}
											/>
										</div>

										<Button type='button' variant='bordered' startContent={<Trash size={18} />} onPress={() => remove(index)}>
											Delete License
										</Button>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}

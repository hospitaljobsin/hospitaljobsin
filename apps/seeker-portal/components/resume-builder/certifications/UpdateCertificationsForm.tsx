import type { UpdateCertificationsFormFragment$key } from '@/__generated__/UpdateCertificationsFormFragment.graphql';
import { Button, Input } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Plus, Trash } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import { MonthYearPicker, parseMonthYear, toDateString } from '../../forms/MonthYearPicker';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const UpdateCertificationsFormMutation = graphql`
mutation UpdateCertificationsFormMutation($certifications: [CertificationInput!]!) {
  updateProfileCertifications(certifications: $certifications) {
    ...on Account {
		...IncompleteProfileBannerFragment
		...ResumeProgressAccountFragment
      profile {
          ...UpdateCertificationsFormFragment
      }
    }
  }
}
`;

const UpdateCertificationsFormFragment = graphql`
  fragment UpdateCertificationsFormFragment on Profile {
    __typename
    certifications {
      name
      issuer
      certificationUrl
      createdAt
      expiresAt
    }
  }
`;

type Props = {
	rootQuery: UpdateCertificationsFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	certifications: z.array(
		z
			.object({
				name: z.string().check(z.minLength(1, 'This field is required'), z.maxLength(100)),
				issuer: z.string().check(z.minLength(1, 'This field is required'), z.maxLength(100)),
				certificationUrl: z.url('Must be a valid URL'),
				createdAt: z.custom<{ month: number; year: number }>(data => {
					if (data && typeof data === 'object' && data !== null && typeof data.month === 'number' && typeof data.year === 'number') {
						const now = new Date();
						if (data.year > now.getFullYear() || (data.year === now.getFullYear() && data.month > now.getMonth() + 1)) {
							return false;
						}
						return true;
					}
					return false;
				}, 'Start date cannot be in the future'),
				expiresAt: z.nullable(
					z.custom<{ month: number; year: number }>(data => {
						if (data === null) return true;
						return data && typeof data === 'object' && data !== null && typeof data.month === 'number' && typeof data.year === 'number';
					}, 'Expires At must be a valid month/year or null')
				)
			})
			.refine(
				data => {
					if (data.createdAt && data.expiresAt) {
						if (data.createdAt.year > data.expiresAt.year) {
							return false;
						}
					}
					return true;
				},
				{
					message: 'Start date cannot be after expiry date',
					path: ['expiresAt']
				}
			)
	)
});

export default function UpdateCertificationsForm({ rootQuery, onSaveChanges }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(UpdateCertificationsFormMutation);
	const data = useFragment(UpdateCertificationsFormFragment, rootQuery);
	const {
		handleSubmit,
		control,

		reset,
		formState: { errors, isSubmitting, isDirty, isValid }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues:
			data.certifications.length > 0
				? {
						certifications: data.certifications.map(cert => {
							const created = parseMonthYear(cert.createdAt) || {
								month: 1,
								year: 2000
							};
							const expires = cert.expiresAt ? parseMonthYear(cert.expiresAt) : null;
							return {
								name: cert.name,
								issuer: cert.issuer,
								certificationUrl: cert.certificationUrl,
								createdAt: created,
								expiresAt: expires
							};
						})
					}
				: {
						certifications: []
					}
	});

	const { fields, prepend, remove } = useFieldArray({
		control: control,
		name: 'certifications'
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				certifications: formData.certifications.map(cert => ({
					...cert,
					createdAt: toDateString(cert.createdAt),
					expiresAt: cert.expiresAt ? toDateString(cert.expiresAt) : null
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
				<div className='pb-6 space-y-6'>
					<h1 className='w-full text-xl text-foreground-500 font-medium'>Certifications</h1>
					<div className='w-full flex flex-col'>
						<div className='w-full space-y-12 items-center'>
							{fields.length === 0 ? (
								<div className='flex flex-col items-start gap-4'>
									<p className='text-foreground-500'>No certification entries. Add your certifications.</p>
									<Button
										type='button'
										variant='bordered'
										fullWidth
										startContent={<Plus size={18} />}
										onPress={() =>
											prepend({
												name: '',
												issuer: '',
												certificationUrl: '',
												createdAt: { month: 1, year: 2000 },
												expiresAt: null
											})
										}
									>
										Add Certification
									</Button>
								</div>
							) : (
								<>
									<Button
										type='button'
										variant='bordered'
										className='w-full sm:w-auto'
										startContent={<Plus size={18} />}
										onPress={() =>
											prepend({
												name: '',
												issuer: '',
												certificationUrl: '',
												createdAt: { month: 1, year: 2000 },
												expiresAt: null
											})
										}
									>
										Add Certification
									</Button>
									{fields.map((item, index) => (
										<div key={`field-${item.name}-${index}`} className='flex gap-8 items-end w-full flex-col'>
											<div className='w-full space-y-4'>
												<Controller
													name={`certifications.${index}.name`}
													control={control}
													defaultValue=''
													render={({ field }) => (
														<Input
															{...field}
															fullWidth
															label='Name'
															placeholder='Certification name'
															errorMessage={errors.certifications?.[index]?.name?.message}
															isInvalid={!!errors.certifications?.[index]?.name}
															classNames={{
																inputWrapper: 'bg-background'
															}}
														/>
													)}
												/>
											</div>
											<div className='w-full space-y-4'>
												<Controller
													name={`certifications.${index}.issuer`}
													control={control}
													defaultValue=''
													render={({ field }) => (
														<Input
															{...field}
															fullWidth
															label='Issuer'
															placeholder='Certification issuer'
															errorMessage={errors.certifications?.[index]?.issuer?.message}
															isInvalid={!!errors.certifications?.[index]?.issuer}
															classNames={{
																inputWrapper: 'bg-background'
															}}
														/>
													)}
												/>
											</div>
											<div className='w-full space-y-4'>
												<Controller
													name={`certifications.${index}.certificationUrl`}
													control={control}
													defaultValue=''
													render={({ field }) => (
														<Input
															{...field}
															fullWidth
															label='Certification URL'
															placeholder='https://...'
															errorMessage={errors.certifications?.[index]?.certificationUrl?.message}
															isInvalid={!!errors.certifications?.[index]?.certificationUrl}
															classNames={{
																inputWrapper: 'bg-background'
															}}
														/>
													)}
												/>
											</div>
											<div className='w-full space-y-4 flex flex-col sm:flex-row gap-6'>
												<Controller
													control={control}
													name={`certifications.${index}.createdAt`}
													render={({ field }) => (
														<MonthYearPicker
															label='Issued At'
															value={field.value}
															onChange={field.onChange}
															errorMessage={errors.certifications?.[index]?.createdAt?.message}
															isInvalid={!!errors.certifications?.[index]?.createdAt}
															selectProps={{
																classNames: {
																	trigger: 'bg-background'
																}
															}}
														/>
													)}
												/>
												<Controller
													control={control}
													name={`certifications.${index}.expiresAt`}
													render={({ field }) => (
														<MonthYearPicker
															label='Expires At'
															value={field.value}
															onChange={field.onChange}
															errorMessage={errors.certifications?.[index]?.expiresAt?.message}
															isInvalid={!!errors.certifications?.[index]?.expiresAt}
															selectProps={{
																classNames: {
																	trigger: 'bg-background'
																}
															}}
														/>
													)}
												/>
											</div>
											<Button type='button' variant='bordered' onPress={() => remove(index)} startContent={<Trash size={18} />}>
												Delete Certification
											</Button>
										</div>
									))}
								</>
							)}
						</div>
					</div>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}

'use client';

import { Button } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import type { AddressStepFragment$key } from '@/__generated__/AddressStepFragment.graphql';
import type { AddressStepMutation as AddressStepMutationType } from '@/__generated__/AddressStepMutation.graphql';
import LocationAutocomplete from '@/components/forms/LocationAutocomplete';
import CompleteProfileContext from '../CompleteProfileContext';

const AddressStepFragment = graphql`
fragment AddressStepFragment on Account {
	profile @required(action: THROW) {
		address
	}
}
`;

const AddressStepMutation = graphql`
mutation AddressStepMutation($address: String) {
	updateProfilePersonalDetails(address: $address) {
		__typename
		...on Account {
			...CompleteProfileDrawerFragment
		}
		... on InvalidLocationError {
			message
		}
	}
}
`;

const addressSchema = z.object({
	address: z.string().min(1, 'Please provide your address')
});

interface AddressStepProps {
	account: AddressStepFragment$key;
}

export default function AddressStep({ account }: AddressStepProps) {
	const data = useFragment(AddressStepFragment, account);
	const { send } = CompleteProfileContext.useActorRef();

	const { control, handleSubmit, formState, setError } = useForm<z.infer<typeof addressSchema>>({
		resolver: standardSchemaResolver(addressSchema),
		defaultValues: { address: data.profile.address || '' }
	});

	const [commitMutation] = useMutation<AddressStepMutationType>(AddressStepMutation);

	const onSubmit = (formData: z.infer<typeof addressSchema>) => {
		commitMutation({
			variables: {
				address: formData.address
			},
			onCompleted(response) {
				if (response.updateProfilePersonalDetails.__typename === 'InvalidLocationError') {
					setError('address', { message: response.updateProfilePersonalDetails.message });
					return;
				}
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
				<h3 className='text-lg font-medium'>Current Address</h3>
				<p className='text-sm text-foreground-600'>We couldn't find this in your resume.</p>
			</div>

			<Controller
				name='address'
				control={control}
				render={({ field, fieldState }) => (
					<LocationAutocomplete
						label='Current Address'
						variant='bordered'
						value={field.value || ''}
						onValueChange={field.onChange}
						onChange={location => {
							if (location.address.displayName) field.onChange(location.address.displayName);
						}}
						placeholder='Enter your address'
						errorMessage={fieldState.error?.message}
						isInvalid={!!fieldState.error}
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

'use client';

import { Button } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import type { AddressStepMutation as AddressStepMutationType } from '@/__generated__/AddressStepMutation.graphql';
import LocationAutocomplete from '@/components/forms/LocationAutocomplete';
import CompleteProfileContext from '../CompleteProfileContext';

const AddressStepMutation = graphql`
mutation AddressStepMutation($address: String) {
	updateProfilePersonalDetails(address: $address) {
		__typename
		...on Account {
			profile {
				address
			}
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

export default function AddressStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const address = CompleteProfileContext.useSelector(state => state.context.address);

	const { control, handleSubmit, formState, setError } = useForm<z.infer<typeof addressSchema>>({
		resolver: standardSchemaResolver(addressSchema),
		defaultValues: { address: address || '' }
	});

	const [commitMutation] = useMutation<AddressStepMutationType>(AddressStepMutation);

	const onSubmit = (data: z.infer<typeof addressSchema>) => {
		commitMutation({
			variables: {
				address: data.address
			},
			onCompleted(response) {
				if (response.updateProfilePersonalDetails.__typename === 'InvalidLocationError') {
					setError('address', { message: response.updateProfilePersonalDetails.message });
					return;
				}
				send({
					type: 'SUBMIT_ADDRESS',
					address: data.address
				});
			}
		});
	};

	const handlePrevious = () => {
		send({ type: 'PREVIOUS_STEP' });
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Address</h3>
				<p className='text-sm text-foreground-600'>Please provide your current address for profile completion.</p>
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

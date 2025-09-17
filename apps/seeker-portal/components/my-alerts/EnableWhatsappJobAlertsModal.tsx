'use client';

import type { EnableWhatsappJobAlertsModalFragment$key } from '@/__generated__/EnableWhatsappJobAlertsModalFragment.graphql';
import type { EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation } from '@/__generated__/EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation.graphql';
import type { EnableWhatsappJobAlertsModalUpdatePhoneNumberMutation } from '@/__generated__/EnableWhatsappJobAlertsModalUpdatePhoneNumberMutation.graphql';
import type { EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation } from '@/__generated__/EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation.graphql';
import links from '@/lib/links';
import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { ExternalLinkIcon, MessageSquareIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import { z } from 'zod/v4';

const EnableWhatsappJobAlertsModalFragment = graphql`
  fragment EnableWhatsappJobAlertsModalFragment on Query {
    viewer {
      __typename
      ... on Account {
        id
        phoneNumber
        whatsappJobAlertsEnabled
      }
    }
  }
`;

const RequestPhoneNumberVerificationTokenMutation = graphql`
  mutation EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation($phoneNumber: String!) {
    requestPhoneNumberVerificationToken(phoneNumber: $phoneNumber) {
      __typename
      ... on RequestPhoneNumberVerificationTokenSuccess {
        cooldownRemainingSeconds
      }
      ... on InvalidPhoneNumberError {
        message
      }
      ... on PhoneNumberAlreadyExistsError {
        message
      }
      ... on PhoneNumberVerificationTokenCooldownError {
        message
        remainingSeconds
      }
    }
  }
`;

const UpdateAccountPhoneNumberMutation = graphql`
  mutation EnableWhatsappJobAlertsModalUpdatePhoneNumberMutation($phoneNumber: String!, $phoneNumberVerificationToken: String!) {
    updateAccountPhoneNumber(phoneNumber: $phoneNumber, phoneNumberVerificationToken: $phoneNumberVerificationToken) {
      __typename
      ... on Account {
        id
        phoneNumber
      }
      ... on InvalidPhoneNumberVerificationTokenError {
        message
      }
      ... on InvalidPhoneNumberError {
        message
      }
    }
  }
`;

const UpdateAccountWhatsappJobAlertsMutation = graphql`
  mutation EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation($enabled: Boolean!) {
    updateAccountWhatsappJobAlerts(enabled: $enabled) {
      __typename
      ... on Account {
        id
        whatsappJobAlertsEnabled
      }
      ... on PhoneNumberMissingError {
        message
      }
    }
  }
`;

const phoneNumberSchema = z.object({
	phoneNumber: z.string().min(1, 'Phone number is required')
});

const verificationTokenSchema = z.object({
	verificationToken: z.string().min(1, 'Verification code is required')
});

type PhoneNumberFormData = z.infer<typeof phoneNumberSchema>;
type VerificationTokenFormData = z.infer<typeof verificationTokenSchema>;

type ModalStep = 'phone-entry' | 'verification' | 'direct-enable';

interface EnableWhatsappJobAlertsModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	query: EnableWhatsappJobAlertsModalFragment$key;
}

export default function EnableWhatsappJobAlertsModal({ isOpen, onOpenChange, query }: EnableWhatsappJobAlertsModalProps) {
	const data = useFragment(EnableWhatsappJobAlertsModalFragment, query);
	const [currentStep, setCurrentStep] = useState<ModalStep>('phone-entry');
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [commitRequestVerification, isRequestVerificationInFlight] =
		useMutation<EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation>(RequestPhoneNumberVerificationTokenMutation);
	const [commitUpdatePhoneNumber, isUpdatePhoneNumberInFlight] =
		useMutation<EnableWhatsappJobAlertsModalUpdatePhoneNumberMutation>(UpdateAccountPhoneNumberMutation);
	const [commitUpdateWhatsappAlerts, isUpdateWhatsappAlertsInFlight] =
		useMutation<EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation>(UpdateAccountWhatsappJobAlertsMutation);

	// Phone number form
	const phoneForm = useForm<PhoneNumberFormData>({
		resolver: standardSchemaResolver(phoneNumberSchema),
		defaultValues: {
			phoneNumber: ''
		}
	});

	// Verification token form
	const verificationForm = useForm<VerificationTokenFormData>({
		resolver: standardSchemaResolver(verificationTokenSchema),
		defaultValues: {
			verificationToken: ''
		}
	});

	// Determine initial step based on user's phone number
	useEffect(() => {
		if (data.viewer.__typename === 'Account') {
			if (data.viewer.phoneNumber) {
				setCurrentStep('direct-enable');
			} else {
				setCurrentStep('phone-entry');
			}
		}
	}, [data.viewer]);

	// Cooldown timer
	useEffect(() => {
		if (cooldownSeconds <= 0) return;

		const timer = setInterval(() => {
			setCooldownSeconds(prev => Math.max(0, prev - 1));
		}, 1000);

		return () => clearInterval(timer);
	}, [cooldownSeconds]);

	const formatResendCooldown = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	// Reset form states when modal closes
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setCurrentStep(data.viewer.__typename === 'Account' && data.viewer.phoneNumber ? 'direct-enable' : 'phone-entry');
			setPhoneNumber('');
			setCooldownSeconds(0);
			setIsSubmitting(false);
			phoneForm.reset();
			verificationForm.reset();
		}
		onOpenChange(open);
	};

	const handlePhoneNumberSubmit = (formData: PhoneNumberFormData) => {
		setIsSubmitting(true);
		commitRequestVerification({
			variables: {
				phoneNumber: `+91${formData.phoneNumber}`
			},
			onCompleted: response => {
				setIsSubmitting(false);

				const result = response.requestPhoneNumberVerificationToken;
				if (result.__typename === 'RequestPhoneNumberVerificationTokenSuccess') {
					setPhoneNumber(formData.phoneNumber);
					setCooldownSeconds(result.cooldownRemainingSeconds);
					setCurrentStep('verification');
				} else if (result.__typename === 'InvalidPhoneNumberError') {
					phoneForm.setError('phoneNumber', {
						type: 'manual',
						message: result.message
					});
				} else if (result.__typename === 'PhoneNumberAlreadyExistsError') {
					phoneForm.setError('phoneNumber', {
						type: 'manual',
						message: result.message
					});
				} else if (result.__typename === 'PhoneNumberVerificationTokenCooldownError') {
					setPhoneNumber(formData.phoneNumber);
					setCooldownSeconds(result.remainingSeconds);
					setCurrentStep('verification');
				}
			},
			onError: () => {
				setIsSubmitting(false);
				phoneForm.setError('phoneNumber', {
					type: 'manual',
					message: 'Failed to send verification code. Please try again.'
				});
			}
		});
	};

	const handleVerificationSubmit = (formData: VerificationTokenFormData) => {
		setIsSubmitting(true);
		commitUpdatePhoneNumber({
			variables: {
				phoneNumber: `+91${phoneNumber}`,
				phoneNumberVerificationToken: formData.verificationToken
			},
			onCompleted: (response, errors) => {
				if (errors) {
					setIsSubmitting(false);
					verificationForm.setError('verificationToken', {
						type: 'manual',
						message: 'An unexpected error occurred. Please try again.'
					});
					return;
				}

				const result = response.updateAccountPhoneNumber;
				if (result.__typename === 'Account') {
					// Phone number updated successfully, now enable WhatsApp alerts
					commitUpdateWhatsappAlerts({
						variables: {
							enabled: true
						},
						onCompleted: (whatsappResponse, whatsappErrors) => {
							setIsSubmitting(false);
							if (whatsappErrors) {
								addToast({
									title: 'Phone number updated',
									description: 'Phone number updated but failed to enable WhatsApp alerts. Please try again.',
									color: 'warning'
								});
							} else {
								const whatsappResult = whatsappResponse.updateAccountWhatsappJobAlerts;
								if (whatsappResult.__typename === 'Account') {
									addToast({
										title: 'Success!',
										description: 'WhatsApp job alerts have been enabled successfully',
										color: 'success'
									});
									handleOpenChange(false);
								} else {
									addToast({
										title: 'Phone number updated',
										description: 'Phone number updated but failed to enable WhatsApp alerts. Please try again.',
										color: 'warning'
									});
								}
							}
						},
						onError: () => {
							setIsSubmitting(false);
							addToast({
								title: 'Phone number updated',
								description: 'Phone number updated but failed to enable WhatsApp alerts. Please try again.',
								color: 'warning'
							});
						}
					});
				} else if (result.__typename === 'InvalidPhoneNumberVerificationTokenError') {
					setIsSubmitting(false);
					verificationForm.setError('verificationToken', {
						type: 'manual',
						message: result.message
					});
				} else if (result.__typename === 'InvalidPhoneNumberError') {
					setIsSubmitting(false);
					verificationForm.setError('verificationToken', {
						type: 'manual',
						message: result.message
					});
				}
			},
			onError: () => {
				setIsSubmitting(false);
				verificationForm.setError('verificationToken', {
					type: 'manual',
					message: 'Failed to verify phone number. Please try again.'
				});
			}
		});
	};

	const handleDirectEnableWhatsappAlerts = () => {
		setIsSubmitting(true);
		commitUpdateWhatsappAlerts({
			variables: {
				enabled: true
			},
			onCompleted: (response, errors) => {
				setIsSubmitting(false);
				if (errors) {
					addToast({
						title: 'Error',
						description: 'Failed to enable WhatsApp alerts. Please try again.',
						color: 'danger'
					});
					return;
				}

				const result = response.updateAccountWhatsappJobAlerts;
				if (result.__typename === 'Account') {
					addToast({
						title: 'Success!',
						description: 'WhatsApp job alerts have been enabled successfully',
						color: 'success'
					});
					handleOpenChange(false);
				} else if (result.__typename === 'PhoneNumberMissingError') {
					addToast({
						title: 'Error',
						description: result.message,
						color: 'danger'
					});
				}
			},
			onError: () => {
				setIsSubmitting(false);
				addToast({
					title: 'Error',
					description: 'Failed to enable WhatsApp alerts. Please try again.',
					color: 'danger'
				});
			}
		});
	};

	const handleResendVerification = () => {
		if (cooldownSeconds > 0) return;

		commitRequestVerification({
			variables: {
				phoneNumber: `+91${phoneNumber}`
			},
			onCompleted: (response, errors) => {
				if (errors) return;

				const result = response.requestPhoneNumberVerificationToken;
				if (result.__typename === 'RequestPhoneNumberVerificationTokenSuccess') {
					setCooldownSeconds(result.cooldownRemainingSeconds);
					addToast({
						title: 'Code sent',
						description: 'A new verification code has been sent to your WhatsApp',
						color: 'success'
					});
				} else if (result.__typename === 'PhoneNumberVerificationTokenCooldownError') {
					setCooldownSeconds(result.remainingSeconds);
				}
			}
		});
	};

	const renderModalContent = () => {
		if (data.viewer.__typename !== 'Account') return null;

		switch (currentStep) {
			case 'phone-entry':
				return (
					<form onSubmit={phoneForm.handleSubmit(handlePhoneNumberSubmit)}>
						<ModalHeader className='flex flex-col gap-1 pb-2 text-sm text-foreground-600'>
							<div className='flex items-center gap-2'>
								<PhoneIcon size={16} className='text-foreground-600' />
								<span>Add Phone Number</span>
							</div>
							<p className='text-sm text-foreground-500 font-normal mt-1'>Enter your WhatsApp number to receive job alerts</p>
						</ModalHeader>

						<ModalBody className='py-6'>
							<Controller
								name='phoneNumber'
								control={phoneForm.control}
								render={({ field }) => (
									<Input
										{...field}
										type='tel'
										label='WhatsApp Phone Number'
										startContent={<p className='text-sm'>+91 </p>}
										placeholder='98765 43210'
										errorMessage={phoneForm.formState.errors.phoneNumber?.message}
										isInvalid={!!phoneForm.formState.errors.phoneNumber}
										description='We will send a verification code to this number'
										isRequired
										validationBehavior='aria'
									/>
								)}
							/>
						</ModalBody>

						<ModalFooter>
							<Button variant='light' onPress={() => handleOpenChange(false)}>
								Cancel
							</Button>
							<Button color='primary' type='submit' isLoading={isSubmitting || isRequestVerificationInFlight} className='px-6'>
								Send Code
							</Button>
						</ModalFooter>
					</form>
				);

			case 'verification':
				return (
					<form onSubmit={verificationForm.handleSubmit(handleVerificationSubmit)} className='flex flex-col gap-4'>
						<ModalHeader className='flex flex-col gap-1 pb-2 text-sm text-foreground-600'>
							<div className='flex items-center gap-2'>
								<MessageSquareIcon size={16} className='text-foreground-600' />
								<span>Verify Phone Number</span>
							</div>
							<p className='text-sm text-foreground-500 font-normal mt-1'>Enter the 6-digit code sent to +91{phoneNumber}</p>
						</ModalHeader>

						<ModalBody>
							<div className='flex items-center justify-between gap-6'>
								<Controller
									name='verificationToken'
									control={verificationForm.control}
									render={({ field }) => (
										<Input
											{...field}
											type='text'
											label='Verification Code'
											description='Enter the 6-digit code sent to your WhatsApp number'
											errorMessage={verificationForm.formState.errors.verificationToken?.message}
											isInvalid={!!verificationForm.formState.errors.verificationToken}
											maxLength={6}
											className='w-full'
											isRequired
											validationBehavior='aria'
										/>
									)}
								/>
								<div className='flex justify-center'>
									{cooldownSeconds > 0 ? (
										<div className='flex flex-col gap-1 text-foreground-500'>
											<span className='text-tiny whitespace-nowrap'>Resend in</span>
											<p className='text-md font-medium'>{formatResendCooldown(cooldownSeconds)}</p>
										</div>
									) : (
										<Button size='sm' variant='faded' onPress={handleResendVerification} isDisabled={isRequestVerificationInFlight}>
											Resend Code
										</Button>
									)}
								</div>
							</div>
						</ModalBody>

						<ModalFooter>
							<Button variant='light' onPress={() => setCurrentStep('phone-entry')}>
								Back
							</Button>
							<Button
								color='primary'
								type='submit'
								isDisabled={!verificationForm.formState.isValid}
								isLoading={isSubmitting || isUpdatePhoneNumberInFlight}
								className='px-6'
							>
								Verify & Enable
							</Button>
						</ModalFooter>
					</form>
				);

			case 'direct-enable':
				return (
					<>
						<ModalHeader className='flex flex-col gap-1 pb-2 text-sm text-foreground-600'>
							<div className='flex items-center gap-2'>
								<span>Enable WhatsApp Job Alerts</span>
							</div>
							<p className='text-sm text-foreground-500 font-normal mt-1'>Get notified about new job opportunities directly on WhatsApp</p>
						</ModalHeader>

						<ModalBody className='py-6'>
							<div className='flex flex-col gap-4'>
								<p className='text-foreground-600'>
									We'll send new job alerts to <strong>{data.viewer.phoneNumber}</strong> via WhatsApp.
								</p>
								<Link href={links.accountSettings} className='text-sm flex items-center gap-2' target='_blank' rel='noopener noreferrer'>
									Change Phone number <ExternalLinkIcon size={14} />
								</Link>
							</div>
						</ModalBody>

						<ModalFooter>
							<Button variant='light' onPress={() => handleOpenChange(false)}>
								Cancel
							</Button>
							<Button
								color='primary'
								onPress={handleDirectEnableWhatsappAlerts}
								isLoading={isSubmitting || isUpdateWhatsappAlertsInFlight}
								className='px-6'
							>
								Enable Alerts
							</Button>
						</ModalFooter>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='xl' placement='center' className='p-4' isDismissable={!isSubmitting}>
			<ModalContent>{renderModalContent()}</ModalContent>
		</Modal>
	);
}

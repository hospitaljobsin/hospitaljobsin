'use client';

import type { DisableWhatsappJobAlertsModalFragment$key } from '@/__generated__/DisableWhatsappJobAlertsModalFragment.graphql';
import type { DisableWhatsappJobAlertsModalMutation } from '@/__generated__/DisableWhatsappJobAlertsModalMutation.graphql';
import { addToast, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useState } from 'react';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';

const DisableWhatsappJobAlertsModalFragment = graphql`
  fragment DisableWhatsappJobAlertsModalFragment on Query {
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

const DisableWhatsappJobAlertsMutation = graphql`
  mutation DisableWhatsappJobAlertsModalMutation($enabled: Boolean!) {
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

interface DisableWhatsappJobAlertsModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	query: DisableWhatsappJobAlertsModalFragment$key;
}

export default function DisableWhatsappJobAlertsModal({ isOpen, onOpenChange, query }: DisableWhatsappJobAlertsModalProps) {
	const data = useFragment(DisableWhatsappJobAlertsModalFragment, query);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [commitMutation, isMutationInFlight] = useMutation<DisableWhatsappJobAlertsModalMutation>(DisableWhatsappJobAlertsMutation);

	const handleDisableWhatsappAlerts = () => {
		setIsSubmitting(true);
		commitMutation({
			variables: {
				enabled: false
			},
			onCompleted: (response, errors) => {
				setIsSubmitting(false);
				if (errors) {
					addToast({
						title: 'Error',
						description: 'Failed to disable WhatsApp alerts. Please try again.',
						color: 'danger'
					});
					return;
				}

				const result = response.updateAccountWhatsappJobAlerts;
				if (result.__typename === 'Account') {
					addToast({
						title: 'WhatsApp alerts disabled',
						description: 'You will no longer receive job alerts on WhatsApp',
						color: 'success'
					});
					onOpenChange(false);
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
					description: 'Failed to disable WhatsApp alerts. Please try again.',
					color: 'danger'
				});
			}
		});
	};

	const handleOpenChange = (open: boolean) => {
		if (!isSubmitting) {
			onOpenChange(open);
		}
	};

	if (data.viewer.__typename !== 'Account') {
		return null;
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='lg' className='p-4' placement='center' isDismissable={!isSubmitting}>
			<ModalContent>
				<ModalHeader className='flex flex-col gap-1 pb-2'>
					<span>Disable WhatsApp Job Alerts</span>
				</ModalHeader>

				<ModalBody className='py-6'>
					<div className='flex flex-col gap-4'>
						<p className='text-foreground-600'>
							Are you sure you want to disable WhatsApp job alerts for <strong>{data.viewer.phoneNumber}</strong>? You will no longer
							receive notifications about new job opportunities on WhatsApp.
						</p>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button variant='light' onPress={() => handleOpenChange(false)} isDisabled={isSubmitting}>
						Cancel
					</Button>
					<Button color='danger' onPress={handleDisableWhatsappAlerts} isLoading={isSubmitting || isMutationInFlight} className='px-6'>
						Disable WhatsApp Alerts
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

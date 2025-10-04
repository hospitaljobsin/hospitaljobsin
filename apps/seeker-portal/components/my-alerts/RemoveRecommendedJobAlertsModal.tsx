import { addToast, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useState } from 'react';
import { ConnectionHandler, graphql, useMutation } from 'react-relay';
import type { RemoveRecommendedJobAlertsModalMutation as RemoveRecommendedJobAlertsMutationType } from '@/__generated__/RemoveRecommendedJobAlertsModalMutation.graphql';

const RemoveRecommendedJobAlertsMutation = graphql`
  mutation RemoveRecommendedJobAlertsModalMutation($connections: [ID!]!) {
    removeRecommendedJobAlerts {
      __typename
      ... on RemoveRecommendedJobAlertsSuccess {
                removedRecommendedJobAlertIds @deleteEdge(connections: $connections)
      }
      ... on RecommendedJobAlertsNotFoundError {
        message
      }
    }
  }
`;

interface RemoveRecommendedJobAlertsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export default function RemoveRecommendedJobAlertsModal({ isOpen, onClose, onSuccess }: RemoveRecommendedJobAlertsModalProps) {
	const [isRemoving, setIsRemoving] = useState(false);

	const [removeRecommendedJobAlerts] = useMutation<RemoveRecommendedJobAlertsMutationType>(RemoveRecommendedJobAlertsMutation);

	const handleRemove = () => {
		setIsRemoving(true);

		removeRecommendedJobAlerts({
			variables: {
				connections: [ConnectionHandler.getConnectionID('client:root', 'RecommendedJobAlertsFragment_recommendedJobAlerts')]
			},
			onCompleted: response => {
				setIsRemoving(false);
				if (response.removeRecommendedJobAlerts.__typename === 'RemoveRecommendedJobAlertsSuccess') {
					addToast({ title: 'Recommended job alerts removed', color: 'success' });
					onSuccess();
					onClose();
				} else if (response.removeRecommendedJobAlerts.__typename === 'RecommendedJobAlertsNotFoundError') {
					addToast({ title: response.removeRecommendedJobAlerts.message, color: 'danger' });
				}
			},
			onError: () => {
				setIsRemoving(false);
				addToast({ title: 'Failed to remove recommended job alerts' });
			}
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalContent>
				<ModalHeader>Don't Add Recommended Job Alerts</ModalHeader>
				<ModalBody>
					<p>Are you sure you don't want to add these recommended job alerts? We won't ask you again.</p>
				</ModalBody>
				<ModalFooter>
					<Button variant='light' onPress={onClose}>
						Cancel
					</Button>
					<Button color='danger' onPress={handleRemove} isLoading={isRemoving}>
						Don't Add Alerts
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

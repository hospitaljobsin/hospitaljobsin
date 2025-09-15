'use client';

import type { DeleteJobAlertConfirmationModalFragment$key } from '@/__generated__/DeleteJobAlertConfirmationModalFragment.graphql';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

const DeleteJobAlertConfirmationModalFragment = graphql`
  fragment DeleteJobAlertConfirmationModalFragment on JobAlert {
    id
    filters {
      searchTerm
    }
  }
`;

interface DeleteJobAlertConfirmationModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	jobAlert: DeleteJobAlertConfirmationModalFragment$key;
	onDelete: (jobAlertId: string) => void;
	isDeleting: boolean;
}

export default function DeleteJobAlertConfirmationModal({
	isOpen,
	onOpenChange,
	jobAlert,
	onDelete,
	isDeleting
}: DeleteJobAlertConfirmationModalProps) {
	const data = useFragment(DeleteJobAlertConfirmationModalFragment, jobAlert);

	const handleDelete = () => {
		onDelete(data.id);
	};

	const handleClose = () => {
		onOpenChange(false);
	};

	const alertTitle = data.filters.searchTerm || 'Job Alert';

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='md'>
			<ModalContent>
				<ModalHeader className='flex items-center gap-2'>Confirm Deletion</ModalHeader>

				<ModalBody>
					<p>
						Are you sure you want to delete the job alert for <span className='font-medium'>{alertTitle}</span>? This action cannot be
						undone.
					</p>
				</ModalBody>

				<ModalFooter>
					<Button variant='light' onPress={handleClose} isDisabled={isDeleting}>
						Cancel
					</Button>
					<Button color='danger' onPress={handleDelete} isLoading={isDeleting}>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

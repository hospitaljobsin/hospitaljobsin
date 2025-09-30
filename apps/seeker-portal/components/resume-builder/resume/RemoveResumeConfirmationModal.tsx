'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';

interface RemoveResumeConfirmationModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onConfirm: () => void;
	isRemoving: boolean;
}

export default function RemoveResumeConfirmationModal({ isOpen, onOpenChange, onConfirm, isRemoving }: RemoveResumeConfirmationModalProps) {
	const handleConfirm = () => {
		onConfirm();
	};

	const handleClose = () => {
		onOpenChange(false);
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='md'>
			<ModalContent>
				<ModalHeader>Remove Resume</ModalHeader>
				<ModalBody>
					<p>Are you sure you want to remove your resume? This action cannot be undone.</p>
				</ModalBody>
				<ModalFooter>
					<Button variant='light' onPress={handleClose} isDisabled={isRemoving}>
						Cancel
					</Button>
					<Button color='danger' onPress={handleConfirm} isLoading={isRemoving}>
						Remove
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

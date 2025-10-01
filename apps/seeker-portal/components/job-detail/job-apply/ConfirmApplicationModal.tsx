import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';

interface ConfirmApplicationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
}

export default function ConfirmApplicationModal({ isOpen, onClose, onConfirm, isLoading }: ConfirmApplicationModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size='md' isDismissable={!isLoading} isKeyboardDismissDisabled={isLoading}>
			<ModalContent>
				<ModalHeader>Confirm Application</ModalHeader>
				<ModalBody>
					<p>Are you sure you want to submit your job application? You won't be able to undo this.</p>
				</ModalBody>
				<ModalFooter className='flex gap-4'>
					<Button variant='flat' onPress={onClose} fullWidth>
						Cancel
					</Button>
					<Button color='primary' isLoading={isLoading} onPress={onConfirm} fullWidth>
						Confirm
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

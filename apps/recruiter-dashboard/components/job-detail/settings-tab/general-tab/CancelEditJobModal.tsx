import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";

type Props = {
	isOpen: boolean;
	onOpenChange: (arg: boolean) => void;
	onCancel: () => void;
};

export default function CancelEditJobModal({
	isOpen,
	onOpenChange,
	onCancel,
}: Props) {
	function handleDiscardChanges() {
		onCancel();
		onOpenChange(false);
	}

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="center"
			hideCloseButton
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Discard changes?
						</ModalHeader>
						<ModalBody>
							<p>
								You have unsaved changes. Are you sure you want to discard them?
							</p>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								Keep editing
							</Button>
							<Button color="danger" onPress={handleDiscardChanges}>
								Close and discard
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

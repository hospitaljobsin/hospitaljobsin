import type { RemovePhoneNumberModalMutation } from "@/__generated__/RemovePhoneNumberModalMutation.graphql";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";

const RemovePhoneNumberMutation = graphql`
	mutation RemovePhoneNumberModalMutation {
		removeAccountPhoneNumber {
			__typename
			... on Account {
				id
				phoneNumber
			}
			... on PhoneNumberDoesNotExistError {
				message
			}
		}
	}
`;

type Props = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	onSuccess?: () => void;
};

export default function RemovePhoneNumberModal({
	isOpen,
	onOpenChange,
	onClose,
	onSuccess,
}: Props) {
	const [commitMutation, isMutationInFlight] =
		useMutation<RemovePhoneNumberModalMutation>(RemovePhoneNumberMutation);

	function handleRemovePhoneNumber() {
		commitMutation({
			variables: {},
			onCompleted(response) {
				if (
					response.removeAccountPhoneNumber.__typename ===
					"PhoneNumberDoesNotExistError"
				) {
					// Handle error case - phone number doesn't exist
					console.error("Phone number does not exist");
				} else if (response.removeAccountPhoneNumber.__typename === "Account") {
					// Success case
					onSuccess?.();
				}
				onClose();
			},
			onError(error) {
				console.error("Error removing phone number:", error);
				onClose();
			},
		});
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
			<ModalContent className="flex flex-col w-full p-4 sm:p-6">
				<ModalHeader>
					<h2 className="text-lg font-medium">Remove Phone Number</h2>
				</ModalHeader>
				<ModalBody>
					<p className="text-foreground-500">
						Are you sure you want to remove your phone number? This action
						cannot be undone.
					</p>
				</ModalBody>
				<ModalFooter className="w-full">
					<Button variant="light" onPress={onClose}>
						Cancel
					</Button>
					<Button
						color="danger"
						isLoading={isMutationInFlight}
						onPress={handleRemovePhoneNumber}
					>
						Remove Phone Number
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

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
import type { DeletePasswordModalMutation } from "./__generated__/DeletePasswordModalMutation.graphql";

const DeletePasswordMutation = graphql`
  mutation DeletePasswordModalMutation {
	deletePassword {
		__typename
        ... on Account {
            id
            ...PasswordFragment
        }
		... on InsufficientAuthProvidersError {
			message
		}
	}
  }
`;

export default function DeletePasswordModal({
	isOpen,
	onOpenChange,
	onClose,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
}) {
	const [commitMutation, isMutationInFlight] =
		useMutation<DeletePasswordModalMutation>(DeletePasswordMutation);

	function handleDisable2FA() {
		commitMutation({
			variables: {},
			onCompleted(response) {
				if (
					response.deletePassword.__typename ===
					"InsufficientAuthProvidersError"
				) {
					// TODO: show a toast here
				}

				onClose();
			},
		});
	}
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent className="flex flex-col w-full p-4 sm:p-6">
					<ModalHeader>
						<h2 className="text-lg font-medium">Delete Password</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to delete your password? This could make
							your account recovery more difficult. If you want to enhance
							protection, it's a better idea to enable 2FA.
						</p>
					</ModalBody>
					<ModalFooter className="w-full">
						<Button variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="danger"
							isLoading={isMutationInFlight}
							onPress={handleDisable2FA}
						>
							Delete Password
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

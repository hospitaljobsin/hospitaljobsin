import type { DeletePasskeyModalFragment$key } from "@/__generated__/DeletePasskeyModalFragment.graphql";
import type { DeletePasskeyModalMutation } from "@/__generated__/DeletePasskeyModalMutation.graphql";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";

const DeletePasskeyModalFragment = graphql`
  fragment DeletePasskeyModalFragment on WebAuthnCredential {
    id
  }
  `;

const DeletePasskeyMutation = graphql`
  mutation DeletePasskeyModalMutation($webAuthnCredentialId: ID!, $connections: [ID!]!) {
    deleteWebAuthnCredential(webAuthnCredentialId: $webAuthnCredentialId) {
		__typename
		... on DeleteWebAuthnCredentialSuccess {
			webAuthnCredentialEdge {
			node {
				id @deleteEdge(connections: $connections)
			}
			}
		}
		... on WebAuthnCredentialNotFoundError {
			message
		}

		... on InsufficientAuthProvidersError {
			message
		}
  }
  }
`;

export default function DeletePasskeyModal({
	isOpen,
	onOpenChange,
	onClose,
	passkey,
	passkeysConnectionId,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	passkey: DeletePasskeyModalFragment$key;
	passkeysConnectionId: string;
}) {
	const data = useFragment(DeletePasskeyModalFragment, passkey);
	const [commitMutation, isMutationInFlight] =
		useMutation<DeletePasskeyModalMutation>(DeletePasskeyMutation);

	function handleDeletePasskey() {
		commitMutation({
			variables: {
				webAuthnCredentialId: data.id,
				connections: [passkeysConnectionId],
			},
			onCompleted(response) {
				if (
					response.deleteWebAuthnCredential.__typename ===
					"WebAuthnCredentialNotFoundError"
				) {
					// TODO: show a toast here
				} else if (
					response.deleteWebAuthnCredential.__typename ===
					"DeleteWebAuthnCredentialSuccess"
				) {
					// TODO: show a toast here
				}
			},
		});
		onClose();
	}
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent className="flex flex-col w-full p-4 sm:p-6">
					<ModalHeader>
						<h2 className="text-lg font-medium">Delete Passkey</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to delete this passkey? This action cannot
							be undone.
						</p>
					</ModalBody>
					<ModalFooter className="w-full">
						<Button variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="danger"
							isLoading={isMutationInFlight}
							onPress={handleDeletePasskey}
						>
							Delete passkey
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

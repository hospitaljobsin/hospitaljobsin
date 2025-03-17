import type { DisableAuthenticator2FAModalMutation } from "@/__generated__/DisableAuthenticator2FAModalMutation.graphql";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	addToast,
} from "@heroui/react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";

const DisableAuthenticator2FAMutation = graphql`
  mutation DisableAuthenticator2FAModalMutation {
	disableAccount2faWithAuthenticator {
		__typename
        ... on Account {
            id
            ...TwoFactorAuthenticationFragment
        }
		... on AuthenticatorNotEnabledError {
			message
		}
	}
  }
`;

export default function DisableAuthenticator2FAModal({
	isOpen,
	onOpenChange,
	onClose,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
}) {
	const [commitMutation, isMutationInFlight] =
		useMutation<DisableAuthenticator2FAModalMutation>(
			DisableAuthenticator2FAMutation,
		);

	function handleDisable2FA() {
		commitMutation({
			variables: {},
			onCompleted(response) {
				if (
					response.disableAccount2faWithAuthenticator.__typename ===
					"AuthenticatorNotEnabledError"
				) {
					addToast({
						title: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
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
						<h2 className="text-lg font-medium">
							Disable Two Factor Authentication
						</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to disable Two Factor Authentication via
							your authenticator app? This could make your account less secure.
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
							Disable
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

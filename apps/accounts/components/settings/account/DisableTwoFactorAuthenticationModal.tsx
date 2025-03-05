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
import type { DisableTwoFactorAuthenticationModalMutation } from "./__generated__/DisableTwoFactorAuthenticationModalMutation.graphql";

const DisableTwoFactorAuthenticationMutation = graphql`
  mutation DisableTwoFactorAuthenticationModalMutation {
	disableAccount2fa {
		__typename
        ... on Account {
            id
            ...TwoFactorAuthenticationFragment
        }
		... on TwoFactorAuthenticationNotEnabledError {
			message
		}
	}
  }
`;

export default function DisableTwoFactorAuthenticationModal({
	isOpen,
	onOpenChange,
	onClose,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
}) {
	const [commitMutation, isMutationInFlight] =
		useMutation<DisableTwoFactorAuthenticationModalMutation>(
			DisableTwoFactorAuthenticationMutation,
		);

	function handleDisable2FA() {
		commitMutation({
			variables: {},
		});
		onClose();
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
							Are you sure you want to disable Two Factor Authentication? This
							could make your account less secure.
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
							Disable 2FA
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

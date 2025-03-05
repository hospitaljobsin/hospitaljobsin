import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import SaveRecoveryCodesModal from "./SaveRecoveryCodesModal";
import type { RegenerateRecoveryCodesModalMutation } from "./__generated__/RegenerateRecoveryCodesModalMutation.graphql";

const RegenerateRecoveryCodesMutation = graphql`
  mutation RegenerateRecoveryCodesModalMutation {
	generate2faRecoveryCodes {
		__typename
		... on Generate2FARecoveryCodesSuccess {
			recoveryCodes
		}
		... on TwoFactorAuthenticationNotEnabledError {
			message
		}
	}
  }
`;

export default function RegenerateRecoveryCodesModal({
	isOpen,
	onOpenChange,
	onClose,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
}) {
	const [recoveryCodes, setRecoveryCodes] = useState<readonly string[] | null>(
		null,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<RegenerateRecoveryCodesModalMutation>(
			RegenerateRecoveryCodesMutation,
		);

	function handleRegenerateCodes() {
		commitMutation({
			variables: {},
			onCompleted(response) {
				if (
					response.generate2faRecoveryCodes.__typename ===
					"TwoFactorAuthenticationNotEnabledError"
				) {
					// TODO: show toast here
					onClose();
				} else if (
					response.generate2faRecoveryCodes.__typename ===
					"Generate2FARecoveryCodesSuccess"
				) {
					setRecoveryCodes(response.generate2faRecoveryCodes.recoveryCodes);
				}
			},
		});
	}

	if (recoveryCodes) {
		return (
			<SaveRecoveryCodesModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				recoveryCodes={recoveryCodes}
				onClose={() => {
					setRecoveryCodes(null);
					onClose();
				}}
			/>
		);
	}

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="xl"
			scrollBehavior="inside"
		>
			<ModalContent className="flex flex-col w-full p-4 sm:p-6">
				<ModalHeader className="flex flex-col gap-4 w-full">
					<h2 className="text-lg font-medium">Regenerate recovery codes</h2>
				</ModalHeader>
				<ModalBody className="w-full flex flex-col gap-8 items-start">
					<p className="text-foreground-400 w-full">
						Are you sure you want to regenerate your recovery codes? Your old
						set of codes will become invalid
					</p>
				</ModalBody>
				<ModalFooter className="w-full">
					<Button variant="light" onPress={onClose}>
						Cancel
					</Button>
					<Button
						color="primary"
						onPress={handleRegenerateCodes}
						isLoading={isMutationInFlight}
					>
						Regenerate codes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

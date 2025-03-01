import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import { dateFormat } from "@/lib/intl";
import {
	Button,
	Card,
	CardFooter,
	CardHeader,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import { Edit2, Fingerprint, Trash2 } from "lucide-react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import UpdatePasskeyModal from "./UpdatePasskeyModal";
import type { PasskeyAccountMetadataFragment$key } from "./__generated__/PasskeyAccountMetadataFragment.graphql";
import type { PasskeyDeleteMutation } from "./__generated__/PasskeyDeleteMutation.graphql";
import type { PasskeyFragment$key } from "./__generated__/PasskeyFragment.graphql";

export const PasskeyFragment = graphql`
  fragment PasskeyFragment on WebAuthnCredential {
	id
	nickname
    createdAt
	...UpdatePasskeyModalFragment
  }
`;

export const PasskeyAccountMetadataFragment = graphql`
  fragment PasskeyAccountMetadataFragment on Account {
	sudoModeExpiresAt
	authProviders
  }
`;

const DeletePasskeyMutation = graphql`
  mutation PasskeyDeleteMutation($webAuthnCredentialId: ID!, $connections: [ID!]!) {
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

type Props = {
	passkey: PasskeyFragment$key;
	account: PasskeyAccountMetadataFragment$key;
	passkeysConnectionId: string;
};

export default function Passkey({
	passkey,
	passkeysConnectionId,
	account,
	totalPasskeys,
}: Props & { totalPasskeys: number }) {
	const data = useFragment(PasskeyFragment, passkey);
	const accountData = useFragment(PasskeyAccountMetadataFragment, account);

	const isOnlyWebAuthn =
		accountData.authProviders.length === 1 &&
		accountData.authProviders[0] === "WEBAUTHN_CREDENTIAL";
	const isLastPasskey = totalPasskeys === 1;
	const canDelete = !(isOnlyWebAuthn && isLastPasskey);

	const { checkSudoMode } = useCheckSudoMode();

	const { onOpen, onOpenChange, onClose, isOpen } = useDisclosure();

	const [commitDelete, isDeleteMutationInFlight] =
		useMutation<PasskeyDeleteMutation>(DeletePasskeyMutation);

	async function handlePasskeyDelete() {
		if (checkSudoMode(accountData.sudoModeExpiresAt)) {
			commitDelete({
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
		}
	}

	return (
		<>
			<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
				<CardHeader className="w-full flex-col sm:flex-row flex justify-between items-start gap-6">
					<div className="flex gap-4 items-center">
						<Fingerprint size={24} />
						<h2 className="text-md sm:text-lg">{data.nickname}</h2>
					</div>
					<div className="flex items-center gap-4">
						<Tooltip content="Update passkey">
							<Button
								isIconOnly
								variant="light"
								color="default"
								onPress={onOpen}
							>
								<Edit2 size={20} />
							</Button>
						</Tooltip>
						<Tooltip
							content={
								canDelete ? "Delete passkey" : "Cannot delete the only passkey"
							}
						>
							<Button
								isIconOnly
								variant="light"
								color="danger"
								onPress={handlePasskeyDelete}
								isLoading={isDeleteMutationInFlight}
								isDisabled={!canDelete}
							>
								<Trash2 size={20} />
							</Button>
						</Tooltip>
					</div>
				</CardHeader>

				<CardFooter className="w-full flex justify-end sm:justify-start">
					<p className="text-foreground-400 text-sm">
						Created on {dateFormat.format(new Date(data.createdAt))}
					</p>
				</CardFooter>
			</Card>
			<UpdatePasskeyModal
				isOpen={isOpen}
				onClose={onClose}
				onOpenChange={onOpenChange}
				passkey={data}
			/>
		</>
	);
}

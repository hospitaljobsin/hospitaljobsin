import { dateFormat } from "@/lib/intl";
import { Button, Card, CardFooter, CardHeader, Tooltip } from "@heroui/react";
import { Fingerprint, Trash2 } from "lucide-react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import type { PasskeyDeleteMutation } from "./__generated__/PasskeyDeleteMutation.graphql";
import type { PasskeyFragment$key } from "./__generated__/PasskeyFragment.graphql";

export const PasskeyFragment = graphql`
  fragment PasskeyFragment on WebAuthnCredential {
	id
	nickname
    createdAt
  }
`;

const DeletePasskeyMutation = graphql`
  mutation PasskeyDeleteMutation($webAuthnCredentialId: ID!, $connections: [ID!]!) {
	deleteWebAuthnCredential(webAuthnCredentialId: $webAuthnCredentialId) {
		... on DeleteWebAuthnCredentialSuccess {
			webAuthnCredentialEdge {
			node {
				id @deleteEdge(connections: $connections)
			}
		}
	}
  }
}
`;

type Props = {
	passkey: PasskeyFragment$key;
	passkeysConnectionId: string;
};

export default function Passkey({ passkey, passkeysConnectionId }: Props) {
	const data = useFragment(PasskeyFragment, passkey);

	const [commitDelete, isDeleteMutationInFlight] =
		useMutation<PasskeyDeleteMutation>(DeletePasskeyMutation);

	async function handlePasskeyDelete() {
		commitDelete({
			variables: {
				webAuthnCredentialId: data.id,
				connections: [passkeysConnectionId],
			},
		});
	}

	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardHeader className="w-full flex justify-between gap-6">
				<div className="flex gap-4 items-center">
					<Fingerprint size={24} />
					<h2 className="text-lg">{data.nickname}</h2>
				</div>
				<div className="flex items-center">
					<Tooltip content="Delete passkey">
						<Button
							isIconOnly
							variant="light"
							color="danger"
							onPress={handlePasskeyDelete}
							isLoading={isDeleteMutationInFlight}
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
	);
}

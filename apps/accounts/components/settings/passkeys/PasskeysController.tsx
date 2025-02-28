import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import type { PasskeysControllerMutation } from "./__generated__/PasskeysControllerMutation.graphql";

const DeleteAllPasskeysMutation = graphql`
    mutation PasskeysControllerMutation($connections: [ID!]!) {
        deleteOtherSessions {
            deletedSessionIds @deleteEdge(connections: $connections)
        }
}
`;

type Props = {
	webauthnCredentialsConnectionId: string;
};

export default function PasskeysController({
	webauthnCredentialsConnectionId,
}: Props) {
	const [commitMutation, isMutationInFlight] =
		useMutation<PasskeysControllerMutation>(DeleteAllPasskeysMutation);

	async function handleCreatePasskey() {
		commitMutation({
			variables: {
				connections: [webauthnCredentialsConnectionId],
			},
		});
	}

	return (
		<>
			<Button
				startContent={<PlusIcon size={16} />}
				variant="flat"
				onPress={handleCreatePasskey}
				isLoading={isMutationInFlight}
				spinnerPlacement="end"
				className="hidden md:flex"
			>
				Create Passkey
			</Button>
			<Button
				startContent={<PlusIcon size={16} />}
				variant="flat"
				onPress={handleCreatePasskey}
				isLoading={isMutationInFlight}
				spinnerPlacement="end"
				size="sm"
				className="flex md:hidden"
			>
				Create Passkey
			</Button>
		</>
	);
}

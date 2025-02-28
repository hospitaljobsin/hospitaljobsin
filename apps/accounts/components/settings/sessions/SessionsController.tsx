import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import type { SessionsControllerMutation } from "./__generated__/SessionsControllerMutation.graphql";

const DeleteAllSessionsMutation = graphql`
    mutation SessionsControllerMutation($connections: [ID!]!) {
        deleteOtherSessions {
            deletedSessionIds @deleteEdge(connections: $connections)
        }
}
`;

type Props = {
	sessionsConnectionId: string;
	isDisabled: boolean;
};

export default function SessionsController({
	sessionsConnectionId,
	isDisabled,
}: Props) {
	const [commitMutation, isMutationInFlight] =
		useMutation<SessionsControllerMutation>(DeleteAllSessionsMutation);

	async function handleDeleteAllSessions() {
		commitMutation({
			variables: {
				connections: [sessionsConnectionId],
			},
		});
	}

	return (
		<>
			<Button
				startContent={<Trash2 size={16} />}
				color="danger"
				variant="light"
				onPress={handleDeleteAllSessions}
				isLoading={isMutationInFlight}
				spinnerPlacement="end"
				className="hidden md:flex"
				isDisabled={isDisabled}
			>
				Delete all sessions
			</Button>
			<Button
				startContent={<Trash2 size={16} />}
				color="danger"
				variant="light"
				onPress={handleDeleteAllSessions}
				isLoading={isMutationInFlight}
				spinnerPlacement="end"
				size="sm"
				className="flex md:hidden"
				isDisabled={isDisabled}
			>
				Delete all sessions
			</Button>
		</>
	);
}

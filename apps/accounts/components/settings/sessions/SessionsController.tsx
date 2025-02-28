import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useFragment, useMutation } from "react-relay";
import { ConnectionHandler, graphql } from "relay-runtime";
import type { SessionsControllerFragment$key } from "./__generated__/SessionsControllerFragment.graphql";
import type { SessionsControllerMutation } from "./__generated__/SessionsControllerMutation.graphql";

const DeleteAllSessionsMutation = graphql`
    mutation SessionsControllerMutation($connections: [ID!]!) {
        deleteOtherSessions {
            deletedSessionIds @deleteEdge(connections: $connections)
        }
}
`;

const SessionsControllerFragment = graphql`
    fragment SessionsControllerFragment on Account {
        id
    }
`;

type Props = {
	root: SessionsControllerFragment$key;
};

export default function SessionsController({ root }: Props) {
	const [commitMutation, isMutationInFlight] =
		useMutation<SessionsControllerMutation>(DeleteAllSessionsMutation);

	const data = useFragment(SessionsControllerFragment, root);

	const connectionID = ConnectionHandler.getConnectionID(
		data.id,
		"SessionsListFragment_sessions",
	);

	async function handleDeleteAllSessions() {
		commitMutation({
			variables: {
				connections: [connectionID],
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
			>
				Delete all sessions
			</Button>
		</>
	);
}

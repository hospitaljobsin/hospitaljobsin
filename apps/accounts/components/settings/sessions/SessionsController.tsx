import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import type { SessionsControllerFragment$key } from "./__generated__/SessionsControllerFragment.graphql";
import type { SessionsControllerMutation } from "./__generated__/SessionsControllerMutation.graphql";

const SessionsControllerFragment = graphql`
  fragment SessionsControllerFragment on Account {
   	sudoModeExpiresAt
  }
`;

const DeleteAllSessionsMutation = graphql`
    mutation SessionsControllerMutation($connections: [ID!]!) {
        deleteOtherSessions {
            deletedSessionIds @deleteEdge(connections: $connections)
        }
}
`;

type Props = {
	account: SessionsControllerFragment$key;
	sessionsConnectionId: string;
	isDisabled: boolean;
};

export default function SessionsController({
	sessionsConnectionId,
	isDisabled,
	account,
}: Props) {
	const { checkSudoMode } = useCheckSudoMode();
	const accountData = useFragment(SessionsControllerFragment, account);
	const [commitMutation, isMutationInFlight] =
		useMutation<SessionsControllerMutation>(DeleteAllSessionsMutation);

	async function handleDeleteAllSessions() {
		if (checkSudoMode(accountData.sudoModeExpiresAt)) {
			commitMutation({
				variables: {
					connections: [sessionsConnectionId],
				},
			});
		}
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

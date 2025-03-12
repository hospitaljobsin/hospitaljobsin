import type { SessionsControllerFragment$key } from "@/__generated__/SessionsControllerFragment.graphql";
import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import { Button, useDisclosure } from "@heroui/react";
import { Trash } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import DeleteOtherSessionsModal from "./DeleteOtherSessionsModal";

const SessionsControllerFragment = graphql`
  fragment SessionsControllerFragment on Account {
   	sudoModeExpiresAt
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
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const accountData = useFragment(SessionsControllerFragment, account);

	async function handleDeleteAllSessions() {
		if (checkSudoMode(accountData.sudoModeExpiresAt)) {
			onOpen();
		}
	}

	return (
		<>
			<Button
				startContent={<Trash size={16} />}
				color="danger"
				variant="light"
				onPress={handleDeleteAllSessions}
				spinnerPlacement="end"
				className="hidden md:flex"
				isDisabled={isDisabled}
			>
				Delete all sessions
			</Button>
			<Button
				startContent={<Trash size={16} />}
				color="danger"
				variant="light"
				onPress={handleDeleteAllSessions}
				spinnerPlacement="end"
				size="sm"
				className="flex md:hidden"
				isDisabled={isDisabled}
			>
				Delete all sessions
			</Button>
			<DeleteOtherSessionsModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onOpenChange}
				sessionsConnectionId={sessionsConnectionId}
			/>
		</>
	);
}

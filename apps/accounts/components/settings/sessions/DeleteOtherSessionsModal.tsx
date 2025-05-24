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
import type { DeleteOtherSessionsModalMutation } from "@/__generated__/DeleteOtherSessionsModalMutation.graphql";

const DeleteOtherSessionsMutation = graphql`
  mutation DeleteOtherSessionsModalMutation($connections: [ID!]!) {
    deleteOtherSessions {
            deletedSessionIds @deleteEdge(connections: $connections)
        }
  }
`;

export default function DeleteOtherSessionsModal({
	isOpen,
	onOpenChange,
	onClose,
	sessionsConnectionId,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	sessionsConnectionId: string;
}) {
	const [commitMutation, isMutationInFlight] =
		useMutation<DeleteOtherSessionsModalMutation>(DeleteOtherSessionsMutation);

	function handleDeleteAllSessions() {
		commitMutation({
			variables: {
				connections: [sessionsConnectionId],
			},
			onCompleted() {
				onClose();
			},
		});
	}
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent className="flex flex-col w-full p-4 sm:p-6">
					<ModalHeader>
						<h2 className="text-lg font-medium">Delete All Sessions</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to delete all other sessions? This action
							cannot be undone
						</p>
					</ModalBody>
					<ModalFooter className="w-full">
						<Button variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="danger"
							isLoading={isMutationInFlight}
							onPress={handleDeleteAllSessions}
						>
							Delete All Sessions
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import type { DeleteSessionModalFragment$key } from "./__generated__/DeleteSessionModalFragment.graphql";
import type { DeleteSessionModalMutation } from "./__generated__/DeleteSessionModalMutation.graphql";

const DeleteSessionModalFragment = graphql`
    fragment DeleteSessionModalFragment on Session {
        id
    }
    `;
const DeleteSessionMutation = graphql`
  mutation DeleteSessionModalMutation($sessionId: ID!, $connections: [ID!]!) {
	deleteSession(sessionId: $sessionId) {
		... on DeleteSessionSuccess {
			sessionEdge {
			node {
				id @deleteEdge(connections: $connections)
			}
		}
	}
  }
  }
`;

export default function DeleteSessionModal({
	isOpen,
	onOpenChange,
	onClose,
	sessionsConnectionId,
	session,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	sessionsConnectionId: string;
	session: DeleteSessionModalFragment$key;
}) {
	const data = useFragment(DeleteSessionModalFragment, session);
	const [commitMutation, isMutationInFlight] =
		useMutation<DeleteSessionModalMutation>(DeleteSessionMutation);

	function handleDeleteAllSessions() {
		commitMutation({
			variables: {
				sessionId: data.id,
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
						<h2 className="text-lg font-medium">Delete Session</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to delete this session? This action cannot
							be undone
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
							Delete Session
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

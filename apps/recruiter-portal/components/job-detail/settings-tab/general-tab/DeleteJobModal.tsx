import type { DeleteJobModalFragment$key } from "@/__generated__/DeleteJobModalFragment.graphql";
import type { DeleteJobModalMutation } from "@/__generated__/DeleteJobModalMutation.graphql";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	addToast,
} from "@heroui/react";
import { useFragment, useMutation } from "react-relay";
import { ConnectionHandler, graphql } from "relay-runtime";

const DeleteJobModalFragment = graphql`
    fragment DeleteJobModalFragment on Job {
        id
        organization @required(action: THROW) {
            id
        }
    }
    `;

const DeleteJobMutation = graphql`
  mutation DeleteJobModalMutation($jobId: ID!, $connections: [ID!]!) {
    deleteJob(jobId: $jobId) {
        __typename
        ... on Job {
            id @deleteEdge(connections: $connections)
        }
        ... on JobNotFoundError {
            __typename
        }

        ... on OrganizationAuthorizationError {
            __typename
        }
    }
  }
`;

export default function DeleteJobModal({
	isOpen,
	onOpenChange,
	onClose,
	invite,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	invite: DeleteJobModalFragment$key;
}) {
	const data = useFragment(DeleteJobModalFragment, invite);
	const [commitMutation, isMutationInFlight] =
		useMutation<DeleteJobModalMutation>(DeleteJobMutation);

	const connectionID = ConnectionHandler.getConnectionID(
		data.organization.id, // passed as input to the mutation/subscription
		"OrganizationJobsListInternalFragment_jobs",
	);

	function handleDeleteJob() {
		commitMutation({
			variables: {
				jobId: data.id,
				connections: [connectionID],
			},
			onCompleted(response) {
				onClose();
				if (response.deleteJob.__typename === "Job") {
					// handle success
				} else if (response.deleteJob.__typename === "JobNotFoundError") {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.deleteJob.__typename === "OrganizationAuthorizationError"
				) {
					addToast({
						description: "You are not authorized to perform this action.",
						color: "danger",
					});
				}
			},
		});
	}
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent className="flex flex-col w-full p-4 sm:p-6">
					<ModalHeader>
						<h2 className="text-lg font-medium">Delete Job</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to delete this job? This action cannot be
							undone.
						</p>
					</ModalBody>
					<ModalFooter className="w-full">
						<Button variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="danger"
							isLoading={isMutationInFlight}
							onPress={handleDeleteJob}
						>
							Delete Job
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

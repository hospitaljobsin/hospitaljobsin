import type { DeleteInviteModalFragment$key } from "@/__generated__/DeleteInviteModalFragment.graphql";
import type { DeleteInviteModalMutation } from "@/__generated__/DeleteInviteModalMutation.graphql";
import type { DeleteInviteModalOrganizationFragment$key } from "@/__generated__/DeleteInviteModalOrganizationFragment.graphql";
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
import { graphql } from "relay-runtime";

const DeleteInviteModalFragment = graphql`
    fragment DeleteInviteModalFragment on OrganizationInvite {
        id
        email
    }
    `;

const DeleteInviteModalOrganizationFragment = graphql`
    fragment DeleteInviteModalOrganizationFragment on Organization {
        id
    }
`;

const DeleteInviteMutation = graphql`
  mutation DeleteInviteModalMutation($inviteId: ID!, $organizationId: ID!, $connections: [ID!]!) {
	deleteOrganizationInvite(inviteId: $inviteId, organizationId: $organizationId) {
        __typename
		... on OrganizationInviteEdge {
			node {
				id @deleteEdge(connections: $connections)
			}
        }
        ... on OrganizationNotFoundError {
            __typename
        }
        ... on OrganizationInviteNotFoundError {
            __typename
        }
	}
  }
`;

export default function DeleteInviteModal({
	isOpen,
	onOpenChange,
	onClose,
	invitesConnectionId,
	invite,
	organization,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	invitesConnectionId: string;
	invite: DeleteInviteModalFragment$key;
	organization: DeleteInviteModalOrganizationFragment$key;
}) {
	const data = useFragment(DeleteInviteModalFragment, invite);
	const organizationData = useFragment(
		DeleteInviteModalOrganizationFragment,
		organization,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<DeleteInviteModalMutation>(DeleteInviteMutation);

	function handleDeleteAllInvites() {
		commitMutation({
			variables: {
				inviteId: data.id,
				organizationId: organizationData.id,
				connections: [invitesConnectionId],
			},
			onCompleted(response) {
				if (
					response.deleteOrganizationInvite.__typename ===
					"OrganizationInviteEdge"
				) {
					onClose();
				} else if (
					response.deleteOrganizationInvite.__typename ===
					"OrganizationNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.deleteOrganizationInvite.__typename ===
					"OrganizationInviteNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
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
						<h2 className="text-lg font-medium">Delete Organization Invite</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to delete this invite? <b>{data.email}</b>{" "}
							won't be invited to the organization.
						</p>
					</ModalBody>
					<ModalFooter className="w-full">
						<Button variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="danger"
							isLoading={isMutationInFlight}
							onPress={handleDeleteAllInvites}
						>
							Delete Invite
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

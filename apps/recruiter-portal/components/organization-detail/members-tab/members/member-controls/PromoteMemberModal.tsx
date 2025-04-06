import type { PromoteMemberModalFragment$key } from "@/__generated__/PromoteMemberModalFragment.graphql";
import type { PromoteMemberModalMutation } from "@/__generated__/PromoteMemberModalMutation.graphql";
import type { PromoteMemberModalOrganizationFragment$key } from "@/__generated__/PromoteMemberModalOrganizationFragment.graphql";
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

const PromoteMemberModalFragment = graphql`
    fragment PromoteMemberModalFragment on OrganizationMemberEdge {
        node {
            id
        }
    }
    `;

const PromoteMemberModalOrganizationFragment = graphql`
    fragment PromoteMemberModalOrganizationFragment on Organization {
        id
    }
`;

const PromoteMemberMutation = graphql`
  mutation PromoteMemberModalMutation($accountId: ID!, $organizationId: ID!) {
    promoteOrganizationMember(accountId: $accountId, organizationId: $organizationId) {
        __typename
        ... on OrganizationMemberEdge {
            ...MemberFragment
        }
        ... on OrganizationNotFoundError {
            __typename
        }
        ... on OrganizationMemberNotFoundError {
            __typename
        }
		... on OrganizationAuthorizationError {
			__typename
		}
    }
  }
`;

export default function PromoteMemberModal({
	isOpen,
	onOpenChange,
	onClose,
	member,
	organization,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	member: PromoteMemberModalFragment$key;
	organization: PromoteMemberModalOrganizationFragment$key;
}) {
	const data = useFragment(PromoteMemberModalFragment, member);
	const organizationData = useFragment(
		PromoteMemberModalOrganizationFragment,
		organization,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<PromoteMemberModalMutation>(PromoteMemberMutation);

	function handlePromoteMember() {
		commitMutation({
			variables: {
				accountId: data.node.id,
				organizationId: organizationData.id,
			},
			updater: (store, response) => {
				if (
					response?.promoteOrganizationMember?.__typename !==
					"OrganizationMemberEdge"
				) {
					return;
				}

				const organizationRecord = store.get(organizationData.id);
				if (!organizationRecord) return;

				// Get the connection using the same key used in your fragment
				const connection = ConnectionHandler.getConnection(
					organizationRecord,
					"OrganizationMembersListInternalFragment_members", // <-- Make sure this matches the key used in your fragment!
				);
				if (!connection) return;

				const newEdge = store.getRootField("promoteOrganizationMember");
				if (!newEdge) return;

				const newNode = newEdge.getLinkedRecord("node");
				if (!newNode) return;
				const newNodeId = newNode.getValue("id");

				// Replace the old edge with the new edge
				const existingEdges = connection.getLinkedRecords("edges") || [];
				const updatedEdges = existingEdges.map((edge) => {
					const edgeNode = edge?.getLinkedRecord("node");
					if (edgeNode?.getValue("id") === newNodeId) {
						return newEdge; // Replace this edge with the updated edge
					}
					return edge;
				});

				connection.setLinkedRecords(updatedEdges, "edges");
			},
			onCompleted(response) {
				if (
					response.promoteOrganizationMember.__typename ===
					"OrganizationMemberEdge"
				) {
					// successful case
				} else if (
					response.promoteOrganizationMember.__typename ===
					"OrganizationNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.promoteOrganizationMember.__typename ===
					"OrganizationMemberNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.promoteOrganizationMember.__typename ===
					"OrganizationAuthorizationError"
				) {
					addToast({
						description: "You are not authorized to perform this action.",
						color: "danger",
					});
				}
				onClose();
			},
		});
	}
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent className="flex flex-col w-full p-4 sm:p-6">
					<ModalHeader>
						<h2 className="text-lg font-medium">Promote Organization member</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to promote this member to admin? This grants
							them significant permissions and should only be done with trusted
							individuals. This action is irreversible.
						</p>
					</ModalBody>
					<ModalFooter className="w-full">
						<Button variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="primary"
							isLoading={isMutationInFlight}
							onPress={handlePromoteMember}
						>
							Promote member
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

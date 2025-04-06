import type { DemoteMemberModalFragment$key } from "@/__generated__/DemoteMemberModalFragment.graphql";
import type { DemoteMemberModalMutation } from "@/__generated__/DemoteMemberModalMutation.graphql";
import type { DemoteMemberModalOrganizationFragment$key } from "@/__generated__/DemoteMemberModalOrganizationFragment.graphql";
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

const DemoteMemberModalFragment = graphql`
    fragment DemoteMemberModalFragment on OrganizationMemberEdge {
        node {
            id
        }
    }
    `;

const DemoteMemberModalOrganizationFragment = graphql`
    fragment DemoteMemberModalOrganizationFragment on Organization {
        id
    }
`;

const DemoteMemberMutation = graphql`
  mutation DemoteMemberModalMutation($accountId: ID!, $organizationId: ID!) {
    demoteOrganizationMember(accountId: $accountId, organizationId: $organizationId) {
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
		... on InsufficientOrganizationAdminsError {
			__typename
		}
		... on OrganizationAuthorizationError {
			__typename
		}
    }
  }
`;

export default function DemoteMemberModal({
	isOpen,
	onOpenChange,
	onClose,
	member,
	organization,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	member: DemoteMemberModalFragment$key;
	organization: DemoteMemberModalOrganizationFragment$key;
}) {
	const data = useFragment(DemoteMemberModalFragment, member);
	const organizationData = useFragment(
		DemoteMemberModalOrganizationFragment,
		organization,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<DemoteMemberModalMutation>(DemoteMemberMutation);

	function handleDemoteMember() {
		commitMutation({
			variables: {
				accountId: data.node.id,
				organizationId: organizationData.id,
			},

			updater: (store, response) => {
				if (
					response?.demoteOrganizationMember?.__typename !==
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

				const newEdge = store.getRootField("demoteOrganizationMember");
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
					response.demoteOrganizationMember.__typename ===
					"OrganizationMemberEdge"
				) {
					// successful case
				} else if (
					response.demoteOrganizationMember.__typename ===
					"OrganizationNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.demoteOrganizationMember.__typename ===
					"OrganizationMemberNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.demoteOrganizationMember.__typename ===
					"InsufficientOrganizationAdminsError"
				) {
					addToast({
						description:
							"You must have at least one admin in the organization.",
						color: "danger",
					});
				} else if (
					response.demoteOrganizationMember.__typename ===
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
						<h2 className="text-lg font-medium">Demote Organization member</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to demote this member? This action cannot be
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
							onPress={handleDemoteMember}
						>
							Demote member
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

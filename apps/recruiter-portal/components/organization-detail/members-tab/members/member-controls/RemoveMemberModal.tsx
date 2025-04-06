import type { RemoveMemberModalFragment$key } from "@/__generated__/RemoveMemberModalFragment.graphql";
import type { RemoveMemberModalMutation } from "@/__generated__/RemoveMemberModalMutation.graphql";
import type { RemoveMemberModalOrganizationFragment$key } from "@/__generated__/RemoveMemberModalOrganizationFragment.graphql";
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

const RemoveMemberModalFragment = graphql`
    fragment RemoveMemberModalFragment on OrganizationMemberEdge {
        node {
            id
        }
    }
    `;

const RemoveMemberModalOrganizationFragment = graphql`
    fragment RemoveMemberModalOrganizationFragment on Organization {
        id
    }
`;

const DeleteMemberMutation = graphql`
  mutation RemoveMemberModalMutation($accountId: ID!, $organizationId: ID!, $connections: [ID!]!) {
    removeOrganizationMember(accountId: $accountId, organizationId: $organizationId) {
        __typename
        ... on RemoveOrganizationMemberSuccess { 
			organizationMemberEdge {
            	node {
                	id @deleteEdge(connections: $connections)
            	}
       		} 
			organization {
				id
				...MemberControlsOrganizationFragment
			}
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

export default function RemoveMemberModal({
	isOpen,
	onOpenChange,
	onClose,
	membersConnectionId,
	member,
	organization,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	membersConnectionId: string;
	member: RemoveMemberModalFragment$key;
	organization: RemoveMemberModalOrganizationFragment$key;
}) {
	const data = useFragment(RemoveMemberModalFragment, member);
	const organizationData = useFragment(
		RemoveMemberModalOrganizationFragment,
		organization,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<RemoveMemberModalMutation>(DeleteMemberMutation);

	function handleRemoveMember() {
		commitMutation({
			variables: {
				accountId: data.node.id,
				organizationId: organizationData.id,
				connections: [membersConnectionId],
			},
			onCompleted(response) {
				if (
					response.removeOrganizationMember.__typename ===
					"RemoveOrganizationMemberSuccess"
				) {
					// successful case
				} else if (
					response.removeOrganizationMember.__typename ===
					"OrganizationNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.removeOrganizationMember.__typename ===
					"OrganizationMemberNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.removeOrganizationMember.__typename ===
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
						<h2 className="text-lg font-medium">Remove Organization member</h2>
					</ModalHeader>
					<ModalBody>
						<p className="text-foreground-500">
							Are you sure you want to remove this member? This action cannot be
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
							onPress={handleRemoveMember}
						>
							Remove member
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

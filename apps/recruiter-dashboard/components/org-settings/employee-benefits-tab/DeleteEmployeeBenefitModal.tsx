'use client';
import { addToast, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { graphql, useFragment, useMutation } from 'react-relay';
import type { DeleteEmployeeBenefitModalFragment$key } from '@/__generated__/DeleteEmployeeBenefitModalFragment.graphql';
import type { DeleteEmployeeBenefitModalMutation as DeleteEmployeeBenefitModalMutationType } from '@/__generated__/DeleteEmployeeBenefitModalMutation.graphql';

const DeleteEmployeeBenefitModalFragment = graphql`
  fragment DeleteEmployeeBenefitModalFragment on EmployeeBenefit {
	id
	title
  }
`;

const DeleteMutation = graphql`
mutation DeleteEmployeeBenefitModalMutation($organizationId: ID!, $benefitId: ID!, $connections: [ID!]!) {
	deleteEmployeeBenefit(organizationId: $organizationId, benefitId: $benefitId) {
		__typename
		... on EmployeeBenefitEdge {
			node {
				id @deleteEdge(connections: $connections)
			}
		}
	}
}
`;

export default function DeleteEmployeeBenefitModal({
	isOpen,
	onOpenChange,
	onClose,
	benefit: benefitKey,
	organizationId,
	connectionId
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
	benefit: DeleteEmployeeBenefitModalFragment$key;
	organizationId: string;
	connectionId: string;
}) {
	const benefit = useFragment(DeleteEmployeeBenefitModalFragment, benefitKey);
	const [commitDelete, isDeleting] = useMutation<DeleteEmployeeBenefitModalMutationType>(DeleteMutation);

	function handleDelete() {
		commitDelete({
			variables: {
				organizationId,
				benefitId: benefit.id,
				connections: [connectionId]
			},
			onCompleted: response => {
				if (response.deleteEmployeeBenefit.__typename === 'EmployeeBenefitEdge') {
					addToast({ description: 'Benefit deleted successfully', color: 'success' });
					onClose();
				}
			}
		});
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>Delete Employee Benefit</ModalHeader>
				<ModalBody>
					<p>Are you sure you want to delete "{benefit.title}"? This action cannot be undone.</p>
				</ModalBody>
				<ModalFooter>
					<Button variant='light' onPress={onClose}>
						Cancel
					</Button>
					<Button color='danger' onPress={handleDelete} isLoading={isDeleting}>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

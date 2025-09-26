import type { DeleteOrganizationLogoModalFragment$key } from '@/__generated__/DeleteOrganizationLogoModalFragment.graphql';
import type { DeleteOrganizationLogoModalMutation } from '@/__generated__/DeleteOrganizationLogoModalMutation.graphql';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';

const DeleteAvatarMutation = graphql`
  mutation DeleteOrganizationLogoModalMutation($organizationId: ID!) {
    removeOrganizationLogo(organizationId: $organizationId) {
        __typename
        ... on Organization {
            ...UpdateOrganizationFormFragment
            ...JobCreationFormFragment
        }
        ... on OrganizationNotFoundError {
            __typename
        }
        ... on OrganizationNotFoundError {
            __typename
        }
    }
  }
`;

const DeleteOrganizationLogoModalFragment = graphql`
  fragment DeleteOrganizationLogoModalFragment on Organization {
    id
  }
`;

export default function DeleteOrganizationLogoModal({
	isOpen,
	onOpenChange,
	onClose,
	organization
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	organization: DeleteOrganizationLogoModalFragment$key;
}) {
	const data = useFragment(DeleteOrganizationLogoModalFragment, organization);
	const [commitMutation, isMutationInFlight] = useMutation<DeleteOrganizationLogoModalMutation>(DeleteAvatarMutation);

	function handleDelete() {
		commitMutation({
			variables: {
				organizationId: data.id
			}
		});
		onClose();
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl' scrollBehavior='inside' className='overflow-y-auto'>
			<ModalContent className='flex flex-col w-full p-4 sm:p-6'>
				<ModalHeader className='flex flex-col gap-4 w-full'>
					<h2 className='text-lg font-medium'>Remove Organiation Logo</h2>
				</ModalHeader>
				<ModalBody className='w-full flex flex-col gap-6 items-start'>
					<p className='text-foreground-400 text-small font-normal w-full'>
						Are you sure you want to remove this organization logo? A logo helps create a strong brand identity and makes your organization
						easily recognizable. If you remove it, a default logo will be used instead.
					</p>
				</ModalBody>
				<ModalFooter className='w-full flex justify-end'>
					<Button variant='light' onPress={onClose}>
						Cancel
					</Button>
					<Button color='danger' type='button' isLoading={isMutationInFlight} onPress={handleDelete}>
						Remove Logo
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

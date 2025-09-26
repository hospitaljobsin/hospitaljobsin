import type { DeleteOrganizationBannerModalFragment$key } from '@/__generated__/DeleteOrganizationBannerModalFragment.graphql';
import type { DeleteOrganizationBannerModalMutation } from '@/__generated__/DeleteOrganizationBannerModalMutation.graphql';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';

const DeleteAvatarMutation = graphql`
  mutation DeleteOrganizationBannerModalMutation($organizationId: ID!) {
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

const DeleteOrganizationBannerModalFragment = graphql`
  fragment DeleteOrganizationBannerModalFragment on Organization {
    id
  }
`;

export default function DeleteOrganizationBannerModal({
	isOpen,
	onOpenChange,
	onClose,
	organization
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	organization: DeleteOrganizationBannerModalFragment$key;
}) {
	const data = useFragment(DeleteOrganizationBannerModalFragment, organization);
	const [commitMutation, isMutationInFlight] = useMutation<DeleteOrganizationBannerModalMutation>(DeleteAvatarMutation);

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
					<h2 className='text-lg font-medium'>Remove Organiation Banner</h2>
				</ModalHeader>
				<ModalBody className='w-full flex flex-col gap-6 items-start'>
					<p className='text-foreground-400 text-small font-normal w-full'>
						Are you sure you want to remove this organization banner? A banner helps create a strong brand identity and makes your
						organization easily recognizable across social media links. If you remove it, a default banner will be used instead.
					</p>
				</ModalBody>
				<ModalFooter className='w-full flex justify-end'>
					<Button variant='light' onPress={onClose}>
						Cancel
					</Button>
					<Button color='danger' type='button' isLoading={isMutationInFlight} onPress={handleDelete}>
						Remove Banner
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

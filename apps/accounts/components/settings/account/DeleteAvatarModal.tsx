import type { DeleteAvatarModalMutation } from '@/__generated__/DeleteAvatarModalMutation.graphql';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';

const DeleteAvatarMutation = graphql`
  mutation DeleteAvatarModalMutation {
    removeAccountAvatar {
        __typename
        ... on Account {
            ...AccountDetailsFragment
            ...UpdateAccountDetailsFormFragment
            ...AuthNavigationFragment
        }
    }
  }
`;

export default function DeleteAvatarModal({
	isOpen,
	onOpenChange,
	onClose
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
}) {
	const [commitMutation, isMutationInFlight] = useMutation<DeleteAvatarModalMutation>(DeleteAvatarMutation);

	function handleDelete() {
		commitMutation({
			variables: {}
		});
		onClose();
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl' scrollBehavior='inside' className='overflow-y-auto'>
			<ModalContent className='flex flex-col w-full p-4 sm:p-6'>
				<ModalHeader className='flex flex-col gap-4 w-full'>
					<h2 className='text-lg font-medium'>Remove Avatar</h2>
				</ModalHeader>
				<ModalBody className='w-full flex flex-col gap-6 items-start'>
					<p className='text-foreground-400 text-small font-normal w-full'>
						Are you sure you want to remove your avatar? An avatar adds a personal touch to your account and helps others recognize you. If
						you remove it, a default avatar will be used instead.
					</p>
				</ModalBody>
				<ModalFooter className='w-full flex justify-end'>
					<Button variant='light' onPress={onClose}>
						Cancel
					</Button>
					<Button color='danger' type='button' isLoading={isMutationInFlight} onPress={handleDelete}>
						Remove Avatar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

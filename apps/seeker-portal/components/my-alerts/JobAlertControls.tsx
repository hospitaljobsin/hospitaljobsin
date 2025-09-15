'use client';

import type { JobAlertControlsDeleteMutation as JobAlertControlsDeleteMutationType } from '@/__generated__/JobAlertControlsDeleteMutation.graphql';
import type { JobAlertControlsFragment$key } from '@/__generated__/JobAlertControlsFragment.graphql';
import { addToast, Button, useDisclosure } from '@heroui/react';
import { EditIcon, TrashIcon } from 'lucide-react';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import DeleteJobAlertConfirmationModal from './DeleteJobAlertConfirmationModal';
import EditJobAlertModal from './EditJobAlertModal';

const JobAlertControlsFragment = graphql`
  fragment JobAlertControlsFragment on JobAlert {
    id
    filters {
      searchTerm
      jobType
      workMode
      location
      minExperience
      maxExperience
      minSalary
      maxSalary
    }
    frequency
    ...DeleteJobAlertConfirmationModalFragment
    ...EditJobAlertModalFragment
  }
`;

// Delete job alert mutation
const DeleteJobAlertMutation = graphql`
  mutation JobAlertControlsDeleteMutation($jobAlertId: ID!) {
    deleteJobAlert(jobAlertId: $jobAlertId) {
      __typename
      ... on JobAlert {
        id
      }
      ... on JobAlertNotFoundError {
        message
      }
    }
  }
`;

interface JobAlertControlsProps {
	jobAlert: JobAlertControlsFragment$key;
}

export default function JobAlertControls({ jobAlert }: JobAlertControlsProps) {
	const data = useFragment(JobAlertControlsFragment, jobAlert);
	const [deleteJobAlert, isDeletingJobAlert] = useMutation<JobAlertControlsDeleteMutationType>(DeleteJobAlertMutation);

	// Modal controls for delete confirmation
	const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();

	// Modal controls for edit form
	const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onOpenChange: onEditModalOpenChange } = useDisclosure();

	// Handle delete job alert
	const handleDeleteJobAlert = (jobAlertId: string) => {
		deleteJobAlert({
			variables: {
				jobAlertId
			},
			onCompleted: response => {
				if (response.deleteJobAlert.__typename === 'JobAlert') {
					addToast({
						title: 'Success!',
						description: 'Job alert deleted successfully',
						color: 'success'
					});
					// Close the modal
					onDeleteModalOpenChange();
				} else if (response.deleteJobAlert.__typename === 'JobAlertNotFoundError') {
					addToast({
						title: 'Error',
						description: response.deleteJobAlert.message,
						color: 'danger'
					});
				}
			},
			onError: error => {
				addToast({
					title: 'Error',
					description: 'Failed to delete job alert. Please try again.',
					color: 'danger'
				});
				console.error('Error deleting job alert:', error);
			}
		});
	};

	return (
		<div className='flex gap-4 items-center'>
			<Button variant='light' isIconOnly size='md' onPress={onEditModalOpen}>
				<EditIcon size={20} className='text-foreground-600' />
			</Button>
			<Button variant='light' size='sm' isIconOnly onPress={onDeleteModalOpen} isLoading={isDeletingJobAlert}>
				<TrashIcon size={20} className='text-foreground-600' />
			</Button>

			{/* Modals */}
			<DeleteJobAlertConfirmationModal
				isOpen={isDeleteModalOpen}
				onOpenChange={onDeleteModalOpenChange}
				jobAlert={data}
				onDelete={handleDeleteJobAlert}
				isDeleting={isDeletingJobAlert}
			/>

			<EditJobAlertModal isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange} jobAlert={data} />
		</div>
	);
}

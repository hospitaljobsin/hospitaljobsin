import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import type { JobApplyFormFragment$key } from '@/__generated__/JobApplyFormFragment.graphql';
import { useJobApplication } from './hooks/useJobApplication';

const JobApplyFormFragment = graphql`
  fragment JobApplyFormFragment on Job {
    id
    slug
    title
    applicationForm {
      fields {
        fieldName
        defaultValue
        isRequired
      }
    }
    organization @required(action: THROW) {
      name
      logoUrl
	  slug
    }
  }
`;

export interface JobApplyFormRef {
	triggerDirectApply: () => void;
}

const JobApplyForm = forwardRef<
	JobApplyFormRef,
	{
		rootQuery: JobApplyFormFragment$key;
		isProfileComplete: boolean;
		onProfileIncomplete: () => void;
	}
>(function JobApplyForm({ rootQuery, isProfileComplete, onProfileIncomplete }, ref) {
	const data = useFragment(JobApplyFormFragment, rootQuery);
	const { applyForJob, isLoading } = useJobApplication();

	const [showDirectApplyModal, setShowDirectApplyModal] = useState(false);

	function handleDirectApply() {
		if (!isProfileComplete || (data.applicationForm?.fields || []).length > 0) {
			onProfileIncomplete();
			return;
		}
		setShowDirectApplyModal(true);
	}

	function onDirectApplyConfirmed() {
		applyForJob(data.id).then(() => {
			setShowDirectApplyModal(false);
		});
	}

	useImperativeHandle(
		ref,
		() => ({
			triggerDirectApply: () => {
				if (isProfileComplete) {
					applyForJob(data.id);
				}
			}
		}),
		[isProfileComplete]
	);

	return (
		<div className='w-full flex flex-col gap-6'>
			<div className='flex flex-col gap-4'>
				<Button type='button' color='primary' fullWidth size='lg' isDisabled={isLoading} onPress={handleDirectApply}>
					Submit Application
				</Button>
			</div>

			<Modal isOpen={showDirectApplyModal} onClose={() => setShowDirectApplyModal(false)} size='md'>
				<ModalContent className='p-6'>
					<ModalHeader>Confirm Submission</ModalHeader>
					<ModalBody>
						<p>Are you sure you want to submit your job application? You won't be able to undo this.</p>
					</ModalBody>
					<ModalFooter className='flex gap-4 items-center w-full flex-row'>
						<Button variant='flat' onPress={() => setShowDirectApplyModal(false)} fullWidth>
							Cancel
						</Button>
						<Button color='primary' isLoading={isLoading} onPress={onDirectApplyConfirmed} fullWidth>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
});

export default JobApplyForm;

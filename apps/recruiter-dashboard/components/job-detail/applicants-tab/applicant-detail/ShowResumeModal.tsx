'use client';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { graphql, useFragment } from 'react-relay';
import type { ShowResumeModalFragment$key } from '@/__generated__/ShowResumeModalFragment.graphql';

const ShowResumeModalFragment = graphql`
  fragment ShowResumeModalFragment on JobApplicant {
    profileSnapshot {
      resumeUrl
    }
  }
`;

interface ShowResumeModalProps {
	isOpen: boolean;
	onClose: () => void;
	rootQuery: ShowResumeModalFragment$key;
}

export default function ShowResumeModal({ isOpen, onClose, rootQuery }: ShowResumeModalProps) {
	const data = useFragment(ShowResumeModalFragment, rootQuery);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='5xl' scrollBehavior='inside'>
			<ModalContent>
				<ModalHeader>View Resume</ModalHeader>
				<ModalBody className='p-0'>
					{data.profileSnapshot.resumeUrl && (
						<iframe src={`${data.profileSnapshot.resumeUrl}#zoom=FitH`} className='w-full h-[80vh]' title='Resume' />
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

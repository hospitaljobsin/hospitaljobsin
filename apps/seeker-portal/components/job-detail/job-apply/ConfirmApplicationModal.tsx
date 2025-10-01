import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import links from '@/lib/links';

interface ConfirmApplicationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
}

export default function ConfirmApplicationModal({ isOpen, onClose, onConfirm, isLoading }: ConfirmApplicationModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size='md' isDismissable={!isLoading} isKeyboardDismissDisabled={isLoading}>
			<ModalContent>
				<ModalHeader>Confirm Application</ModalHeader>
				<ModalBody>
					<p className='text-sm text-foreground-600'>Review your application before submitting.</p>
					<p className='text-sm text-foreground-700 w-full'>
						Improve your chances by{' '}
						<Link
							href={links.resumeBuilder}
							target='_blank'
							rel='noopener noreferrer'
							className='inline-flex items-center gap-2 min-w-min text-primary'
						>
							updating your resume. <ExternalLinkIcon size={14} />
						</Link>
					</p>
				</ModalBody>
				<ModalFooter className='flex gap-4'>
					<Button variant='flat' onPress={onClose} fullWidth>
						Cancel
					</Button>
					<Button color='primary' isLoading={isLoading} onPress={onConfirm} fullWidth>
						Confirm
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

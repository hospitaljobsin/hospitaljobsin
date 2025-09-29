'use client';

import { Button } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useUnsavedChanges } from './UnsavedChangesContext';

interface UnsavedChangesPopoverProps {
	children: React.ReactNode;
}

export const UnsavedChangesPopover: React.FC<UnsavedChangesPopoverProps> = ({ children }) => {
	const { hasUnsavedChanges, onSave, onCancel, setHasUnsavedChanges } = useUnsavedChanges();

	const handleSave = () => {
		onSave?.();
	};

	const handleCancel = () => {
		onCancel?.();
		setHasUnsavedChanges(false);
	};

	return (
		<>
			{children}
			<AnimatePresence>
				{hasUnsavedChanges && (
					<motion.div
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className='fixed bottom-0 left-1/2 -translate-x-1/2 z-50 bg-background border border-divider rounded-t-lg shadow-lg p-4 max-w-7xl w-full ml-4'
					>
						<div className='flex flex-col gap-3'>
							<p className='font-medium text-warning'>Caution - You have unsaved changes</p>
							<div className='flex gap-2'>
								<Button size='sm' variant='light' onPress={handleCancel}>
									Cancel Changes
								</Button>
								<Button size='sm' color='primary' onPress={handleSave}>
									Save Changes
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

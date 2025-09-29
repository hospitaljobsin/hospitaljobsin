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
						className='fixed bottom-0 left-1/2 -translate-x-1/2 z-50 bg-background border border-divider rounded-t-lg shadow-lg py-6 px-8 max-w-7xl w-full md:ml-4'
					>
						<div className='flex flex-col gap-6'>
							<p className='font-normal'>Caution - You have unsaved changes</p>
							<div className='flex gap-4'>
								<Button size='md' variant='flat' onPress={handleCancel}>
									Cancel Changes
								</Button>
								<Button size='md' color='primary' onPress={handleSave}>
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

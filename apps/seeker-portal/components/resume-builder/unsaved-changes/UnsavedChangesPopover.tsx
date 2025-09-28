'use client';

import React from 'react';
import { Button } from '@heroui/react';
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
			{hasUnsavedChanges && (
				<div className='fixed bottom-4 left-4 z-50 bg-background border border-divider rounded-lg shadow-lg p-4'>
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
				</div>
			)}
		</>
	);
};

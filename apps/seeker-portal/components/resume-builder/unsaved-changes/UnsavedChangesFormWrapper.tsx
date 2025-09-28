'use client';

import React from 'react';
import { UnsavedChangesPopover } from './UnsavedChangesPopover';
import { useUnsavedChangesForm } from './useUnsavedChangesForm';

interface UnsavedChangesFormWrapperProps {
	children: React.ReactNode;
	isDirty: boolean;
	onSave: () => void;
	onCancel: () => void;
}

export const UnsavedChangesFormWrapper: React.FC<UnsavedChangesFormWrapperProps> = ({ children, isDirty, onSave, onCancel }) => {
	useUnsavedChangesForm(isDirty, onSave, onCancel);

	return <UnsavedChangesPopover>{children}</UnsavedChangesPopover>;
};

'use client';

import React from 'react';
import { UnsavedChangesPopover } from './UnsavedChangesPopover';
import { useUnsavedChangesForm } from './useUnsavedChangesForm';

interface UnsavedChangesFormWrapperProps {
	children: React.ReactNode;
	isDirty: boolean;
	isValid: boolean;
	onSave: () => void;
	onCancel: () => void;
	isLoading: boolean;
}

export const UnsavedChangesFormWrapper: React.FC<UnsavedChangesFormWrapperProps> = ({
	children,
	isDirty,
	isValid,
	onSave,
	onCancel,
	isLoading
}) => {
	useUnsavedChangesForm(isDirty, isValid, isLoading, onSave, onCancel);

	return <UnsavedChangesPopover>{children}</UnsavedChangesPopover>;
};

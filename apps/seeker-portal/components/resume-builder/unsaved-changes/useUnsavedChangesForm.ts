import { useEffect } from 'react';
import { useUnsavedChanges } from './UnsavedChangesContext';

export const useUnsavedChangesForm = (isDirty: boolean, isValid: boolean, onSave: () => void, onCancel: () => void) => {
	const { setHasUnsavedChanges, setCallbacks } = useUnsavedChanges();

	const markAsChanged = () => {
		setHasUnsavedChanges(true);
	};

	useEffect(() => {
		setHasUnsavedChanges(isDirty);
	}, [isDirty, setHasUnsavedChanges]);

	useEffect(() => {
		setCallbacks(onSave, onCancel);
	}, [onSave, onCancel, setCallbacks]);

	return { markAsChanged };
};

import { useEffect } from 'react';
import { useUnsavedChanges } from './UnsavedChangesContext';

export const useUnsavedChangesForm = (isDirty: boolean, onSave: () => void, onCancel: () => void) => {
	const { setHasUnsavedChanges, setCallbacks } = useUnsavedChanges();

	useEffect(() => {
		setHasUnsavedChanges(isDirty);
	}, [isDirty, setHasUnsavedChanges]);

	useEffect(() => {
		setCallbacks(onSave, onCancel);
	}, [onSave, onCancel, setCallbacks]);
};

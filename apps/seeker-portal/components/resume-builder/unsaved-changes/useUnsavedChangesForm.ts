import { useEffect } from 'react';
import { useUnsavedChanges } from './UnsavedChangesContext';

export const useUnsavedChangesForm = (isDirty: boolean, isValid: boolean, onSave: () => void, onCancel: () => void) => {
	const { setHasUnsavedChanges, setCallbacks } = useUnsavedChanges();

	useEffect(() => {
		setHasUnsavedChanges(isDirty);
	}, [isDirty, setHasUnsavedChanges]);

	useEffect(() => {
		const handleSave = async () => {
			await onSave();
			if (isValid) {
				setHasUnsavedChanges(false);
			}
		};
		setCallbacks(handleSave, onCancel);
	}, [onSave, onCancel, setCallbacks, setHasUnsavedChanges, isValid]);
};

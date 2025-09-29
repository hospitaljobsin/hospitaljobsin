import { useNavigationGuard } from '@/lib/hooks/useNavigationGuard';
import { useEffect } from 'react';
import { useUnsavedChanges } from './UnsavedChangesContext';

export const useUnsavedChangesForm = (isDirty: boolean, isValid: boolean, onSave: () => void, onCancel: () => void) => {
	const { setHasUnsavedChanges, setCallbacks } = useUnsavedChanges();

	useNavigationGuard({
		enabled: isDirty,
		confirm: () => {
			return confirm('You have unsaved changes. Are you sure you want to leave?');
		}
	});

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

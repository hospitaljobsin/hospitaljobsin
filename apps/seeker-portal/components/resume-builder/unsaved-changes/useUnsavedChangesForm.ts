import { useNavigationGuard } from '@/lib/hooks/useNavigationGuard';
import { useEffect } from 'react';
import { useUnsavedChanges } from './UnsavedChangesContext';

export const useUnsavedChangesForm = (isDirty: boolean, isValid: boolean, isLoading: boolean, onSave: () => void, onCancel: () => void) => {
	const { setHasUnsavedChanges, setCallbacks, setIsLoading } = useUnsavedChanges();

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
		setIsLoading(isLoading);
	}, [isLoading, setIsLoading]);

	useEffect(() => {
		setCallbacks(onSave, onCancel);
	}, [onSave, onCancel, setCallbacks]);

	return { markAsChanged };
};

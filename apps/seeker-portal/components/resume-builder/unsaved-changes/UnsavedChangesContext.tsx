'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UnsavedChangesContextType {
	hasUnsavedChanges: boolean;
	setHasUnsavedChanges: (value: boolean) => void;
	onSave?: () => void;
	onCancel?: () => void;
	setCallbacks: (onSave: () => void, onCancel: () => void) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const UnsavedChangesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [onSave, setOnSave] = useState<(() => void) | undefined>();
	const [onCancel, setOnCancel] = useState<(() => void) | undefined>();

	const setCallbacks = (saveCallback: () => void, cancelCallback: () => void) => {
		setOnSave(() => saveCallback);
		setOnCancel(() => cancelCallback);
	};

	return (
		<UnsavedChangesContext.Provider
			value={{
				hasUnsavedChanges,
				setHasUnsavedChanges,
				onSave,
				onCancel,
				setCallbacks
			}}
		>
			{children}
		</UnsavedChangesContext.Provider>
	);
};

export const useUnsavedChanges = () => {
	const context = useContext(UnsavedChangesContext);
	if (!context) {
		throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider');
	}
	return context;
};

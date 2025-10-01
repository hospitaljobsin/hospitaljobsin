'use client';

import React from 'react';
import { MobileSidebar } from './MobileSidebar';
import { UnsavedChangesProvider } from './unsaved-changes/UnsavedChangesContext';

interface MobileResumeBuilderLayoutProps {
	children: React.ReactNode;
}

export const MobileResumeBuilderLayout: React.FC<MobileResumeBuilderLayoutProps> = ({ children }) => {
	return (
		<UnsavedChangesProvider>
			<div className='flex flex-col h-full w-full'>
				{/* Navigation */}
				<MobileSidebar />
				<div className='p-4'>{children}</div>
			</div>
		</UnsavedChangesProvider>
	);
};

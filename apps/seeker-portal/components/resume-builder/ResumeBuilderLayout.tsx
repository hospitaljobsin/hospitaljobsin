'use client';
import type { FC } from 'react';
import { Sidebar } from './Sidebar';
import { UnsavedChangesProvider } from './unsaved-changes/UnsavedChangesContext';

interface ResumeBuilderLayoutProps {
	children: React.ReactNode;
}

export const ResumeBuilderLayout: FC<ResumeBuilderLayoutProps> = ({ children }) => {
	return (
		<UnsavedChangesProvider>
			<div className='w-full h-full bg-background-600 flex-1'>
				<main className='flex flex-col lg:flex-row gap-4 lg:gap-8 w-full'>
					<Sidebar />
					<div className='flex-1 w-full pb-32'>{children}</div>
				</main>
			</div>
		</UnsavedChangesProvider>
	);
};

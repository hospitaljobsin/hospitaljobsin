'use client';
import React from 'react';
import { Sidebar } from './Sidebar';
import { UnsavedChangesProvider } from './unsaved-changes/UnsavedChangesContext';

interface ResumeBuilderLayoutProps {
	children: React.ReactNode;
}

export const ResumeBuilderLayout: React.FC<ResumeBuilderLayoutProps> = ({ children }) => {
	return (
		<UnsavedChangesProvider>
			<div className='w-full h-full bg-background-600'>
				<div className='w-full max-w-7xl mx-auto bg-background-600 flex flex-col flex-1 h-full'>
					<main className='flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 py-4 lg:py-8 px-4'>
						<div className='lg:col-span-3 order-1'>
							<Sidebar />
						</div>
						<div className='lg:col-span-6 flex flex-col gap-10 order-2 pb-32'>{children}</div>
					</main>
				</div>
			</div>
		</UnsavedChangesProvider>
	);
};

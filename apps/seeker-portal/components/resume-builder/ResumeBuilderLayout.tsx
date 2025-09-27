'use client';
import React from 'react';
import { ProgressBar } from './ProgressBar';
import { ResumePreview } from './ResumePreview';
import { Sidebar } from './Sidebar';

interface ResumeBuilderLayoutProps {
	children: React.ReactNode;
}

export const ResumeBuilderLayout: React.FC<ResumeBuilderLayoutProps> = ({ children }) => {
	return (
		<div className='w-full max-w-7xl mx-auto bg-background-600 flex flex-col flex-1 h-full'>
			<main className='flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 py-4 lg:py-8 px-4'>
				<div className='lg:col-span-3 order-1'>
					<Sidebar />
				</div>
				<div className='lg:col-span-6 flex flex-col gap-6 order-2'>
					{children}
					<div className='flex flex-col gap-4'>
						<ProgressBar label='Resume Progress' percentage={60} />
						<div className='flex justify-end pt-4'>
							<button className='flex items-center justify-center rounded-lg bg-primary px-4 sm:px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 w-full sm:w-auto'>
								Save
							</button>
						</div>
					</div>
				</div>
				<div className='lg:col-span-3 order-3'>
					<ResumePreview />
				</div>
			</main>
		</div>
	);
};

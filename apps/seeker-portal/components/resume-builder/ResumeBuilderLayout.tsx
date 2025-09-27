import React from 'react';
import { Sidebar } from './Sidebar';
import { ResumePreview } from './ResumePreview';
import { ProgressBar } from './ProgressBar';

interface ResumeBuilderLayoutProps {
	children: React.ReactNode;
}

export const ResumeBuilderLayout: React.FC<ResumeBuilderLayoutProps> = ({ children }) => {
	return (
		<div className='w-full max-w-7xl mx-auto bg-background-600 flex flex-col flex-1 h-full'>
			<main className='grid flex-1 grid-cols-12 gap-8 p-8'>
				<div className='col-span-3'>
					<Sidebar />
				</div>
				<div className='col-span-6 flex flex-col gap-6'>
					{children}
					<div className='flex flex-col gap-4'>
						<ProgressBar label='Resume Progress' percentage={60} />
						<div className='flex justify-end pt-4'>
							<button className='flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:opacity-90'>
								Save
							</button>
						</div>
					</div>
				</div>
				<div className='col-span-3'>
					<ResumePreview />
				</div>
			</main>
		</div>
	);
};

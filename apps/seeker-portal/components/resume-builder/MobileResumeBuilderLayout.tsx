'use client';

import React, { useState } from 'react';
import { MobileSidebar } from './MobileSidebar';
import { ProgressBar } from './ProgressBar';

interface MobileResumeBuilderLayoutProps {
	children: React.ReactNode;
}

export const MobileResumeBuilderLayout: React.FC<MobileResumeBuilderLayoutProps> = ({ children }) => {
	const [showPreview, setShowPreview] = useState(false);

	return (
		<div className='flex flex-col h-screen bg-background-light dark:bg-background-dark'>
			{/* Fixed Header */}
			<div className='bg-white dark:bg-background-dark border-b border-primary/20 p-4'>
				<div className='flex items-center justify-between mb-4'>
					<h1 className='text-xl font-bold'>Resume Builder</h1>
					<button onClick={() => setShowPreview(!showPreview)} className='px-3 py-1.5 text-sm bg-primary/20 text-primary rounded-lg'>
						{showPreview ? 'Edit' : 'Preview'}
					</button>
				</div>
				<ProgressBar label='Progress' percentage={60} />
			</div>

			{/* Navigation */}
			{!showPreview && (
				<div className='border-b border-primary/20 bg-white dark:bg-background-dark'>
					<MobileSidebar />
				</div>
			)}

			{/* Content Area */}
			<div className='flex-1 overflow-y-auto'>
				{showPreview ? (
					<div className='p-4'>
						<div
							className='aspect-[8.5/11] w-full rounded-lg bg-cover bg-center bg-no-repeat ring-1 ring-inset ring-primary/10'
							style={{
								backgroundImage:
									'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAl3Kb7yt6Y9ln1aKML2Y3qP0WFm8pktfLSHLMSlX69nu2jR2YQDqT0Os0wKe_OkW7pr8chtRPc6hvMdXAcSgHIaxa4nRtjFxxKdIUgV1noUo9lQA0bQnZ8afrjldP4nvrnzs2KK2zieEFBF44w_G7hFqzwKevj94vUu0CsoVLCftviETy7zvPvEd8c6DztYbmMigrgPtKEYTvDtwowt_0hr_F_-DKVGhhzhHIFuELsb5_TTXEuNE6lATOqTR0zpjMCc6UjrZPgZNs")'
							}}
						/>
						<div className='mt-4'>
							<p className='font-semibold'>ATS-Friendly Template</p>
							<p className='text-sm text-gray-600'>Optimized for applicant tracking systems.</p>
						</div>
					</div>
				) : (
					<div className='p-4'>{children}</div>
				)}
			</div>

			{/* Fixed Bottom Save Button */}
			<div className='p-4 bg-white dark:bg-background-dark border-t border-primary/20'>
				<button className='w-full bg-primary text-white py-3 rounded-lg font-semibold'>Save Changes</button>
			</div>
		</div>
	);
};

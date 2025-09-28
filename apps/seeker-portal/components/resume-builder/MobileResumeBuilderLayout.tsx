'use client';

import { Tab, Tabs } from '@heroui/react';
import React, { useState } from 'react';
import { MobileSidebar } from './MobileSidebar';

interface MobileResumeBuilderLayoutProps {
	children: React.ReactNode;
}

export const MobileResumeBuilderLayout: React.FC<MobileResumeBuilderLayoutProps> = ({ children }) => {
	const [showPreview, setShowPreview] = useState(false);

	return (
		<div className='flex flex-col h-screen bg-background-light dark:bg-background-dark'>
			{/* Fixed Header */}
			<div className='w-full pb-6 px-4'>
				<Tabs
					selectedKey={showPreview ? 'preview' : 'edit'}
					onSelectionChange={key => setShowPreview(key === 'preview')}
					fullWidth
					classNames={{
						cursor: 'shadow-none'
					}}
				>
					<Tab key='edit' title='Edit' />
					<Tab key='preview' title='Preview' />
				</Tabs>
			</div>

			{/* Navigation */}
			{!showPreview && <MobileSidebar />}

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
		</div>
	);
};

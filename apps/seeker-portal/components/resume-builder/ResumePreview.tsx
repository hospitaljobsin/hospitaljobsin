'use client';
import React from 'react';

export const ResumePreview: React.FC = () => {
	return (
		<div className='lg:sticky lg:top-24 h-fit rounded-xl bg-background-light shadow-lg shadow-primary/5 ring-1 ring-inset ring-primary/10 dark:bg-background-dark dark:shadow-primary/10 dark:ring-primary/20'>
			<div className='flex flex-col gap-4 p-4 lg:p-6'>
				<h2 className='text-lg lg:text-xl font-bold'>Resume Preview</h2>
				<div
					className='aspect-[8.5/11] w-full rounded-lg bg-cover bg-center bg-no-repeat ring-1 ring-inset ring-primary/10'
					style={{
						backgroundImage:
							'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAl3Kb7yt6Y9ln1aKML2Y3qP0WFm8pktfLSHLMSlX69nu2jR2YQDqT0Os0wKe_OkW7pr8chtRPc6hvMdXAcSgHIaxa4nRtjFxxKdIUgV1noUo9lQA0bQnZ8afrjldP4nvrnzs2KK2zieEFBF44w_G7hFqzwKevj94vUu0CsoVLCftviETy7zvPvEd8c6DztYbmMigrgPtKEYTvDtwowt_0hr_F_-DKVGhhzhHIFuELsb5_TTXEuNE6lATOqTR0zpjMCc6UjrZPgZNs")'
					}}
				/>
				<div className='flex flex-col gap-1'>
					<p className='font-semibold'>ATS-Friendly Template</p>
					<p className='text-sm text-background-dark/60 dark:text-background-light/60'>
						This template is optimized for applicant tracking systems.
					</p>
				</div>
			</div>
		</div>
	);
};

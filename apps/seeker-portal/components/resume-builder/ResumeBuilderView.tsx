import React from 'react';
import { ResumePreview } from './ResumePreview';
import { Sidebar } from './Sidebar';
import { WorkExperienceForm } from './WorkExperienceForm';

export const ResumeBuilderView: React.FC = () => {
	return (
		<div className='w-full max-w-7xl mx-auto bg-background-600 flex flex-col flex-1 h-full'>
			<main className='grid flex-1 grid-cols-12 gap-8 p-8'>
				<div className='col-span-3'>
					<Sidebar />
				</div>
				<div className='col-span-6 flex flex-col gap-6'>
					<WorkExperienceForm />
				</div>
				<div className='col-span-3'>
					<ResumePreview />
				</div>
			</main>
		</div>
	);
};

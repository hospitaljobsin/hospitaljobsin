import React from 'react';
import { FormField } from './FormField';

export const WorkExperienceView: React.FC = () => {
	return (
		<>
			<h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Work Experience</h1>
			<div className='grid grid-cols-1 gap-6'>
				<FormField id='company' label='Company' placeholder='e.g. Tech Solutions Inc.' />
				<FormField id='title' label='Title' placeholder='e.g. Software Engineer' />
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<FormField id='start-date' label='Start Date' placeholder='e.g. Jan 2022' />
					<FormField id='end-date' label='End Date' placeholder='e.g. Dec 2023' />
				</div>
				<FormField id='location' label='Location' placeholder='e.g. San Francisco, CA' />
				<FormField
					id='description'
					label='Description'
					placeholder='e.g. Developed and maintained web applications using React and Node.js.'
					isTextarea
				/>
				<div className='flex justify-end'>
					<button className='flex items-center justify-center rounded-lg bg-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 w-full sm:w-auto'>
						AI Suggest
					</button>
				</div>
			</div>
		</>
	);
};

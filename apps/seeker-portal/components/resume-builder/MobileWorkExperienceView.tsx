import React from 'react';
import { FormField } from './FormField';

export const MobileWorkExperienceView: React.FC = () => {
	return (
		<div className='space-y-6'>
			<h2 className='text-xl font-bold'>Work Experience</h2>

			<div className='space-y-4'>
				<FormField id='company' label='Company' placeholder='e.g. Tech Solutions Inc.' />
				<FormField id='title' label='Job Title' placeholder='e.g. Software Engineer' />

				<div className='grid grid-cols-2 gap-3'>
					<FormField id='start-date' label='Start' placeholder='Jan 2022' />
					<FormField id='end-date' label='End' placeholder='Dec 2023' />
				</div>

				<FormField id='location' label='Location' placeholder='San Francisco, CA' />
				<FormField id='description' label='Description' placeholder='Describe your key responsibilities and achievements...' isTextarea />

				<button className='w-full bg-primary/20 text-primary py-2.5 rounded-lg font-medium'>AI Suggest Content</button>
			</div>
		</div>
	);
};

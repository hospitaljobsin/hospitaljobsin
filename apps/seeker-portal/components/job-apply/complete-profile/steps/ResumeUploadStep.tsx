'use client';

import { Button } from '@heroui/react';
import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import CompleteProfileContext from '../CompleteProfileContext';

export default function ResumeUploadStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const [isUploading, setIsUploading] = useState(false);

	const handleFileUpload = useCallback(
		async (file: File) => {
			setIsUploading(true);
			try {
				// Mock upload - replace with actual upload logic
				console.log('Uploading resume:', file.name);

				// Simulate upload delay
				await new Promise(resolve => setTimeout(resolve, 2000));

				const mockResumeUrl = `https://example.com/resumes/${file.name}`;

				send({
					type: 'SUBMIT_RESUME',
					resumeUrl: mockResumeUrl
				});
			} catch (error) {
				console.error('Upload failed:', error);
			} finally {
				setIsUploading(false);
			}
		},
		[send]
	);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			handleFileUpload(file);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Upload Your Resume</h3>
				<p className='text-sm text-foreground-600'>
					Upload your resume to help us fill out your profile automatically and improve your job matches.
				</p>
			</div>

			<div className='border-2 border-dashed border-foreground-200 rounded-lg p-8 text-center'>
				<Upload className='w-12 h-12 text-foreground-400 mx-auto mb-4' />
				<div className='space-y-2'>
					<p className='text-foreground-600'>Drop your resume here or click to browse</p>
					<p className='text-sm text-foreground-500'>Supports PDF, DOC, DOCX files up to 10MB</p>
				</div>
				<input
					type='file'
					accept='.pdf,.doc,.docx'
					onChange={handleFileSelect}
					className='hidden'
					id='resume-upload'
					disabled={isUploading}
				/>
				<label htmlFor='resume-upload'>
					<Button as='span' color='primary' className='mt-4 cursor-pointer' isLoading={isUploading} isDisabled={isUploading}>
						{isUploading ? 'Uploading...' : 'Choose File'}
					</Button>
				</label>
			</div>
		</div>
	);
}

'use client';

import { Button } from '@heroui/react';
import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { graphql, useMutation } from 'react-relay';
import type { ResumeUploadStepGeneratePresignedUrlMutation } from '@/__generated__/ResumeUploadStepGeneratePresignedUrlMutation.graphql';
import type { ResumeUploadStepUpdateResumeMutation } from '@/__generated__/ResumeUploadStepUpdateResumeMutation.graphql';
import { uploadFileToS3 } from '../../../../lib/presignedUrl';
import CompleteProfileContext from '../CompleteProfileContext';

const GeneratePresignedUrlMutation = graphql`
mutation ResumeUploadStepGeneratePresignedUrlMutation($contentType: String!) {
	generateProfileDocumentPresignedUrl(contentType: $contentType) {
		fileKey
		presignedUrl
	}
}
`;

const UpdateResumeMutation = graphql`
mutation ResumeUploadStepUpdateResumeMutation($resumeUrl: String!, $fileKey: String!) {
	updateProfileResume(resumeUrl: $resumeUrl, fileKey: $fileKey) {
		...on Account {
			...CompleteProfileDrawerFragment
			profile {
				resumeUrl
			}
		}
	}
}
`;

export default function ResumeUploadStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const [isUploading, setIsUploading] = useState(false);
	const [commitPresignedUrlMutation] = useMutation<ResumeUploadStepGeneratePresignedUrlMutation>(GeneratePresignedUrlMutation);
	const [commitUpdateMutation] = useMutation<ResumeUploadStepUpdateResumeMutation>(UpdateResumeMutation);

	const handleFileUpload = useCallback(
		(file: File) => {
			setIsUploading(true);

			commitPresignedUrlMutation({
				variables: { contentType: file.type },
				onCompleted: response => {
					const { presignedUrl, fileKey } = response.generateProfileDocumentPresignedUrl;

					uploadFileToS3(presignedUrl, file)
						.then(() => {
							const resumeUrl = presignedUrl.split('?')[0];

							commitUpdateMutation({
								variables: { resumeUrl, fileKey },
								onCompleted: () => {
									setIsUploading(false);
									send({
										type: 'SUBMIT_RESUME',
										resumeUrl
									});
								},
								onError: () => setIsUploading(false)
							});
						})
						.catch(() => setIsUploading(false));
				},
				onError: () => setIsUploading(false)
			});
		},
		[commitPresignedUrlMutation, commitUpdateMutation, send]
	);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (file) {
				handleFileUpload(file);
			}
		},
		[handleFileUpload]
	);

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		onDrop,
		accept: {
			'application/pdf': ['.pdf']
		},
		multiple: false,
		noClick: true
	});

	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Upload Your Resume</h3>
				<p className='text-sm text-foreground-600'>
					Upload your resume to help us fill out your profile automatically and improve your job matches.
				</p>
			</div>

			<div
				{...getRootProps()}
				className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors cursor-pointer ${
					isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
				}`}
			>
				<input {...getInputProps()} />
				<div className='space-y-6 flex flex-col justify-center items-center'>
					<Upload size={64} className='text-foreground-400' />
					<p className='text-xl mb-2'>Drop your resume here</p>
					<p className='text-sm text-gray-400'>Supports PDF files</p>
					<Button color='primary' size='lg' variant='solid' onPress={open} isLoading={isUploading} isDisabled={isUploading}>
						{isUploading ? 'Uploading...' : 'Browse Files'}
					</Button>
				</div>
			</div>
		</div>
	);
}

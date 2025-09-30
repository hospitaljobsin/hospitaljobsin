import type { UpdateResumeFormDeleteResumeMutation as DeleteResumeMutationType } from '@/__generated__/UpdateResumeFormDeleteResumeMutation.graphql';
import type { UpdateResumeFormFragment$key } from '@/__generated__/UpdateResumeFormFragment.graphql';
import type { UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation as UpdateResumeFormGenerateProfileDocumentPresignedUrlMutationType } from '@/__generated__/UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation.graphql';
import type { UpdateResumeFormMutation as UpdateResumeFormMutationType } from '@/__generated__/UpdateResumeFormMutation.graphql';
import { Button } from '@heroui/react';
import { UploadCloudIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { graphql, useFragment, useMutation } from 'react-relay';
import { uploadFileToS3 } from '../../../lib/presignedUrl';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';
import RemoveResumeConfirmationModal from './RemoveResumeConfirmationModal';

const UpdateResumeFormMutation = graphql`
mutation UpdateResumeFormMutation($resumeUrl: String!, $fileKey: String!) {
  updateProfileResume(resumeUrl: $resumeUrl, fileKey: $fileKey) {
    ...on Account {
        ...IncompleteProfileBannerFragment
        ...ResumeProgressAccountFragment
      profile {
          ...UpdateResumeFormFragment
      }
    }
  }
}
`;

const DeleteResumeMutation = graphql`
  mutation UpdateResumeFormDeleteResumeMutation {
	removeProfileResume {
	  ...on Account {
		...IncompleteProfileBannerFragment
		...ResumeProgressAccountFragment
		profile {
          ...UpdateResumeFormFragment
      }
	  }
	}
  }
`;

const GenerateProfileDocumentPresignedUrlMutation = graphql`
  mutation UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation($contentType: String!) {
	generateProfileDocumentPresignedUrl(contentType: $contentType) {
	  fileKey
	  presignedUrl
	}
}
	`;

const UpdateResumeFormFragment = graphql`
  fragment UpdateResumeFormFragment on Profile {
	resumeUrl
  }
`;

type Props = {
	rootQuery: UpdateResumeFormFragment$key;
	onSaveChanges: () => void;
};

export default function UpdateResumeForm({ rootQuery, onSaveChanges }: Props) {
	const [commitMutation] = useMutation<UpdateResumeFormMutationType>(UpdateResumeFormMutation);
	const [commitDeleteMutation] = useMutation<DeleteResumeMutationType>(DeleteResumeMutation);
	const [commitPresignedUrlMutation] = useMutation<UpdateResumeFormGenerateProfileDocumentPresignedUrlMutationType>(
		GenerateProfileDocumentPresignedUrlMutation
	);
	const data = useFragment(UpdateResumeFormFragment, rootQuery);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [showRemoveModal, setShowRemoveModal] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		onDrop,
		accept: {
			'application/pdf': ['.pdf']
		},
		multiple: false,
		noClick: true
	});

	const isDirty = selectedFile !== null;

	const handleSave = useCallback(() => {
		if (!selectedFile) return;

		setIsUploading(true);

		commitPresignedUrlMutation({
			variables: { contentType: selectedFile.type },
			onCompleted: response => {
				const { presignedUrl, fileKey } = response.generateProfileDocumentPresignedUrl;

				try {
					uploadFileToS3(presignedUrl, selectedFile).then(() => {
						const resumeUrl = presignedUrl.split('?')[0];

						commitMutation({
							variables: { resumeUrl: resumeUrl, fileKey },
							onCompleted: () => {
								if (previewUrl) URL.revokeObjectURL(previewUrl);
								setSelectedFile(null);
								setPreviewUrl(null);
								setIsUploading(false);
								onSaveChanges();
							},
							onError: () => setIsUploading(false)
						});
					});
				} catch {
					setIsUploading(false);
				}
			},
			onError: () => setIsUploading(false)
		});
	}, [selectedFile, commitPresignedUrlMutation, commitMutation, onSaveChanges, previewUrl]);

	const handleRemoveSelected = useCallback(() => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setSelectedFile(null);
		setPreviewUrl(null);
	}, [previewUrl]);

	const handleRemoveSaved = useCallback(() => {
		setIsRemoving(true);
		commitDeleteMutation({
			variables: {},
			onCompleted() {
				setIsRemoving(false);
				setShowRemoveModal(false);
				onSaveChanges();
			},
			onError: () => setIsRemoving(false)
		});
	}, [commitDeleteMutation, onSaveChanges]);

	// No resume saved and no file selected - show drag and drop
	if (!data.resumeUrl && !selectedFile) {
		return (
			<div className='space-y-6'>
				<div
					{...getRootProps()}
					className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors cursor-pointer ${
						isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
					}`}
				>
					<input {...getInputProps()} />
					<div className='space-y-6 flex flex-col justify-center items-center'>
						<UploadCloudIcon size={64} className='text-foreground-400' />

						<p className='text-xl mb-2'>Drop your resume here</p>
						<p className='text-sm text-gray-400'>Supports PDF files</p>
						<Button color='primary' size='lg' variant='solid' onPress={open}>
							Browse Files
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// File selected but not saved yet - show preview with remove button
	if (selectedFile && previewUrl) {
		return (
			<UnsavedChangesFormWrapper isDirty={isDirty} isValid={true} onSave={handleSave} onCancel={handleRemoveSelected}>
				<div className='space-y-6'>
					<div className='flex items-center justify-between'>
						<h1 className='text-xl text-foreground-500 font-medium'>Your Resume</h1>
						<Button variant='bordered' size='sm' onPress={handleRemoveSelected}>
							Remove Selected File
						</Button>
					</div>
					<div className='border rounded-lg overflow-hidden'>
						<div className='bg-gray-50 px-4 py-3 border-b flex items-center justify-between'>
							<h3 className='font-medium'>Preview</h3>
							<span className='text-sm text-gray-500'>
								{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
							</span>
						</div>
						<div className='h-96 md:h-[600px]'>
							{selectedFile.type === 'application/pdf' ? (
								<iframe src={`${previewUrl}#zoom=page-fit`} className='w-full h-full border-0' title='Resume Preview' />
							) : (
								<div className='flex items-center justify-center h-full text-gray-500'>
									<div className='text-center'>
										<p>Preview not available for this file type</p>
										<p className='text-sm mt-1'>File ready to upload: {selectedFile.name}</p>
									</div>
								</div>
							)}
						</div>
						{isUploading && <div className='p-4 text-center text-gray-500'>Uploading...</div>}
					</div>
				</div>
			</UnsavedChangesFormWrapper>
		);
	}

	// Resume already saved - show remove and upload new buttons
	return (
		<>
			<div className='space-y-6'>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
					<h1 className='text-xl text-foreground-500 font-medium'>Resume</h1>
					<div className='flex gap-3'>
						<Button variant='bordered' size='sm' onPress={() => setShowRemoveModal(true)}>
							Remove Resume
						</Button>
						<Button color='primary' variant='solid' size='sm' onPress={open}>
							Upload New Resume
						</Button>
					</div>
				</div>
				<div className='border rounded-lg overflow-hidden h-[500px] md:h-[800px]'>
					<iframe src={`${data.resumeUrl}#zoom=page-fit`} className='w-full h-full border-0' title='Resume Preview' />
				</div>

				<input {...getInputProps()} />
			</div>

			<RemoveResumeConfirmationModal
				isOpen={showRemoveModal}
				onOpenChange={setShowRemoveModal}
				onConfirm={handleRemoveSaved}
				isRemoving={isRemoving}
			/>
		</>
	);
}

import type { UpdateResumeFormFragment$key } from '@/__generated__/UpdateResumeFormFragment.graphql';
import type { UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation as UpdateResumeFormGenerateProfileDocumentPresignedUrlMutationType } from '@/__generated__/UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation.graphql';
import { FileIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { graphql, useFragment, useMutation } from 'react-relay';
import { uploadFileToS3 } from '../../../lib/presignedUrl';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';
import RemoveResumeConfirmationModal from './RemoveResumeConfirmationModal';

const UpdateResumeFormMutation = graphql`
mutation UpdateResumeFormMutation($resumeUrl: String) {
  updateProfileResume(resumeUrl: $resumeUrl) {
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
	const [commitMutation] = useMutation(UpdateResumeFormMutation);
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

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'application/pdf': ['.pdf'],
			'application/msword': ['.doc'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
		},
		multiple: false
	});

	const handleSave = useCallback(() => {
		if (!selectedFile) return;

		setIsUploading(true);

		commitPresignedUrlMutation({
			variables: { contentType: selectedFile.type },
			onCompleted: response => {
				const { presignedUrl } = response.generateProfileDocumentPresignedUrl;

				try {
					uploadFileToS3(presignedUrl, selectedFile).then(() => {
						const resumeUrl = presignedUrl.split('?')[0];

						commitMutation({
							variables: { resumeUrl: resumeUrl },
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
		commitMutation({
			variables: { resumeUrl: null },
			onCompleted() {
				setIsRemoving(false);
				setShowRemoveModal(false);
				onSaveChanges();
			},
			onError: () => setIsRemoving(false)
		});
	}, [commitMutation, onSaveChanges]);

	// No resume saved and no file selected - show drag and drop
	if (!data.resumeUrl && !selectedFile) {
		return (
			<div className='space-y-6'>
				<h1 className='text-xl text-foreground-500 font-medium'>Upload Resume</h1>
				<div
					{...getRootProps()}
					className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors cursor-pointer ${
						isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
					}`}
				>
					<input {...getInputProps()} />
					<div className='space-y-6 flex flex-col justify-center items-center'>
						<FileIcon className='text-foreground-600' />

						<p className='text-2xl font-medium mb-2'>Drop your resume here</p>
						<p className='text-gray-500 mb-4'>or click to browse files</p>
						<p className='text-sm text-gray-400'>Supports PDF files</p>
						<div className='inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium'>Browse Files</div>
					</div>
				</div>
			</div>
		);
	}

	// File selected but not saved yet - show preview with remove button
	if (selectedFile && previewUrl) {
		return (
			<UnsavedChangesFormWrapper isDirty={true} isValid={true} onSave={handleSave} onCancel={handleRemoveSelected}>
				<div className='space-y-6'>
					<div className='flex items-center justify-between'>
						<h1 className='text-xl text-foreground-500 font-medium'>Upload Resume</h1>
						<button
							type='button'
							className='px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50'
							onClick={handleRemoveSelected}
						>
							Remove Selected File
						</button>
					</div>
					<div className='border rounded-lg overflow-hidden'>
						<div className='bg-gray-50 px-4 py-3 border-b flex items-center justify-between'>
							<h3 className='font-medium'>Preview</h3>
							<span className='text-sm text-gray-500'>
								{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
							</span>
						</div>
						<div className='h-96'>
							{selectedFile.type === 'application/pdf' ? (
								<iframe src={previewUrl} className='w-full h-full' title='Resume Preview' />
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
				<div className='flex items-center justify-between'>
					<h1 className='text-xl text-foreground-500 font-medium'>Resume</h1>
					<div className='flex gap-3'>
						<button
							type='button'
							className='px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50'
							onClick={() => setShowRemoveModal(true)}
						>
							Remove Resume
						</button>
						<div {...getRootProps()} className='px-4 py-2 text-sm bg-primary text-white rounded cursor-pointer hover:bg-primary/90'>
							<input {...getInputProps()} />
							Upload New Resume
						</div>
					</div>
				</div>
				<div className='border rounded-lg overflow-hidden'>
					<div className='bg-gray-50 px-4 py-3 border-b'>
						<h3 className='font-medium'>Resume Preview</h3>
					</div>
					<div className='h-96'>
						<iframe src={data.resumeUrl} className='w-full h-full' title='Resume Preview' />
					</div>
				</div>
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

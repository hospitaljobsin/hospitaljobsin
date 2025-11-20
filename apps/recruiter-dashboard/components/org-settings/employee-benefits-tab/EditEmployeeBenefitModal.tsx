'use client';
import type { EditEmployeeBenefitModalFragment$key } from '@/__generated__/EditEmployeeBenefitModalFragment.graphql';
import type { EditEmployeeBenefitModalMutation as EditEmployeeBenefitModalMutationType } from '@/__generated__/EditEmployeeBenefitModalMutation.graphql';
import type { EditEmployeeBenefitModalPresignedUrlMutation } from '@/__generated__/EditEmployeeBenefitModalPresignedUrlMutation.graphql';
import MarkdownEditor from '@/components/forms/text-editor/MarkdownEditor';
import { uploadFileToS3 } from '@/lib/presignedUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod';

const EditEmployeeBenefitModalFragment = graphql`
  fragment EditEmployeeBenefitModalFragment on EmployeeBenefit {
	id
	title
	description
	posterImageUrl
  }
`;

const EditMutation = graphql`
mutation EditEmployeeBenefitModalMutation($organizationId: ID!, $benefitId: ID!, $title: String, $description: String, $posterImageUrl: String) {
	updateEmployeeBenefit(organizationId: $organizationId, benefitId: $benefitId, title: $title, description: $description, posterImageUrl: $posterImageUrl) {
		__typename
		... on EmployeeBenefit {
			id
			title
			description
			posterImageUrl
		}
	}
}
`;

const PresignedUrlMutation = graphql`
mutation EditEmployeeBenefitModalPresignedUrlMutation($contentType: String!) {
	createEmployeeBenefitPosterPresignedUrl(contentType: $contentType) {
		presignedUrl
	}
}
`;

const formSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().min(1, { message: 'Description is required' })
});

export default function EditEmployeeBenefitModal({
	isOpen,
	onOpenChange,
	onClose,
	benefit: benefitKey,
	organizationId
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
	benefit: EditEmployeeBenefitModalFragment$key;
	organizationId: string;
}) {
	const benefit = useFragment(EditEmployeeBenefitModalFragment, benefitKey);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(benefit.posterImageUrl);
	const [commitEdit, isEditing] = useMutation<EditEmployeeBenefitModalMutationType>(EditMutation);
	const [commitPresignedUrl] = useMutation<EditEmployeeBenefitModalPresignedUrlMutation>(PresignedUrlMutation);

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { title: benefit.title, description: benefit.description }
	});

	useEffect(() => {
		reset({ title: benefit.title, description: benefit.description });
		setPreviewUrl(benefit.posterImageUrl);
	}, [benefit, reset]);

	function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	}

	async function onSubmit(formData: z.infer<typeof formSchema>) {
		let posterImageUrl: string | null | undefined = undefined;

		if (selectedImage) {
			const presignedUrl = await new Promise<string | null>(resolve => {
				commitPresignedUrl({
					variables: { contentType: selectedImage.type },
					onCompleted: response => resolve(response.createEmployeeBenefitPosterPresignedUrl?.presignedUrl || null),
					onError: () => resolve(null)
				});
			});

			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedImage);
				posterImageUrl = presignedUrl.split('?')[0];
			}
		}

		commitEdit({
			variables: {
				organizationId,
				benefitId: benefit.id,
				title: formData.title,
				description: formData.description,
				...(posterImageUrl !== undefined && { posterImageUrl })
			},
			onCompleted: response => {
				if (response.updateEmployeeBenefit.__typename === 'EmployeeBenefit') {
					addToast({ description: 'Benefit updated successfully', color: 'success' });
					setSelectedImage(null);
					onClose();
				}
			}
		});
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
			<ModalContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader>Edit Employee Benefit</ModalHeader>
					<ModalBody className='gap-4'>
						<Controller
							name='title'
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									label='Title'
									placeholder='e.g., Health Insurance'
									errorMessage={errors.title?.message}
									isInvalid={!!errors.title}
								/>
							)}
						/>
						<Controller
							name='description'
							control={control}
							render={({ field }) => (
								<div className='flex flex-col gap-2'>
									<label className='text-sm'>Description</label>
									<MarkdownEditor initialValue={field.value} onValueChange={field.onChange} isInvalid={!!errors.description} />
									{errors.description && <p className='text-tiny text-danger'>{errors.description.message}</p>}
								</div>
							)}
						/>
						<div className='flex flex-col gap-2'>
							<label className='text-sm'>Poster Image</label>
							{previewUrl && <img src={previewUrl} alt='Preview' className='w-full h-48 object-cover rounded-md' />}
							<Button as='label' variant='bordered' startContent={<Upload size={16} />}>
								{selectedImage ? 'Change Image' : 'Upload New Image'}
								<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
							</Button>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant='light' onPress={onClose}>
							Cancel
						</Button>
						<Button color='primary' type='submit' isLoading={isEditing}>
							Update
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}

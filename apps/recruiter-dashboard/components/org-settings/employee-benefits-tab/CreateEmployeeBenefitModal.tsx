'use client';
import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod';
import type { CreateEmployeeBenefitModalMutation as CreateEmployeeBenefitModalMutationType } from '@/__generated__/CreateEmployeeBenefitModalMutation.graphql';
import type { CreateEmployeeBenefitModalPresignedUrlMutation } from '@/__generated__/CreateEmployeeBenefitModalPresignedUrlMutation.graphql';
import type { CreateEmployeeBenefitModalFragment$key } from '@/__generated__/CreateEmployeeBenefitModalFragment.graphql';
import MarkdownEditor from '@/components/forms/text-editor/MarkdownEditor';
import { uploadFileToS3 } from '@/lib/presignedUrl';

const CreateEmployeeBenefitModalFragment = graphql`
	fragment CreateEmployeeBenefitModalFragment on Organization {
		id
	}
`;

const CreateMutation = graphql`
mutation CreateEmployeeBenefitModalMutation($organizationId: ID!, $title: String!, $description: String!, $posterImageUrl: String, $connections: [ID!]!) {
	createEmployeeBenefit(organizationId: $organizationId, title: $title, description: $description, posterImageUrl: $posterImageUrl) {
		__typename
		... on CreateEmployeeBenefitSuccess {
			employeeBenefitEdge @appendEdge(connections: $connections) {
			cursor
			node {
				id
				title
				description
				posterImageUrl
				order
				...EmployeeBenefitCardFragment
			}
		}
		}
	}
}
`;

const PresignedUrlMutation = graphql`
mutation CreateEmployeeBenefitModalPresignedUrlMutation($contentType: String!) {
	createEmployeeBenefitPosterPresignedUrl(contentType: $contentType) {
		presignedUrl
	}
}
`;

const formSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().min(1, { message: 'Description is required' })
});

export default function CreateEmployeeBenefitModal({
	isOpen,
	onOpenChange,
	onClose,
	connectionId,
	organization
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
	connectionId: string;
	organization: CreateEmployeeBenefitModalFragment$key;
}) {
	const data = useFragment(CreateEmployeeBenefitModalFragment, organization);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [commitCreate, isCreating] = useMutation<CreateEmployeeBenefitModalMutationType>(CreateMutation);
	const [commitPresignedUrl] = useMutation<CreateEmployeeBenefitModalPresignedUrlMutation>(PresignedUrlMutation);

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { title: '', description: '' }
	});

	function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	}

	async function onSubmit(formData: z.infer<typeof formSchema>) {
		let posterImageUrl: string | null = null;

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

		commitCreate({
			variables: {
				organizationId: data.id,
				title: formData.title,
				description: formData.description,
				posterImageUrl,
				connections: [connectionId]
			},
			onCompleted: response => {
				if (response.createEmployeeBenefit.__typename === 'CreateEmployeeBenefitSuccess') {
					addToast({ description: 'Benefit created successfully', color: 'success' });
					reset();
					setSelectedImage(null);
					setPreviewUrl(null);
					onClose();
				}
			}
		});
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
			<ModalContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader>Add Employee Benefit</ModalHeader>
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
							<label className='text-sm'>Poster Image (Optional)</label>
							{previewUrl && <img src={previewUrl} alt='Preview' className='w-full h-48 object-cover rounded-md' />}
							<Button as='label' variant='bordered' startContent={<Upload size={16} />}>
								{selectedImage ? 'Change Image' : 'Upload Image'}
								<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
							</Button>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant='light' onPress={onClose}>
							Cancel
						</Button>
						<Button color='primary' type='submit' isLoading={isCreating}>
							Create
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}

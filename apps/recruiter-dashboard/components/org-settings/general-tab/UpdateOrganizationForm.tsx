import {
	addToast,
	Button,
	Card,
	CardBody,
	CardFooter,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tooltip,
	useDisclosure
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon, TrashIcon } from 'lucide-react';
import NextImage from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { Area } from 'react-easy-crop';
import Cropper from 'react-easy-crop';
import { Controller, useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod';
import type { UpdateOrganizationFormBannerPresignedUrlMutation } from '@/__generated__/UpdateOrganizationFormBannerPresignedUrlMutation.graphql';
import type { UpdateOrganizationFormFragment$key } from '@/__generated__/UpdateOrganizationFormFragment.graphql';
import type { UpdateOrganizationFormLogoPresignedUrlMutation } from '@/__generated__/UpdateOrganizationFormLogoPresignedUrlMutation.graphql';
import type { UpdateOrganizationFormMutation as UpdateOrganizationFormMutationType } from '@/__generated__/UpdateOrganizationFormMutation.graphql';
import LocationAutocomplete from '@/components/forms/LocationAutocomplete';
import MarkdownEditor from '@/components/forms/text-editor/MarkdownEditor';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import { uploadFileToS3 } from '@/lib/presignedUrl';
import DeleteOrganizationBannerModal from './DeleteOrganizationBannerModal';
import DeleteOrganizationLogoModal from './DeleteOrganizationLogoModal';

const UpdateOrganizationFormMutation = graphql`
mutation UpdateOrganizationFormMutation($organizationId: ID!, $name: String!, $slug: String!, $location: String, $website: String, $logoUrl: String, $bannerUrl: String, $homePageBannerUrl: String, $socialLinks: SocialLinksInput, $description: String) {
	updateOrganization(organizationId: $organizationId, name: $name, slug: $slug, location: $location, website: $website, logoUrl: $logoUrl, bannerUrl: $bannerUrl, homePageBannerUrl: $homePageBannerUrl, socialLinks: $socialLinks, description: $description) {
		__typename
		... on Organization {
			id
			slug
			name
			website
			description
			logoUrl
			bannerUrl
			homePageBannerUrl
			socialLinks {
				linkedinUrl
				youtubeUrl
				instagramUrl
				facebookUrl
			}
			location
		}
        ... on OrganizationNotFoundError {
            __typename
        }
        ... on OrganizationSlugInUseError {
            __typename
			message
        }

		... on OrganizationAuthorizationError {
			__typename
		}
	}
}
`;

const CreateOrganizationLogoPresignedUrlMutation = graphql`
mutation UpdateOrganizationFormLogoPresignedUrlMutation($contentType: String!) {
	createOrganizationLogoPresignedUrl(contentType: $contentType) {
		presignedUrl
	}
}
`;

const CreateOrganizationBannerPresignedUrlMutation = graphql`
mutation UpdateOrganizationFormBannerPresignedUrlMutation($contentType: String!) {
	createOrganizationBannerPresignedUrl(contentType: $contentType) {
		presignedUrl
	}
}
`;

const CreateOrganizationHomePageBannerPresignedUrlMutation = graphql`
mutation UpdateOrganizationFormHomePageBannerPresignedUrlMutation($contentType: String!) {
	createOrganizationHomePageBannerPresignedUrl(contentType: $contentType) {
		presignedUrl
	}
}
`;

const UpdateOrganizationFormFragment = graphql`
  fragment UpdateOrganizationFormFragment on Organization {
	id
    slug
    name
	website
	logoUrl
	bannerUrl
	homePageBannerUrl
	socialLinks {
		linkedinUrl
		youtubeUrl
		instagramUrl
		facebookUrl
	}
	description
	location
	...DeleteOrganizationLogoModalFragment
	...DeleteOrganizationBannerModalFragment
  }
`;

type Props = {
	rootQuery: UpdateOrganizationFormFragment$key;
};

const formSchema = z.object({
	name: z.string().min(1, { message: 'Organization name is required' }),
	slug: z.string().min(1, { message: 'Slug is required' }),
	website: z.union([z.nullable(z.optional(z.string().url({ message: 'Invalid URL' }))), z.literal('')]),
	description: z.union([
		z.nullable(
			z.optional(
				z.string().max(1024, {
					message: 'Description must be less than 1024 characters'
				})
			)
		),
		z.literal('')
	]),
	location: z.nullable(z.string()),
	linkedinUrl: z.union([
		z.nullable(
			z.optional(
				z
					.string()
					.url()
					.refine(url => url.includes('linkedin.com'), { message: 'Must be a LinkedIn URL' })
			)
		),
		z.literal('')
	]),
	youtubeUrl: z.union([
		z.nullable(
			z.optional(
				z
					.string()
					.url()
					.refine(url => url.includes('youtube.com') || url.includes('youtu.be'), { message: 'Must be a YouTube URL' })
			)
		),
		z.literal('')
	]),
	instagramUrl: z.union([
		z.nullable(
			z.optional(
				z
					.string()
					.url()
					.refine(url => url.includes('instagram.com'), { message: 'Must be an Instagram URL' })
			)
		),
		z.literal('')
	]),
	facebookUrl: z.union([
		z.nullable(
			z.optional(
				z
					.string()
					.url()
					.refine(url => url.includes('facebook.com') || url.includes('fb.com'), { message: 'Must be a Facebook URL' })
			)
		),
		z.literal('')
	])
});

export default function UpdateOrganizationForm({ rootQuery }: Props) {
	const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
	const [selectedHomePageBanner, setSelectedHomePageBanner] = useState<File | null>(null);

	const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
	const [homePageBannerPreviewUrl, setHomePageBannerPreviewUrl] = useState<string | null>(null);
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

	const [showDeleteOrganizationLogoModal, setShowDeleteOrganizationLogoModal] = useState(false);
	const [showDeleteOrganizationBannerModal, setShowDeleteOrganizationBannerModal] = useState(false);

	// Cropper state
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [croppingType, setCroppingType] = useState<'logo' | 'banner' | 'homePageBanner'>('logo');

	const [commitMutation, isMutationInFlight] = useMutation<UpdateOrganizationFormMutationType>(UpdateOrganizationFormMutation);
	const [commitCreateOrganizationLogoPresignedUrlMutation, isCreateOrganizationLogoPresignedUrlMutationInflight] =
		useMutation<UpdateOrganizationFormLogoPresignedUrlMutation>(CreateOrganizationLogoPresignedUrlMutation);
	const [commitCreateOrganizationBannerPresignedUrlMutation, isCreateOrganizationBannerPresignedUrlMutationInflight] =
		useMutation<UpdateOrganizationFormBannerPresignedUrlMutation>(CreateOrganizationBannerPresignedUrlMutation);
	const [commitCreateOrganizationHomePageBannerPresignedUrlMutation, isCreateOrganizationHomePageBannerPresignedUrlMutationInflight] =
		useMutation(CreateOrganizationHomePageBannerPresignedUrlMutation);
	const data = useFragment(UpdateOrganizationFormFragment, rootQuery);

	const {
		handleSubmit,
		control,
		setError,
		getFieldState,
		reset,
		formState: { errors, isSubmitting, isDirty }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: data.name,
			slug: data.slug,
			website: data.website ?? null,
			description: data.description ?? '',
			location: data.location ?? null,
			linkedinUrl: data.socialLinks?.linkedinUrl ?? null,
			youtubeUrl: data.socialLinks?.youtubeUrl ?? null,
			instagramUrl: data.socialLinks?.instagramUrl ?? null,
			facebookUrl: data.socialLinks?.facebookUrl ?? null
		}
	});

	async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedLogo(file);
			const url = URL.createObjectURL(file);
			setTempImageUrl(url);
			setCroppingType('logo');
			onOpen();
		}
		event.target.value = '';
	}

	async function handleBannerChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedBanner(file);
			const url = URL.createObjectURL(file);
			setBannerPreviewUrl(url);
		}
		event.target.value = '';
	}

	async function handleHomePageBannerChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedHomePageBanner(file);
			const url = URL.createObjectURL(file);
			setTempImageUrl(url);
			setCroppingType('homePageBanner');
			onOpen();
		}
		event.target.value = '';
	}

	const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const createCroppedImage = useCallback(async (imageSrc: string, pixelCrop: Area, file: File): Promise<Blob> => {
		const image = new Image();
		image.src = imageSrc;
		return new Promise((resolve, reject) => {
			image.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				if (!ctx) {
					reject(new Error('Failed to get canvas context'));
					return;
				}

				canvas.width = pixelCrop.width;
				canvas.height = pixelCrop.height;

				ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

				canvas.toBlob(
					blob => {
						if (blob) {
							resolve(blob);
						} else {
							reject(new Error('Failed to create blob'));
						}
					},
					file.type,
					0.95
				);
			};
		});
	}, []);

	const handleCropSave = useCallback(async () => {
		if (tempImageUrl && croppedAreaPixels) {
			const file = croppingType === 'logo' ? selectedLogo : croppingType === 'banner' ? selectedBanner : selectedHomePageBanner;
			if (!file) return;

			try {
				const croppedBlob = await createCroppedImage(tempImageUrl, croppedAreaPixels, file);
				const croppedFile = new File([croppedBlob], file.name, { type: file.type });
				const croppedImageUrl = URL.createObjectURL(croppedBlob);
				setCroppedImage(croppedImageUrl);

				if (croppingType === 'logo') {
					setSelectedLogo(croppedFile);
					setPreviewUrl(croppedImageUrl);
				} else if (croppingType === 'banner') {
					setSelectedBanner(croppedFile);
					setBannerPreviewUrl(croppedImageUrl);
				} else if (croppingType === 'homePageBanner') {
					setSelectedHomePageBanner(croppedFile);
					setHomePageBannerPreviewUrl(croppedImageUrl);
				}

				setTempImageUrl(null);
				onClose();
			} catch (error) {
				console.error('Error creating cropped image:', error);
			}
		}
	}, [tempImageUrl, croppedAreaPixels, createCroppedImage, onClose, croppingType, selectedLogo, selectedBanner, selectedHomePageBanner]);

	const handleCropCancel = useCallback(() => {
		if (tempImageUrl) {
			URL.revokeObjectURL(tempImageUrl);
			setTempImageUrl(null);
		}
		if (croppingType === 'logo') {
			setSelectedLogo(null);
		} else if (croppingType === 'banner') {
			setSelectedBanner(null);
		} else if (croppingType === 'homePageBanner') {
			setSelectedHomePageBanner(null);
		}
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
		setCroppingType('logo');
		onClose();
	}, [onClose, croppingType, tempImageUrl]);

	function getPresignedUrl(logo: File): Promise<string | null> {
		return new Promise((resolve, reject) => {
			commitCreateOrganizationLogoPresignedUrlMutation({
				variables: {
					contentType: logo.type
				},
				onCompleted: response => {
					resolve(response.createOrganizationLogoPresignedUrl?.presignedUrl || null);
				},
				onError: error => {
					console.error('Error fetching presigned URL:', error);
					reject(error);
				}
			});
		});
	}

	function getBannerPresignedUrl(banner: File): Promise<string | null> {
		return new Promise((resolve, reject) => {
			commitCreateOrganizationBannerPresignedUrlMutation({
				variables: {
					contentType: banner.type
				},
				onCompleted: response => {
					resolve(response.createOrganizationBannerPresignedUrl?.presignedUrl || null);
				},
				onError: error => {
					console.error('Error fetching banner presigned URL:', error);
					reject(error);
				}
			});
		});
	}

	function getHomePageBannerPresignedUrl(banner: File): Promise<string | null> {
		return new Promise((resolve, reject) => {
			commitCreateOrganizationHomePageBannerPresignedUrlMutation({
				variables: {
					contentType: banner.type
				},
				onCompleted: response => {
					resolve(response.createOrganizationHomePageBannerPresignedUrl?.presignedUrl || null);
				},
				onError: error => {
					console.error('Error fetching homepage banner presigned URL:', error);
					reject(error);
				}
			});
		});
	}

	async function onSubmit(formData: z.infer<typeof formSchema>) {
		let logoUrlResult: string | null = data.logoUrl || null;
		let bannerUrlResult: string | null = data.bannerUrl || null;
		let homePageBannerUrlResult: string | null = data.homePageBannerUrl || null;

		if (selectedLogo) {
			const presignedUrl = await getPresignedUrl(selectedLogo);
			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedLogo);
				logoUrlResult = presignedUrl.split('?')[0];
			}
		}

		if (selectedBanner) {
			const presignedUrl = await getBannerPresignedUrl(selectedBanner);
			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedBanner);
				bannerUrlResult = presignedUrl.split('?')[0];
			}
		}

		if (selectedHomePageBanner) {
			const presignedUrl = await getHomePageBannerPresignedUrl(selectedHomePageBanner);
			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedHomePageBanner);
				homePageBannerUrlResult = presignedUrl.split('?')[0];
			}
		}

		commitMutation({
			variables: {
				organizationId: data.id,
				name: formData.name,
				slug: formData.slug,
				website: formData.website || null,
				logoUrl: logoUrlResult,
				bannerUrl: bannerUrlResult,
				homePageBannerUrl: homePageBannerUrlResult,
				socialLinks: {
					linkedinUrl: formData.linkedinUrl || null,
					youtubeUrl: formData.youtubeUrl || null,
					instagramUrl: formData.instagramUrl || null,
					facebookUrl: formData.facebookUrl || null
				},
				description: formData.description || null,
				location: formData.location
			},
			onCompleted(response) {
				if (response.updateOrganization.__typename === 'Organization') {
					if (getFieldState('slug').isDirty) {
						// slug changed, redirect to new URL
						window.location.href = `${links.organizationDetail(response.updateOrganization.slug)}${links.organizationDetailSettings}`;
					} else {
						// set isDirty to false to disable the save button
						reset({
							name: response.updateOrganization.name,
							slug: response.updateOrganization.slug,
							website: response.updateOrganization.website,
							description: response.updateOrganization.description,
							location: response.updateOrganization.location,
							linkedinUrl: response.updateOrganization.socialLinks?.linkedinUrl ?? null,
							youtubeUrl: response.updateOrganization.socialLinks?.youtubeUrl ?? null,
							instagramUrl: response.updateOrganization.socialLinks?.instagramUrl ?? null,
							facebookUrl: response.updateOrganization.socialLinks?.facebookUrl ?? null
						});
						setSelectedLogo(null);
						setPreviewUrl(null);
						setCroppedImage(null);
						setSelectedBanner(null);
						setBannerPreviewUrl(null);
						setSelectedHomePageBanner(null);
						setHomePageBannerPreviewUrl(null);
					}
					// Handle successful update
				} else if (response.updateOrganization.__typename === 'OrganizationNotFoundError') {
					addToast({
						description: 'An unexpected error occurred. Please try again.',
						color: 'danger'
					});
				} else if (response.updateOrganization.__typename === 'OrganizationSlugInUseError') {
					// Handle slug in use error
					setError('slug', {
						message: response.updateOrganization.message
					});
				} else if (response.updateOrganization.__typename === 'OrganizationAuthorizationError') {
					addToast({
						description: 'You are not authorized to perform this action.',
						color: 'danger'
					});
				}
			}
		});
	}

	// Clean up preview URL when component unmounts
	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			if (croppedImage) {
				URL.revokeObjectURL(croppedImage);
			}
			if (bannerPreviewUrl) {
				URL.revokeObjectURL(bannerPreviewUrl);
			}
			if (homePageBannerPreviewUrl) {
				URL.revokeObjectURL(homePageBannerPreviewUrl);
			}
		};
	}, [previewUrl, croppedImage, bannerPreviewUrl, homePageBannerPreviewUrl]);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-12 w-full'>
				<Card className='p-6 space-y-6' shadow='none'>
					<CardBody>
						<div className='w-full flex flex-col md:flex-row gap-12 mb-12 items-start'>
							<div className='w-full flex flex-col gap-12'>
								<Controller
									name='name'
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											fullWidth
											label='Organization Name'
											placeholder='Add organization name'
											errorMessage={errors.name?.message}
											isInvalid={!!errors.name}
										/>
									)}
								/>
								<Controller
									name='slug'
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											fullWidth
											label='Subdomain'
											placeholder='Add subdomain'
											errorMessage={errors.slug?.message}
											isInvalid={!!errors.slug}
											endContent={<span className='text-default-400 text-md'>.{env.NEXT_PUBLIC_ROOT_DOMAIN}</span>}
										/>
									)}
								/>
							</div>
							<div className='flex flex-col gap-2 flex-shrink-0'>
								<p className='text-tiny text-foreground-500'>Organization Logo</p>
								<div className='flex flex-col items-start gap-4'>
									<div className='relative w-28 h-28'>
										<NextImage src={previewUrl || data.logoUrl} alt='Organization Logo' className='object-cover rounded-md border' fill />
									</div>
									<div className='flex gap-2 items-center'>
										<Button as='label' variant='bordered' size='sm' startContent={<EditIcon size={14} />}>
											Edit
											<input type='file' accept='image/*' className='hidden' multiple={false} onChange={handleLogoChange} />
										</Button>
										<Tooltip content={data.logoUrl || previewUrl ? 'Delete logo' : 'No logo to delete'}>
											<Button
												onPress={() => setShowDeleteOrganizationLogoModal(true)}
												variant='light'
												size='sm'
												// TODO: get data whether this logo is default, and accordingly disable this button.
												// need a custom avatar/ image class for this
												isDisabled={!data.logoUrl && !previewUrl}
												isIconOnly
											>
												<TrashIcon size={14} />
											</Button>
										</Tooltip>
									</div>
								</div>
							</div>
						</div>
						<Controller
							control={control}
							name='description'
							render={({ field }) => (
								<div className='flex flex-col gap-4 w-full mb-12'>
									<h2 className={`text-small inline-flex gap-0.5${errors.description ? ' text-danger' : ''}`}>Description</h2>
									<MarkdownEditor
										initialValue={field.value || ''}
										onValueChange={field.onChange}
										isInvalid={!!errors.description}
										description={
											errors.description ? (
												<p className='text-tiny text-danger'>{errors.description.message}</p>
											) : (
												<p className='text-tiny text-foreground-400'>Rich text editing is supported.</p>
											)
										}
									/>
								</div>
							)}
						/>

						<div className='mb-12'>
							<Controller
								name='website'
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										fullWidth
										label='Website'
										placeholder='Add website URL'
										errorMessage={errors.website?.message}
										isInvalid={!!errors.website}
										value={field.value || ''}
									/>
								)}
							/>
						</div>

						<div className='mb-12'>
							<Controller
								name='location'
								control={control}
								render={({ field }) => (
									<LocationAutocomplete
										label='Location'
										placeholder='Add organization location'
										value={field.value ?? ''}
										onValueChange={field.onChange}
										onChange={location => {
											field.onChange(location.displayName);
										}}
										errorMessage={errors.location?.message}
										isInvalid={!!errors.location}
									/>
								)}
							/>
						</div>

						<div className='mb-12'>
							<div className='flex flex-col gap-4'>
								<h2 className='font-medium text-foreground-400'>Social Links</h2>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<Controller
										name='linkedinUrl'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label='LinkedIn URL'
												placeholder='https://linkedin.com/company/...'
												errorMessage={errors.linkedinUrl?.message}
												isInvalid={!!errors.linkedinUrl}
												value={field.value || ''}
											/>
										)}
									/>
									<Controller
										name='youtubeUrl'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label='YouTube URL'
												placeholder='https://youtube.com/@...'
												errorMessage={errors.youtubeUrl?.message}
												isInvalid={!!errors.youtubeUrl}
												value={field.value || ''}
											/>
										)}
									/>
									<Controller
										name='instagramUrl'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label='Instagram URL'
												placeholder='https://instagram.com/...'
												errorMessage={errors.instagramUrl?.message}
												isInvalid={!!errors.instagramUrl}
												value={field.value || ''}
											/>
										)}
									/>
									<Controller
										name='facebookUrl'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label='Facebook URL'
												placeholder='https://facebook.com/...'
												errorMessage={errors.facebookUrl?.message}
												isInvalid={!!errors.facebookUrl}
												value={field.value || ''}
											/>
										)}
									/>
								</div>
							</div>
						</div>

						<div className='mb-12'>
							<div className='flex flex-col gap-4'>
								<p className='text-tiny text-foreground-500'>Homepage Banner</p>
								<p className='text-tiny text-foreground-400'>
									Upload a wide banner image for your organization's public page (recommended: 1920x400)
								</p>
								<div className='flex flex-col items-start gap-4'>
									{(homePageBannerPreviewUrl || data.homePageBannerUrl) && (
										<div className='w-full max-w-2xl'>
											<NextImage
												src={homePageBannerPreviewUrl || data.homePageBannerUrl}
												alt='Homepage Banner'
												className='object-cover rounded-md border'
												width={1920}
												height={400}
											/>
										</div>
									)}
									<Button as='label' variant='bordered' size='sm' startContent={<EditIcon size={14} />}>
										{selectedHomePageBanner ? 'Change' : 'Upload'}
										<input type='file' accept='image/*' className='hidden' multiple={false} onChange={handleHomePageBannerChange} />
									</Button>
								</div>
							</div>
						</div>

						<div className='mb-12'>
							<div className='flex flex-col gap-4'>
								<p className='text-tiny text-foreground-500'>Social Media Banner</p>
								<p className='text-tiny text-foreground-400'>
									Upload a horizontal landscape image that will appear on social media links (recommended: 1200x630)
								</p>
								<div className='flex flex-col items-start gap-4'>
									{(bannerPreviewUrl || data.bannerUrl) && (
										<div className='w-full max-w-md'>
											<NextImage
												src={bannerPreviewUrl || data.bannerUrl}
												alt='Organization Banner'
												className='object-cover rounded-md border'
												width={1200}
												height={630}
											/>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<Button as='label' variant='bordered' size='sm' startContent={<EditIcon size={14} />}>
											Edit
											<input type='file' accept='image/*' className='hidden' multiple={false} onChange={handleBannerChange} />
										</Button>
										<Button
											as='label'
											variant='light'
											size='sm'
											isIconOnly
											// TODO: get data whether this logo is default, and accordingly disable this button.
											// need a custom avatar/ image class for this
											onPress={() => setShowDeleteOrganizationBannerModal(true)}
											isDisabled={!data.bannerUrl && !bannerPreviewUrl}
										>
											<TrashIcon size={14} />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</CardBody>
					<CardFooter>
						<Button
							type='submit'
							color='primary'
							isDisabled={!isDirty && !selectedLogo && !selectedBanner && !selectedHomePageBanner}
							isLoading={
								isSubmitting ||
								isMutationInFlight ||
								isCreateOrganizationLogoPresignedUrlMutationInflight ||
								isCreateOrganizationBannerPresignedUrlMutationInflight ||
								isCreateOrganizationHomePageBannerPresignedUrlMutationInflight
							}
						>
							Save Changes
						</Button>
					</CardFooter>
				</Card>
			</form>

			{/* Cropper Modal */}
			<Modal isOpen={isOpen} onOpenChange={onClose} size='2xl'>
				<ModalContent>
					<ModalHeader className='flex flex-col gap-1'>
						Crop Organization {croppingType === 'logo' ? 'Logo' : croppingType === 'banner' ? 'Banner' : 'Homepage Banner'}
					</ModalHeader>
					<ModalBody>
						<div className='relative w-full h-80'>
							<Cropper
								image={tempImageUrl || undefined}
								crop={crop}
								zoom={zoom}
								aspect={croppingType === 'logo' ? 1 : croppingType === 'banner' ? 16 / 9 : 16 / 9}
								objectFit='contain'
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
								style={{
									containerStyle: {
										width: '100%',
										height: '100%',
										backgroundColor: '#000'
									}
								}}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant='light' onPress={handleCropCancel}>
							Cancel
						</Button>
						<Button color='primary' onPress={handleCropSave}>
							Crop & Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<DeleteOrganizationLogoModal
				isOpen={showDeleteOrganizationLogoModal}
				onOpenChange={setShowDeleteOrganizationLogoModal}
				onClose={() => setShowDeleteOrganizationLogoModal(false)}
				organization={data}
			/>
			<DeleteOrganizationBannerModal
				isOpen={showDeleteOrganizationBannerModal}
				onOpenChange={setShowDeleteOrganizationBannerModal}
				onClose={() => setShowDeleteOrganizationBannerModal(false)}
				organization={data}
			/>
		</>
	);
}

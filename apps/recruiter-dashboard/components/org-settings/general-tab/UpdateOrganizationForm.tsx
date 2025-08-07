import type { UpdateOrganizationFormBannerPresignedUrlMutation } from "@/__generated__/UpdateOrganizationFormBannerPresignedUrlMutation.graphql";
import type { UpdateOrganizationFormFragment$key } from "@/__generated__/UpdateOrganizationFormFragment.graphql";
import type { UpdateOrganizationFormLogoPresignedUrlMutation } from "@/__generated__/UpdateOrganizationFormLogoPresignedUrlMutation.graphql";
import type { UpdateOrganizationFormMutation as UpdateOrganizationFormMutationType } from "@/__generated__/UpdateOrganizationFormMutation.graphql";
import LocationAutocomplete from "@/components/forms/LocationAutocomplete";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import { uploadFileToS3 } from "@/lib/presignedUrl";
import {
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
	Textarea,
	addToast,
	useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";

const UpdateOrganizationFormMutation = graphql`
mutation UpdateOrganizationFormMutation($organizationId: ID!, $name: String!, $slug: String!, $location: String, $website: String, $logoUrl: String, $bannerUrl: String, $description: String) {
	updateOrganization(organizationId: $organizationId, name: $name, slug: $slug, location: $location, website: $website, logoUrl: $logoUrl, bannerUrl: $bannerUrl, description: $description) {
		__typename
		...on Organization {
			id
			slug
			name
			website
			description
			logoUrl
			bannerUrl
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

const UpdateOrganizationFormFragment = graphql`
  fragment UpdateOrganizationFormFragment on Organization {
	id
    slug
    name
	website
	logoUrl
	bannerUrl
	description
	location
  }
`;

type Props = {
	rootQuery: UpdateOrganizationFormFragment$key;
};

const formSchema = z.object({
	name: z.string().min(1, { message: "Organization name is required" }),
	slug: z.string().min(1, { message: "Slug is required" }),
	website: z.union([
		z.nullable(z.optional(z.string().url({ message: "Invalid URL" }))),
		z.literal(""),
	]),
	description: z.union([
		z.nullable(
			z.optional(
				z.string().max(1024, {
					message: "Description must be less than 1024 characters",
				}),
			),
		),
		z.literal(""),
	]),
	location: z.nullable(z.string()),
});

export default function UpdateOrganizationForm({ rootQuery }: Props) {
	const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
	const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);

	// Cropper state
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [croppingType, setCroppingType] = useState<"logo" | "banner">("logo");

	const [commitMutation, isMutationInFlight] =
		useMutation<UpdateOrganizationFormMutationType>(
			UpdateOrganizationFormMutation,
		);
	const [
		commitCreateOrganizationLogoPresignedUrlMutation,
		isCreateOrganizationLogoPresignedUrlMutationInflight,
	] = useMutation<UpdateOrganizationFormLogoPresignedUrlMutation>(
		CreateOrganizationLogoPresignedUrlMutation,
	);
	const [
		commitCreateOrganizationBannerPresignedUrlMutation,
		isCreateOrganizationBannerPresignedUrlMutationInflight,
	] = useMutation<UpdateOrganizationFormBannerPresignedUrlMutation>(
		CreateOrganizationBannerPresignedUrlMutation,
	);
	const data = useFragment(UpdateOrganizationFormFragment, rootQuery);

	const {
		handleSubmit,
		control,
		setError,
		getFieldState,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: data.name,
			slug: data.slug,
			website: data.website ?? null,
			description: data.description ?? "",
			location: data.location ?? null,
		},
	});

	async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedLogo(file);
			// Create preview URL for the selected file
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			// Set cropping type and open the cropper modal
			setCroppingType("logo");
			onOpen();
		}
	}

	async function handleBannerChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedBanner(file);
			// Create preview URL for the selected file
			const url = URL.createObjectURL(file);
			setBannerPreviewUrl(url);
			// Set cropping type and open the cropper modal
			setCroppingType("banner");
			onOpen();
		}
	}

	const onCropComplete = useCallback(
		(croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[],
	);

	const createCroppedImage = useCallback(
		async (imageSrc: string, pixelCrop: Area): Promise<string> => {
			const image = new Image();
			image.src = imageSrc;
			return new Promise((resolve) => {
				image.onload = () => {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");

					if (!ctx) {
						resolve(imageSrc);
						return;
					}

					canvas.width = pixelCrop.width;
					canvas.height = pixelCrop.height;

					ctx.drawImage(
						image,
						pixelCrop.x,
						pixelCrop.y,
						pixelCrop.width,
						pixelCrop.height,
						0,
						0,
						pixelCrop.width,
						pixelCrop.height,
					);

					canvas.toBlob(
						(blob) => {
							if (blob) {
								const croppedImageUrl = URL.createObjectURL(blob);
								resolve(croppedImageUrl);
							} else {
								resolve(imageSrc);
							}
						},
						"image/jpeg",
						0.9,
					);
				};
			});
		},
		[],
	);

	const handleCropSave = useCallback(async () => {
		const imageSource = croppingType === "logo" ? previewUrl : bannerPreviewUrl;
		if (imageSource && croppedAreaPixels) {
			try {
				const croppedImageUrl = await createCroppedImage(
					imageSource,
					croppedAreaPixels,
				);
				setCroppedImage(croppedImageUrl);

				if (croppingType === "logo") {
					setPreviewUrl(croppedImageUrl);
				} else if (croppingType === "banner") {
					setBannerPreviewUrl(croppedImageUrl);
				}

				onClose();
			} catch (error) {
				console.error("Error creating cropped image:", error);
			}
		}
	}, [
		previewUrl,
		bannerPreviewUrl,
		croppedAreaPixels,
		createCroppedImage,
		onClose,
		croppingType,
	]);

	const handleCropCancel = useCallback(() => {
		onClose();
		if (croppingType === "logo") {
			setSelectedLogo(null);
			setPreviewUrl(null);
		} else if (croppingType === "banner") {
			setSelectedBanner(null);
			setBannerPreviewUrl(null);
		}
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
		setCroppedImage(null);
		setCroppingType("logo");
	}, [onClose, croppingType]);

	function getPresignedUrl(logo: File): Promise<string | null> {
		return new Promise((resolve, reject) => {
			commitCreateOrganizationLogoPresignedUrlMutation({
				variables: {
					contentType: logo.type,
				},
				onCompleted: (response) => {
					resolve(
						response.createOrganizationLogoPresignedUrl?.presignedUrl || null,
					);
				},
				onError: (error) => {
					console.error("Error fetching presigned URL:", error);
					reject(error);
				},
			});
		});
	}

	function getBannerPresignedUrl(banner: File): Promise<string | null> {
		return new Promise((resolve, reject) => {
			commitCreateOrganizationBannerPresignedUrlMutation({
				variables: {
					contentType: banner.type,
				},
				onCompleted: (response) => {
					resolve(
						response.createOrganizationBannerPresignedUrl?.presignedUrl || null,
					);
				},
				onError: (error) => {
					console.error("Error fetching banner presigned URL:", error);
					reject(error);
				},
			});
		});
	}

	async function onSubmit(formData: z.infer<typeof formSchema>) {
		let logoUrlResult: string | null = data.logoUrl || null;
		let bannerUrlResult: string | null = null;

		if (selectedLogo) {
			const presignedUrl = await getPresignedUrl(selectedLogo);
			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedLogo);
				// Extract the URL from the presignedUrl
				logoUrlResult = presignedUrl.split("?")[0];
			}
		}

		if (selectedBanner) {
			const presignedUrl = await getBannerPresignedUrl(selectedBanner);
			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedBanner);
				// Extract the URL from the presignedUrl
				bannerUrlResult = presignedUrl.split("?")[0];
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
				description: formData.description || null,
				location: formData.location,
			},
			onCompleted(response) {
				if (response.updateOrganization.__typename === "Organization") {
					if (getFieldState("slug").isDirty) {
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
						});
						setSelectedLogo(null);
						setPreviewUrl(null);
						setCroppedImage(null);
						setSelectedBanner(null);
						setBannerPreviewUrl(null);
					}
					// Handle successful update
				} else if (
					response.updateOrganization.__typename === "OrganizationNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.updateOrganization.__typename ===
					"OrganizationSlugInUseError"
				) {
					// Handle slug in use error
					setError("slug", {
						message: response.updateOrganization.message,
					});
				} else if (
					response.updateOrganization.__typename ===
					"OrganizationAuthorizationError"
				) {
					addToast({
						description: "You are not authorized to perform this action.",
						color: "danger",
					});
				}
			},
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
		};
	}, [previewUrl, croppedImage, bannerPreviewUrl]);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-12 w-full">
				<Card className="p-6 space-y-6" shadow="none">
					<CardBody>
						<div className="w-full flex flex-col md:flex-row gap-12 mb-12 items-start">
							<div className="w-full flex flex-col gap-12">
								<Controller
									name="name"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											fullWidth
											label="Organization Name"
											placeholder="Add organization name"
											errorMessage={errors.name?.message}
											isInvalid={!!errors.name}
										/>
									)}
								/>
								<Controller
									name="slug"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											fullWidth
											label="Subdomain"
											placeholder="Add subdomain"
											errorMessage={errors.slug?.message}
											isInvalid={!!errors.slug}
											endContent={
												<span className="text-default-400 text-md">
													.{env.NEXT_PUBLIC_ROOT_DOMAIN}
												</span>
											}
										/>
									)}
								/>
							</div>
							<div className="flex flex-col gap-2 flex-shrink-0">
								<p className="text-tiny text-foreground-500">
									Organization Logo
								</p>
								<div className="flex flex-col items-start gap-4">
									<div className="relative w-28 h-28">
										<NextImage
											src={
												previewUrl ||
												(selectedLogo
													? URL.createObjectURL(selectedLogo)
													: data.logoUrl)
											}
											alt="Organization Logo"
											className="object-cover rounded-md border"
											fill
										/>
									</div>
									<Button as="label" variant="bordered" size="sm">
										Upload new logo
										<input
											type="file"
											accept="image/*"
											className="hidden"
											multiple={false}
											onChange={handleLogoChange}
										/>
									</Button>
								</div>
							</div>
						</div>

						<div className="mb-12">
							<Controller
								name="description"
								control={control}
								render={({ field }) => (
									<Textarea
										{...field}
										fullWidth
										label="Description"
										placeholder="Add description"
										errorMessage={errors.description?.message}
										isInvalid={!!errors.description}
										value={field.value || ""}
									/>
								)}
							/>
						</div>
						<div className="mb-12">
							<Controller
								name="website"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										fullWidth
										label="Website"
										placeholder="Add website URL"
										errorMessage={errors.website?.message}
										isInvalid={!!errors.website}
										value={field.value || ""}
									/>
								)}
							/>
						</div>

						<div className="mb-12">
							<Controller
								name="location"
								control={control}
								render={({ field }) => (
									<LocationAutocomplete
										label="Location"
										placeholder="Add organization location"
										value={field.value ?? ""}
										onValueChange={field.onChange}
										onChange={(location) => {
											field.onChange(location.displayName);
										}}
										errorMessage={errors.location?.message}
										isInvalid={!!errors.location}
									/>
								)}
							/>
						</div>

						<div className="mb-12">
							<div className="flex flex-col gap-4">
								<p className="text-tiny text-foreground-500">
									Organization Banner
								</p>
								<p className="text-tiny text-foreground-400">
									Upload a horizontal landscape image that will appear on social
									media links
								</p>
								<div className="flex flex-col items-start gap-4">
									{(bannerPreviewUrl || data.bannerUrl) && (
										<div className="relative w-full max-w-md h-32">
											<NextImage
												src={bannerPreviewUrl || data.bannerUrl}
												alt="Organization Banner"
												className="object-cover rounded-md border"
												fill
											/>
										</div>
									)}
									<Button as="label" variant="bordered" size="sm">
										Upload new banner
										<input
											type="file"
											accept="image/*"
											className="hidden"
											multiple={false}
											onChange={handleBannerChange}
										/>
									</Button>
								</div>
							</div>
						</div>
					</CardBody>
					<CardFooter>
						<Button
							type="submit"
							color="primary"
							isDisabled={!isDirty && !selectedLogo && !selectedBanner}
							isLoading={
								isSubmitting ||
								isMutationInFlight ||
								isCreateOrganizationLogoPresignedUrlMutationInflight ||
								isCreateOrganizationBannerPresignedUrlMutationInflight
							}
						>
							Save Changes
						</Button>
					</CardFooter>
				</Card>
			</form>

			{/* Cropper Modal */}
			<Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						Crop Organization {croppingType === "logo" ? "Logo" : "Banner"}
					</ModalHeader>
					<ModalBody>
						<div className="relative w-full h-80">
							<Cropper
								image={
									croppingType === "logo"
										? previewUrl || undefined
										: (bannerPreviewUrl ?? undefined)
								}
								crop={crop}
								zoom={zoom}
								aspect={croppingType === "logo" ? 1 : 16 / 9}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
								style={{
									containerStyle: {
										width: "100%",
										height: "100%",
										backgroundColor: "#000",
									},
								}}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={handleCropCancel}>
							Cancel
						</Button>
						<Button color="primary" onPress={handleCropSave}>
							Crop & Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

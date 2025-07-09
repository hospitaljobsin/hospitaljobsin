import type { UpdateOrganizationFormFragment$key } from "@/__generated__/UpdateOrganizationFormFragment.graphql";
import type { UpdateOrganizationFormLogoPresignedUrlMutation } from "@/__generated__/UpdateOrganizationFormLogoPresignedUrlMutation.graphql";
import type { UpdateOrganizationFormMutation as UpdateOrganizationFormMutationType } from "@/__generated__/UpdateOrganizationFormMutation.graphql";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import { uploadFileToS3 } from "@/lib/presignedUrl";
import { useRouter } from "@bprogress/next";
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
	addToast,
	useDisclosure,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";

const UpdateOrganizationFormMutation = graphql`
mutation UpdateOrganizationFormMutation($organizationId: ID!, $name: String!, $slug: String!, $location: String, $website: String, $logoUrl: String, $description: String) {
	updateOrganization(organizationId: $organizationId, name: $name, slug: $slug, location: $location, website: $website, logoUrl: $logoUrl, description: $description) {
		__typename
		...on Organization {
			id
			slug
			name
			website
			description
			logoUrl
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

const UpdateOrganizationFormFragment = graphql`
  fragment UpdateOrganizationFormFragment on Organization {
	id
    slug
    name
	website
	logoUrl
	description
	location
  }
`;

type Props = {
	rootQuery: UpdateOrganizationFormFragment$key;
};

const formSchema = z.object({
	name: z
		.string()
		.check(z.minLength(1, { error: "Organization name is required" })),
	slug: z.string().check(z.minLength(1, { error: "Slug is required" })),
	website: z.nullable(z.optional(z.url({ error: "Invalid URL" }))),
	description: z.union([
		z.nullable(z.optional(z.string().check(z.maxLength(300)))),
		z.literal(""),
	]),
	location: z.nullable(z.string()),
});

export default function UpdateOrganizationForm({ rootQuery }: Props) {
	const router = useRouter();
	const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// Cropper state
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);

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
	const data = useFragment(UpdateOrganizationFormFragment, rootQuery);

	const {
		handleSubmit,
		control,
		setError,
		getFieldState,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
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
			// Open the cropper modal
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
		if (previewUrl && croppedAreaPixels) {
			try {
				const croppedImageUrl = await createCroppedImage(
					previewUrl,
					croppedAreaPixels,
				);
				setCroppedImage(croppedImageUrl);
				setPreviewUrl(croppedImageUrl);
				onClose();
			} catch (error) {
				console.error("Error creating cropped image:", error);
			}
		}
	}, [previewUrl, croppedAreaPixels, createCroppedImage, onClose]);

	const handleCropCancel = useCallback(() => {
		onClose();
		setSelectedLogo(null);
		setPreviewUrl(null);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
		setCroppedImage(null);
	}, [onClose]);

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

	async function onSubmit(formData: z.infer<typeof formSchema>) {
		let logoUrlResult: string | null = data.logoUrl || null;
		if (selectedLogo) {
			const presignedUrl = await getPresignedUrl(selectedLogo);
			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedLogo);
				// Extract the URL from the presignedUrl
				logoUrlResult = presignedUrl.split("?")[0];
			}
		}
		commitMutation({
			variables: {
				organizationId: data.id,
				name: formData.name,
				slug: formData.slug,
				website: formData.website || null,
				logoUrl: logoUrlResult,
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
		};
	}, [previewUrl, croppedImage]);

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
									<Input
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
									<Input
										{...field}
										label="Location"
										placeholder="Add organization location"
										value={field.value ?? ""}
										errorMessage={errors.location?.message}
										isInvalid={!!errors.location}
									/>
								)}
							/>
						</div>
					</CardBody>
					<CardFooter>
						<Button
							type="submit"
							color="primary"
							isDisabled={!isDirty && !selectedLogo}
							isLoading={
								isSubmitting ||
								isMutationInFlight ||
								isCreateOrganizationLogoPresignedUrlMutationInflight
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
						Crop Organization Logo
					</ModalHeader>
					<ModalBody>
						<div className="relative w-full h-80">
							<Cropper
								image={previewUrl || undefined}
								crop={crop}
								zoom={zoom}
								aspect={1}
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

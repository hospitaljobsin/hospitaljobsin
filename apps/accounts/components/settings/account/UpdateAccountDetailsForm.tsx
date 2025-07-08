import type { UpdateAccountDetailsFormFragment$key } from "@/__generated__/UpdateAccountDetailsFormFragment.graphql";
import { uploadFileToS3 } from "@/lib/presignedUrl";
import {
	Avatar,
	Badge,
	Button,
	Card,
	CardHeader,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PenIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { Controller, useForm } from "react-hook-form";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";

const UpdateAccountDetailsFormMutation = graphql`
mutation UpdateAccountDetailsFormMutation($fullName: String!, $avatarUrl: String)  {
	updateAccount(fullName: $fullName, avatarUrl: $avatarUrl) {
		__typename
		... on Account {
			...UpdateAccountDetailsFormFragment
			...AccountDetailsFragment
			...AuthNavigationFragment
		}
	}
}`;

const CreateProfilePicturePresignedUrlMutation = graphql`
mutation UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation($contentType: String!) {
	createProfilePicturePresignedUrl(contentType: $contentType) {
		presignedUrl
	}
}`;

const UpdateAccountDetailsFormFragment = graphql`
  fragment UpdateAccountDetailsFormFragment on Account {
    fullName
    email
	avatarUrl(size: 120)
  }
`;

type Props = {
	rootQuery: UpdateAccountDetailsFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	fullName: z
		.string()
		.check(
			z.minLength(1, "This field is required"),
			z.maxLength(75, "This field must be at most 75 characters long"),
		),
});

export default function UpdateAccountDetailsForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdateAccountDetailsFormMutation,
	);
	const [commitPresignedUrlMutation] = useMutation(
		CreateProfilePicturePresignedUrlMutation,
	);
	const data = useFragment(UpdateAccountDetailsFormFragment, rootQuery);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// Cropper state
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: {
			fullName: data.fullName,
		},
	});

	function getPresignedUrl(file: File): Promise<string | null> {
		return new Promise((resolve, reject) => {
			commitPresignedUrlMutation({
				variables: {
					contentType: file.type,
				},
				onCompleted: (response: any) => {
					resolve(
						response.createProfilePicturePresignedUrl?.presignedUrl || null,
					);
				},
				onError: (error) => {
					console.error("Error fetching presigned URL:", error);
					reject(error);
				},
			});
		});
	}

	async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
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
		setSelectedFile(null);
		setPreviewUrl(null);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
		setCroppedImage(null);
	}, [onClose]);

	async function uploadProfilePicture(): Promise<string | null> {
		if (!selectedFile) return null;

		setIsUploading(true);
		try {
			const presignedUrl = await getPresignedUrl(selectedFile);
			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedFile);
				// Extract the URL from the presignedUrl
				const avatarUrl = presignedUrl.split("?")[0];
				setSelectedFile(null);
				setPreviewUrl(null);
				setCroppedImage(null);
				return avatarUrl;
			}
		} catch (error) {
			console.error("Error uploading profile picture:", error);
		} finally {
			setIsUploading(false);
		}
		return null;
	}

	async function onSubmit(formData: z.infer<typeof formSchema>) {
		let avatarUrl = data.avatarUrl;

		// Upload profile picture if a file is selected
		if (selectedFile) {
			const uploadedAvatarUrl = await uploadProfilePicture();
			if (uploadedAvatarUrl) {
				avatarUrl = uploadedAvatarUrl;
			}
		}

		commitMutation({
			variables: {
				fullName: formData.fullName,
				avatarUrl,
			},
		});
		onSaveChanges();
	}

	async function handleCancel() {
		onSaveChanges();
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
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
				<Card className="p-6 space-y-6" shadow="none">
					<CardHeader className="flex gap-6 w-full items-center justify-between">
						<div className="flex gap-6 w-full items-start sm:items-center justify-start flex-col sm:flex-row">
							<div className="relative">
								<Badge
									placement="bottom-right"
									variant="solid"
									content={
										<Tooltip
											content={
												<div className="px-1 py-2 max-w-52 flex flex-col gap-2">
													<div className="text-small">
														Change your profile picture
													</div>
													<div className="text-tiny">
														Click your avatar to upload a new profile picture
													</div>
												</div>
											}
										>
											<PenIcon size={18} className="m-2" />
										</Tooltip>
									}
									size="lg"
									shape="circle"
									showOutline={false}
								>
									<Avatar
										showFallback
										name={data.fullName}
										radius="full"
										className="w-32 h-32 cursor-pointer hover:brightness-75 transition-all duration-200"
										src={previewUrl || data.avatarUrl}
										onClick={() => fileInputRef.current?.click()}
									/>
								</Badge>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileSelect}
									className="hidden"
								/>
							</div>
							<div className="flex flex-col gap-8 w-full items-center justify-start">
								<div className="flex flex-col w-full space-y-4">
									<Controller
										name="fullName"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												label="Full Name"
												placeholder="Add your full name"
												value={field.value ?? ""}
												errorMessage={errors.fullName?.message}
												isInvalid={!!errors.fullName}
											/>
										)}
									/>
								</div>
								<Input
									label="Email Address"
									placeholder="Add your email address"
									value={data.email}
									isDisabled
								/>
								{selectedFile && (
									<div className="text-xs text-gray-500 w-full">
										This avatar will be uploaded when you click "Save Changes"
									</div>
								)}
							</div>
						</div>
					</CardHeader>
				</Card>

				<div className="mt-4 flex justify-end gap-6">
					<Button
						type="button"
						variant="light"
						onPress={handleCancel}
						isDisabled={isMutationInFlight || isSubmitting || isUploading}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						isLoading={isMutationInFlight || isSubmitting || isUploading}
					>
						Save Changes
					</Button>
				</div>
			</form>

			{/* Cropper Modal */}
			<Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						Crop Profile Picture
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

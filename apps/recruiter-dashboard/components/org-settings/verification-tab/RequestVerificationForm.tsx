"use client";
import type { RequestVerificationFormFragment$key } from "@/__generated__/RequestVerificationFormFragment.graphql";
import type { RequestVerificationFormMutation } from "@/__generated__/RequestVerificationFormMutation.graphql";
import type { RequestVerificationFormPresignedUrlMutation } from "@/__generated__/RequestVerificationFormPresignedUrlMutation.graphql";
import { useNavigationGuard } from "@/lib/hooks/useNavigationGuard";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Select,
	SelectItem,
	addToast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon, VerifiedIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";

const RequestOrganizationVerificationMutation = graphql`
	mutation RequestVerificationFormMutation(
		$organizationId: ID!
		$registeredOrganizationName: String!
		$contactEmail: String!
		$phoneNumber: String!
		$address: AddressInput!
		$businessProofType: BusinessProof!
		$businessProofUrl: String!
		$addressProofType: AddressProof!
		$addressProofUrl: String!
	) {
		requestOrganizationVerification(
			organizationId: $organizationId
			registeredOrganizationName: $registeredOrganizationName
			contactEmail: $contactEmail
			phoneNumber: $phoneNumber
			address: $address
			businessProofType: $businessProofType
			businessProofUrl: $businessProofUrl
			addressProofType: $addressProofType
			addressProofUrl: $addressProofUrl
		) {
			__typename
			... on Organization {
				id
				verificationStatus {
					__typename
					... on Verified @alias(as: "verified") {
						verifiedAt
					}
					... on Rejected {
						rejectedAt
					}
					... on Pending {
						requestedAt
					}
					... on NotRequested {
						message
					}
				}
			}
			... on OrganizationNotFoundError {
				message
			}
			... on OrganizationAuthorizationError {
				message
			}
			... on OrganizationAlreadyVerifiedError {
				message
			}
			... on OrganizationVerificationRequestAlreadyExistsError {
				message
			}
			... on InvalidPhoneNumberError {
				message
			}
		}
	}
`;

const CreateOrganizationVerificationProofPresignedUrlMutation = graphql`
	mutation RequestVerificationFormPresignedUrlMutation($contentType: String!) {
		createOrganizationVerificationProofPresignedUrl(contentType: $contentType) {
			presignedUrl
		}
	}
`;

const RequestVerificationFormFragment = graphql`
	fragment RequestVerificationFormFragment on Organization {
		id
		name
		logoUrl
		description
	}
`;

// Zod schema for form validation
const verificationFormSchema = z.object({
	registeredOrganizationName: z
		.string()
		.min(2, "Organization name must be at least 2 characters")
		.max(100, "Organization name must be less than 100 characters"),
	contactEmail: z.string().email("Please enter a valid email address"),
	phoneNumber: z
		.string()
		.min(1, "Phone number is required")
		.length(10, "Invalid phone number"),
	address: z.object({
		streetAddress: z
			.string()
			.min(5, "Street address must be at least 5 characters")
			.max(200, "Street address must be less than 200 characters"),
		addressLocality: z
			.string()
			.min(5, "Address locality must be at least 5 characters")
			.max(200, "Address locality must be less than 200 characters")
			.optional(),
		addressRegion: z
			.string()
			.min(2, "Address region must be at least 2 characters")
			.max(50, "Address region must be less than 50 characters"),
		postalCode: z
			.string()
			.min(2, "Postal code must be at least 2 characters")
			.max(50, "Postal code must be less than 50 characters"),
		country: z
			.string()
			.min(2, "Country must be at least 2 characters")
			.max(50, "Country must be less than 50 characters"),
	}),
	businessProofType: z.enum([
		"GST_CERTIFICATE",
		"CLINIC_REGISTRATION",
		"MSME_REGISTRATION",
		"SHOP_LICENSE",
		"MEDICAL_COUNCIL_REGISTRATION",
		"OTHER",
	]),
	businessProofFile: z
		.instanceof(File)
		.refine(
			(file) => file.size <= 10 * 1024 * 1024,
			"File size must be less than 10MB",
		)
		.refine(
			(file) =>
				["image/jpeg", "image/png", "application/pdf"].includes(file.type),
			"File must be JPEG, PNG, or PDF",
		),
	addressProofType: z.enum([
		"UTILITY_BILL",
		"RENTAL_AGREEMENT",
		"BANK_STATEMENT",
		"OTHER",
	]),
	addressProofFile: z
		.instanceof(File)
		.refine(
			(file) => file.size <= 10 * 1024 * 1024,
			"File size must be less than 10MB",
		)
		.refine(
			(file) =>
				["image/jpeg", "image/png", "application/pdf"].includes(file.type),
			"File must be JPEG, PNG, or PDF",
		),
});

type VerificationFormData = z.infer<typeof verificationFormSchema>;

const businessProofOptions = [
	{ value: "GST_CERTIFICATE", label: "GST Certificate" },
	{ value: "CLINIC_REGISTRATION", label: "Clinic Registration" },
	{ value: "MSME_REGISTRATION", label: "MSME Registration" },
	{ value: "SHOP_LICENSE", label: "Business License" },
	{
		value: "MEDICAL_COUNCIL_REGISTRATION",
		label: "Medical Council Registration",
	},
	{ value: "OTHER", label: "Other" },
];

const addressProofOptions = [
	{ value: "UTILITY_BILL", label: "Utility Bill" },
	{ value: "RENTAL_AGREEMENT", label: "Rental Agreement" },
	{ value: "BANK_STATEMENT", label: "Bank Statement" },
	{ value: "OTHER", label: "Other" },
];

export default function RequestVerificationForm({
	organization,
}: {
	organization: RequestVerificationFormFragment$key;
}) {
	const data = useFragment(RequestVerificationFormFragment, organization);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [commitRequestVerification, isRequestVerificationInFlight] =
		useMutation<RequestVerificationFormMutation>(
			RequestOrganizationVerificationMutation,
		);
	const [commitCreatePresignedUrl, isCreatePresignedUrlInFlight] =
		useMutation<RequestVerificationFormPresignedUrlMutation>(
			CreateOrganizationVerificationProofPresignedUrlMutation,
		);

	const {
		register,
		handleSubmit,
		control,
		setError,
		formState: { errors, isValid, isDirty },
		setValue,
	} = useForm<VerificationFormData>({
		resolver: zodResolver(verificationFormSchema),
		mode: "onChange",
		defaultValues: {
			registeredOrganizationName: data.name || "",
			contactEmail: "",
			phoneNumber: "",
			address: {
				streetAddress: "",
				addressLocality: "",
				addressRegion: "",
				postalCode: "",
				country: "India",
			},
			businessProofType: "SHOP_LICENSE",
			addressProofType: "UTILITY_BILL",
		},
	});

	useNavigationGuard({
		enabled: () => isDirty,
		confirm: () => {
			const confirmed = window.confirm(
				"Are you sure you want to leave this page? Your changes will not be saved.",
			);
			return confirmed;
		},
	});

	const uploadFile = useCallback(
		async (file: File): Promise<string> => {
			return new Promise((resolve, reject) => {
				commitCreatePresignedUrl({
					variables: {
						contentType: file.type,
					},
					onCompleted: (response) => {
						if (
							!response.createOrganizationVerificationProofPresignedUrl
								?.presignedUrl
						) {
							reject(new Error("Failed to get presigned URL"));
							return;
						}

						const presignedUrl =
							response.createOrganizationVerificationProofPresignedUrl
								.presignedUrl;

						// Upload file to S3
						fetch(presignedUrl, {
							method: "PUT",
							body: file,
							headers: {
								"Content-Type": file.type,
							},
						})
							.then((uploadResponse) => {
								if (!uploadResponse.ok) {
									reject(new Error("Failed to upload file"));
									return;
								}

								// Extract the file URL from the presigned URL
								const url = new URL(presignedUrl);
								resolve(`${url.protocol}//${url.host}${url.pathname}`);
							})
							.catch(reject);
					},
					onError: reject,
				});
			});
		},
		[commitCreatePresignedUrl],
	);

	const onSubmit = async (formData: VerificationFormData) => {
		setIsSubmitting(true);

		try {
			// Upload both files
			const [businessProofUrl, addressProofUrl] = await Promise.all([
				uploadFile(formData.businessProofFile),
				uploadFile(formData.addressProofFile),
			]);

			// Submit verification request
			commitRequestVerification({
				variables: {
					organizationId: data.id,
					registeredOrganizationName: formData.registeredOrganizationName,
					contactEmail: formData.contactEmail,
					phoneNumber: `+91${formData.phoneNumber}`,
					address: {
						streetAddress: formData.address.streetAddress,
						addressLocality: formData.address.addressLocality || null,
						addressRegion: formData.address.addressRegion,
						postalCode: formData.address.postalCode,
						country: formData.address.country,
					},
					businessProofType: formData.businessProofType,
					businessProofUrl,
					addressProofType: formData.addressProofType,
					addressProofUrl,
				},
				onCompleted: (response) => {
					if (
						response.requestOrganizationVerification?.__typename ===
						"Organization"
					) {
						addToast({
							color: "success",
							description: "Verification request submitted successfully",
						});
					} else if (
						response.requestOrganizationVerification.__typename ===
						"InvalidPhoneNumberError"
					) {
						setError("phoneNumber", {
							message: response.requestOrganizationVerification.message,
							type: "server",
						});
					} else if (
						response.requestOrganizationVerification.__typename ===
						"OrganizationVerificationRequestAlreadyExistsError"
					) {
						setError("root", {
							message: response.requestOrganizationVerification.message,
							type: "server",
						});
					} else {
						setError("root", {
							message:
								"Failed to submit verification request. Please try again.",
							type: "server",
						});
					}
					setIsSubmitting(false);
				},
				onError: (error) => {
					setError("root", {
						message:
							error instanceof Error
								? error.message
								: "An unexpected error occurred",
						type: "server",
					});
					setIsSubmitting(false);
				},
			});
		} catch (err) {
			setError("root", {
				message:
					err instanceof Error ? err.message : "An unexpected error occurred",
				type: "server",
			});
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full mx-auto flex flex-col gap-8">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-medium text-gray-900 mb-2">
						Request Organization Verification
					</h1>
					<p className="text-gray-600">
						Complete the form below to verify your organization.
					</p>
				</div>
				<Card className="p-6" shadow="none" isDisabled>
					<CardHeader className="text-lg font-medium flex items-center gap-6">
						<div className="relative aspect-square w-16 h-16">
							<Image
								src={data.logoUrl}
								alt={data.name}
								fill
								className="rounded-md object-cover"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								{data.name}
								<VerifiedIcon className="w-4 h-4 text-primary" />
							</div>
							<p className="text-sm sm:text-base font-normal text-foreground-500 line-clamp-2">
								{data.description}
							</p>
						</div>
					</CardHeader>
				</Card>
				<p className="text-foreground-600 text-sm -mt-2 flex items-center gap-2 justify-end">
					<VerifiedIcon className="w-4 h-4 text-primary" />
					Verification Preview
				</p>
			</div>

			{errors.root && (
				<Alert variant="flat" color="danger" className="mb-6">
					{errors.root.message}
				</Alert>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
				{/* Organization Information Card */}
				<Card className="w-full p-6" shadow="none">
					<CardHeader>
						<h2 className="text-lg font-medium text-gray-900">
							Organization Information
						</h2>
					</CardHeader>
					<CardBody className="space-y-6">
						<Input
							{...register("registeredOrganizationName")}
							label="Organization Name"
							placeholder="Enter your organization's registered name"
							isInvalid={!!errors.registeredOrganizationName}
							errorMessage={errors.registeredOrganizationName?.message}
						/>

						<Input
							{...register("contactEmail")}
							label="Contact Email"
							type="email"
							placeholder="Enter work email address"
							isInvalid={!!errors.contactEmail}
							errorMessage={errors.contactEmail?.message}
						/>

						<Input
							{...register("phoneNumber")}
							label="Phone Number"
							startContent={<p className="text-sm">+91</p>}
							placeholder="98765 43210"
							isInvalid={!!errors.phoneNumber}
							errorMessage={errors.phoneNumber?.message}
						/>
					</CardBody>
				</Card>

				{/* Address Information Card */}
				<Card className="w-full p-6" shadow="none">
					<CardHeader>
						<h2 className="text-lg font-medium text-gray-900">
							Address Information
						</h2>
					</CardHeader>
					<CardBody className="space-y-6">
						<Input
							{...register("address.streetAddress")}
							label="Street Address"
							placeholder="Enter Street Address 1"
							isInvalid={!!errors.address?.streetAddress}
							errorMessage={errors.address?.streetAddress?.message}
						/>
						<Input
							{...register("address.addressLocality")}
							label="Street Address"
							placeholder="Enter Street Address 2 (Optional)"
							isInvalid={!!errors.address?.addressLocality}
							errorMessage={errors.address?.addressLocality?.message}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								{...register("address.addressLocality")}
								label="City"
								placeholder="Enter city"
								isInvalid={!!errors.address?.addressLocality}
								errorMessage={errors.address?.addressLocality?.message}
							/>

							<Input
								{...register("address.addressRegion")}
								label="State"
								placeholder="Enter state"
								isInvalid={!!errors.address?.addressRegion}
								errorMessage={errors.address?.addressRegion?.message}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								{...register("address.postalCode")}
								label="Postal Code"
								placeholder="Enter 6-digit postal code"
								isInvalid={!!errors.address?.postalCode}
								errorMessage={errors.address?.postalCode?.message}
							/>
						</div>
					</CardBody>
				</Card>

				{/* Business Proof Card */}
				<Card className="w-full p-6" shadow="none">
					<CardHeader>
						<h2 className="text-lg font-medium text-gray-900">
							Business Proof
						</h2>
					</CardHeader>
					<CardBody className="space-y-6">
						<Controller
							name="businessProofType"
							control={control}
							render={({ field }) => (
								<Select
									label="Business Proof Type"
									selectedKeys={[field.value]}
									onSelectionChange={(keys) => {
										if (keys.size === 0) {
											return;
										}
										const value = Array.from(keys)[0] as string;
										field.onChange(value);
									}}
									isInvalid={!!errors.businessProofType}
									errorMessage={errors.businessProofType?.message}
								>
									{businessProofOptions.map((option) => (
										<SelectItem key={option.value}>{option.label}</SelectItem>
									))}
								</Select>
							)}
						/>

						<Input
							label="Business Proof Document"
							id="businessProofFile"
							type="file"
							accept=".jpg,.jpeg,.png,.pdf"
							isInvalid={!!errors.businessProofFile}
							errorMessage={errors.businessProofFile?.message}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setValue("businessProofFile", file, {
										shouldValidate: true,
									});
								}
							}}
						/>
					</CardBody>
				</Card>

				{/* Address Proof Card */}
				<Card className="w-full p-6" shadow="none">
					<CardHeader>
						<h2 className="text-lg font-medium text-gray-900">Address Proof</h2>
					</CardHeader>
					<CardBody className="space-y-6">
						<Controller
							name="addressProofType"
							control={control}
							render={({ field }) => (
								<Select
									label="Address Proof Type"
									selectedKeys={[field.value]}
									onSelectionChange={(keys) => {
										if (keys.size === 0) {
											return;
										}
										const value = Array.from(keys)[0] as string;
										field.onChange(value);
									}}
									isInvalid={!!errors.addressProofType}
									errorMessage={errors.addressProofType?.message}
								>
									{addressProofOptions.map((option) => (
										<SelectItem key={option.value}>{option.label}</SelectItem>
									))}
								</Select>
							)}
						/>

						<Input
							label="Address Proof Document"
							id="addressProofFile"
							type="file"
							accept=".jpg,.jpeg,.png,.pdf"
							isInvalid={!!errors.addressProofFile}
							errorMessage={errors.addressProofFile?.message}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setValue("addressProofFile", file, {
										shouldValidate: true,
									});
								}
							}}
						/>
					</CardBody>
				</Card>

				{/* Submit Button */}
				<div className="pt-6">
					<Button
						type="submit"
						color="primary"
						size="lg"
						isLoading={isSubmitting}
						isDisabled={!isValid || isSubmitting}
						startContent={!isSubmitting && <UploadIcon className="w-4 h-4" />}
						className="w-full"
					>
						{isSubmitting ? "Submitting..." : "Submit Verification Request"}
					</Button>
				</div>
			</form>
		</div>
	);
}

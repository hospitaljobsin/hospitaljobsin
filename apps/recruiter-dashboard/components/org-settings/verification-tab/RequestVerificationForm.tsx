"use client";
import type { RequestVerificationFormFragment$key } from "@/__generated__/RequestVerificationFormFragment.graphql";
import type { RequestVerificationFormMutation } from "@/__generated__/RequestVerificationFormMutation.graphql";
import type { RequestVerificationFormPresignedUrlMutation } from "@/__generated__/RequestVerificationFormPresignedUrlMutation.graphql";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Select,
	SelectItem,
	Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, UploadIcon } from "lucide-react";
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
				verificationStatus
				verifiedAt
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
		.regex(
			/^\+91[6-9]\d{9}$/,
			"Please enter a valid Indian phone number (+91XXXXXXXXXX)",
		),
	address: z.object({
		line1: z
			.string()
			.min(5, "Line 1 must be at least 5 characters")
			.max(200, "Line 1 must be less than 200 characters"),
		line2: z
			.string()
			.min(5, "Line 2 must be at least 5 characters")
			.max(200, "Line 2 must be less than 200 characters"),
		city: z
			.string()
			.min(2, "City must be at least 2 characters")
			.max(50, "City must be less than 50 characters"),
		state: z
			.string()
			.min(2, "State must be at least 2 characters")
			.max(50, "State must be less than 50 characters"),
		pincode: z
			.string()
			.regex(/^\d{6}$/, "Please enter a valid 6-digit postal code"),
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
	{ value: "SHOP_LICENSE", label: "Shop License" },
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
	const [error, setError] = useState<string | null>(null);

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
		formState: { errors, isValid },
		setValue,
	} = useForm<VerificationFormData>({
		resolver: zodResolver(verificationFormSchema),
		mode: "onChange",
		defaultValues: {
			registeredOrganizationName: data.name || "",
			contactEmail: "",
			phoneNumber: "",
			address: {
				line1: "",
				line2: "",
				city: "",
				state: "",
				pincode: "",
				country: "India",
			},
			businessProofType: "SHOP_LICENSE",
			addressProofType: "UTILITY_BILL",
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
		setError(null);

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
					phoneNumber: formData.phoneNumber,
					address: {
						line1: formData.address.line1,
						line2: formData.address.line2,
						city: formData.address.city,
						state: formData.address.state,
						pincode: formData.address.pincode,
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
						// Success - the page will automatically refresh and show the pending view
						console.log("Verification request submitted successfully");
					} else {
						setError(
							"Failed to submit verification request. Please try again.",
						);
					}
					setIsSubmitting(false);
				},
				onError: (error) => {
					setError(
						error instanceof Error
							? error.message
							: "An unexpected error occurred",
					);
					setIsSubmitting(false);
				},
			});
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred",
			);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full mx-auto p-8">
			<div className="mb-8">
				<h1 className="text-2xl font-medium text-gray-900 mb-2">
					Request Organization Verification
				</h1>
				<p className="text-gray-600">
					Complete the form below to verify your organization. This process
					helps build trust with job seekers.
				</p>
			</div>

			{error && (
				<div className="mb-6">
					<AlertCircleIcon className="w-5 h-5 text-danger-500" />
					<p className="text-danger-600 text-sm mt-1">{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Organization Information Card */}
				<Card className="w-full p-6" shadow="none">
					<CardHeader>
						<h2 className="text-lg font-medium text-gray-900">
							Organization Information
						</h2>
					</CardHeader>
					<CardBody className="space-y-4">
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
							placeholder="+91XXXXXXXXXX"
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
					<CardBody className="space-y-4">
						<Textarea
							{...register("address.line1")}
							label="Street Address"
							placeholder="Enter complete street address"
							isInvalid={!!errors.address?.line1}
							errorMessage={errors.address?.line1?.message}
						/>
						<Textarea
							{...register("address.line2")}
							label="Street Address"
							placeholder="Enter complete street address"
							isInvalid={!!errors.address?.line2}
							errorMessage={errors.address?.line2?.message}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								{...register("address.city")}
								label="City"
								placeholder="Enter city"
								isInvalid={!!errors.address?.city}
								errorMessage={errors.address?.city?.message}
							/>

							<Input
								{...register("address.state")}
								label="State"
								placeholder="Enter state"
								isInvalid={!!errors.address?.state}
								errorMessage={errors.address?.state?.message}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								{...register("address.pincode")}
								label="Postal Code"
								placeholder="Enter 6-digit postal code"
								isInvalid={!!errors.address?.pincode}
								errorMessage={errors.address?.pincode?.message}
							/>

							<Input
								{...register("address.country")}
								label="Country"
								placeholder="Enter country"
								isInvalid={!!errors.address?.country}
								errorMessage={errors.address?.country?.message}
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
					<CardBody className="space-y-4">
						<Controller
							name="businessProofType"
							control={control}
							render={({ field }) => (
								<Select
									label="Business Proof Type"
									selectedKeys={[field.value]}
									onSelectionChange={(keys) => {
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

						<div>
							<label
								htmlFor="businessProofFile"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Business Proof Document
							</label>
							<input
								id="businessProofFile"
								type="file"
								accept=".jpg,.jpeg,.png,.pdf"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										setValue("businessProofFile", file);
									}
								}}
								className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
							/>
							{errors.businessProofFile && (
								<p className="text-danger-600 text-sm mt-1">
									{errors.businessProofFile.message}
								</p>
							)}
						</div>
					</CardBody>
				</Card>

				{/* Address Proof Card */}
				<Card className="w-full p-6" shadow="none">
					<CardHeader>
						<h2 className="text-lg font-medium text-gray-900">Address Proof</h2>
					</CardHeader>
					<CardBody className="space-y-4">
						<Controller
							name="addressProofType"
							control={control}
							render={({ field }) => (
								<Select
									label="Address Proof Type"
									selectedKeys={[field.value]}
									onSelectionChange={(keys) => {
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

						<div>
							<label
								htmlFor="addressProofFile"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Address Proof Document
							</label>
							<input
								id="addressProofFile"
								type="file"
								accept=".jpg,.jpeg,.png,.pdf"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										setValue("addressProofFile", file);
									}
								}}
								className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
							/>
							{errors.addressProofFile && (
								<p className="text-danger-600 text-sm mt-1">
									{errors.addressProofFile.message}
								</p>
							)}
						</div>
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

import type { UpdateOrganizationFormFragment$key } from "@/__generated__/UpdateOrganizationFormFragment.graphql";
import type { UpdateOrganizationFormLogoPresignedUrlMutation } from "@/__generated__/UpdateOrganizationFormLogoPresignedUrlMutation.graphql";
import type { UpdateOrganizationFormMutation as UpdateOrganizationFormMutationType } from "@/__generated__/UpdateOrganizationFormMutation.graphql";
import { uploadFileToS3 } from "@/lib/presignedUrl";
import { Button, Card, CardBody, CardFooter, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";

const UpdateOrganizationFormMutation = graphql`
mutation UpdateOrganizationFormMutation($organizationId: ID!, $name: String!, $slug: String!, $address: AddressInput!, $website: String, $logoUrl: String, $description: String) {
	updateOrganization(organizationId: $organizationId, name: $name, slug: $slug, address: $address, website: $website, logoUrl: $logoUrl, description: $description) {
		__typename
		...on Organization {
			id
			...UpdateOrganizationFormFragment
		}
        ... on OrganizationNotFoundError {
            __typename
        }
        ... on OrganizationSlugInUseError {
            __typename
			message
        }
	}
}
`;

const CreateOrganizationLogoPresignedUrlMutation = graphql`
mutation UpdateOrganizationFormLogoPresignedUrlMutation {
	createOrganizationLogoPresignedUrl {
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
	address {
		city
		country
		line1
		line2
		pincode
		state
	}
  }
`;

type Props = {
	rootQuery: UpdateOrganizationFormFragment$key;
};

const formSchema = z.object({
	name: z.string().min(1, { message: "Organization name is required" }),
	slug: z.string().min(1, { message: "Slug is required" }),
	website: z.string().url({ message: "Invalid URL" }).optional().nullable(),
	description: z.string().optional().nullable(),
	address: z.object({
		city: z.string().nullable(),
		country: z.string().nullable(),
		line1: z.string().nullable(),
		line2: z.string().nullable(),
		pincode: z.string().nullable(),
		state: z.string().nullable(),
	}),
});

export default function UpdateOrganizationForm({ rootQuery }: Props) {
	const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
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
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: data.name,
			slug: data.slug,
			website: data.website ?? null,
			description: data.description ?? null,
			address: {
				city: data.address.city ?? null,
				country: data.address.country ?? null,
				line1: data.address.line1 ?? null,
				line2: data.address.line2 ?? null,
				pincode: data.address.pincode ?? null,
				state: data.address.state ?? null,
			},
		},
	});

	async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files?.[0]) {
			setSelectedLogo(event.target.files[0]);
		}
	}

	function getPresignedUrl(): Promise<string | null> {
		return new Promise((resolve, reject) => {
			commitCreateOrganizationLogoPresignedUrlMutation({
				variables: {},
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
			const presignedUrl = await getPresignedUrl();
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
				address: {
					city: formData.address.city || null,
					country: formData.address.country || null,
					line1: formData.address.line1 || null,
					line2: formData.address.line2 || null,
					pincode: formData.address.pincode || null,
					state: formData.address.state || null,
				},
			},
			onCompleted(response) {
				if (response.updateOrganization.__typename === "Organization") {
					// Handle successful update
				} else if (
					response.updateOrganization.__typename === "OrganizationNotFoundError"
				) {
					// Handle organization not found error
				} else if (
					response.updateOrganization.__typename ===
					"OrganizationSlugInUseError"
				) {
					// Handle slug in use error
					setError("slug", {
						message: response.updateOrganization.message,
					});
				}
			},
		});
	}

	return (
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
										label="Slug"
										placeholder="Add slug"
										errorMessage={errors.slug?.message}
										isInvalid={!!errors.slug}
									/>
								)}
							/>
						</div>
						<div className="flex flex-col gap-2 flex-shrink-0">
							<p className="text-tiny text-foreground-500">Organization Logo</p>
							<div className="flex flex-col items-start gap-4">
								<Image
									src={
										selectedLogo
											? URL.createObjectURL(selectedLogo)
											: data.logoUrl
									}
									alt="Organization Logo"
									className="object-cover rounded-md border"
									height={120}
									width={120}
								/>
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

					<div className="flex flex-col gap-4">
						<p className="text-xs text-foreground-500 px-2">Address</p>

						<div className="flex gap-8">
							<div className="flex flex-col w-full gap-8">
								<Controller
									name="address.city"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="City"
											placeholder="Add your city"
											value={field.value ?? ""}
											errorMessage={errors.address?.city?.message}
											isInvalid={!!errors.address?.city}
										/>
									)}
								/>
								<Controller
									name="address.country"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="Country"
											placeholder="Add your country"
											value={field.value ?? ""}
											errorMessage={errors.address?.country?.message}
											isInvalid={!!errors.address?.country}
										/>
									)}
								/>
								<Controller
									name="address.pincode"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="Pincode"
											placeholder="Add your pincode"
											value={field.value ?? ""}
											errorMessage={errors.address?.pincode?.message}
											isInvalid={!!errors.address?.pincode}
										/>
									)}
								/>
							</div>
							<div className="flex flex-col w-full gap-8">
								<Controller
									name="address.line1"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="Line 1"
											placeholder="Add line 1"
											value={field.value ?? ""}
											errorMessage={errors.address?.line1?.message}
											isInvalid={!!errors.address?.line1}
										/>
									)}
								/>
								<Controller
									name="address.line2"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="Line 2"
											placeholder="Add line 2"
											value={field.value ?? ""}
											errorMessage={errors.address?.line2?.message}
											isInvalid={!!errors.address?.line2}
										/>
									)}
								/>
								<Controller
									name="address.state"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="State"
											placeholder="Add your state"
											value={field.value ?? ""}
											errorMessage={errors.address?.state?.message}
											isInvalid={!!errors.address?.state}
										/>
									)}
								/>
							</div>
						</div>
					</div>
				</CardBody>
				<CardFooter>
					<Button
						type="submit"
						color="primary"
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
	);
}

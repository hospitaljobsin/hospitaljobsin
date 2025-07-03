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
	addToast,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Image from "next/image";
import { useState } from "react";
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
		if (event.target.files?.[0]) {
			setSelectedLogo(event.target.files[0]);
		}
	}

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
							<p className="text-tiny text-foreground-500">Organization Logo</p>
							<div className="flex flex-col items-start gap-4">
								<div className="relative w-28 h-28">
									<Image
										src={
											selectedLogo
												? URL.createObjectURL(selectedLogo)
												: data.logoUrl
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
	);
}

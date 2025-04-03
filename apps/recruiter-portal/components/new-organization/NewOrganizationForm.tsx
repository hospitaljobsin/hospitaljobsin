"use client";
import type { NewOrganizationFormLogoPresignedUrlMutation } from "@/__generated__/NewOrganizationFormLogoPresignedUrlMutation.graphql";
import type { NewOrganizationFormMutation } from "@/__generated__/NewOrganizationFormMutation.graphql";
import links from "@/lib/links";
import { uploadFileToS3 } from "@/lib/presignedUrl";
import { useRouter } from "@bprogress/next";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Input,
	Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";

const CreateOrganizationMutation = graphql`
mutation NewOrganizationFormMutation($fullName: String!, $slug: String!, $website: String, $description: String, $logoUrl: String) {
    createOrganization(fullName: $fullName, slug: $slug, website: $website, description: $description, logoUrl: $logoUrl) {
		__typename
        ...on Organization {
            __typename
			slug
        }
		... on OrganizationSlugInUseError {
			message
		}
    }
}
`;

const CreateOrganizationLogoPresignedUrlMutation = graphql`
mutation NewOrganizationFormLogoPresignedUrlMutation {
	createOrganizationLogoPresignedUrl {
		presignedUrl
	}
}
`;

const formSchema = z.object({
	fullName: z.string().min(1, "This field is required").max(75),
	slug: z
		.string()
		.min(1, "This field is required")
		.max(75)
		.regex(/^[a-z0-9-]+$/, "Must be a valid slug")
		.refine((value) => value === value.toLowerCase(), "Must be lowercase"),
	website: z.string().url().nullable(),
	description: z.string().nullable(),
});

export default function NewOrganizationForm() {
	const router = useRouter();
	const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

	const [
		commitCreateOrganizationMutation,
		isCreateOrganizationMutationInflight,
	] = useMutation<NewOrganizationFormMutation>(CreateOrganizationMutation);

	const [
		commitCreateOrganizationLogoPresignedUrlMutation,
		isCreateOrganizationLogoPresignedUrlMutationInflight,
	] = useMutation<NewOrganizationFormLogoPresignedUrlMutation>(
		CreateOrganizationLogoPresignedUrlMutation,
	);

	const {
		handleSubmit,
		control,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			slug: "",
			website: null,
			description: null,
		},
	});

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
		let logoUrlResult: string | null = null;
		if (selectedLogo) {
			const presignedUrl = await getPresignedUrl();
			if (presignedUrl) {
				await uploadFileToS3(presignedUrl, selectedLogo);
				// Extract the URL from the presignedUrl
				logoUrlResult = presignedUrl.split("?")[0];
			}
		}
		try {
			commitCreateOrganizationMutation({
				variables: {
					fullName: formData.fullName,
					slug: formData.slug,
					website: formData.website,
					description: formData.description,
					logoUrl: logoUrlResult,
				},
				onCompleted(response) {
					if (
						response.createOrganization.__typename ===
						"OrganizationSlugInUseError"
					) {
						setError("slug", { message: response.createOrganization.message });
					} else if (
						response.createOrganization.__typename === "Organization"
					) {
						// Redirect to the organization detail page
						router.push(
							links.organizationDetail(response.createOrganization.slug),
						);
					}
				},
				onError: (error) => {
					console.error("Error creating organization:", error);
				},
			});
		} catch (error) {
			console.error("Error in onSubmit:", error);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<h2 className="text-lg font-medium mt-1 text-foreground-400">
				Create new organization
			</h2>
			<Card shadow="none" className="p-6 gap-8">
				<CardBody className="flex flex-col gap-8">
					<Controller
						name="fullName"
						control={control}
						render={({ field }) => (
							<Input
								{...field}
								label="Organization Full Name"
								labelPlacement="outside"
								placeholder="My Organization Name"
								value={field.value}
								errorMessage={errors.fullName?.message}
								isInvalid={!!errors.fullName}
								isRequired
								validationBehavior="aria"
							/>
						)}
					/>
					<Controller
						name="slug"
						control={control}
						render={({ field }) => (
							<Input
								{...field}
								label="Organization Slug"
								labelPlacement="outside"
								placeholder="my-organization-slug"
								value={field.value}
								errorMessage={errors.slug?.message}
								isInvalid={!!errors.slug}
								isRequired
								validationBehavior="aria"
							/>
						)}
					/>
					<div className="flex gap-12 w-full items-center">
						<Input
							label="Organization Logo"
							labelPlacement="outside"
							type="file"
							accept="image/*"
							placeholder="Upload Organization Logo"
							onChange={(e) => {
								if (e.target.files && e.target.files.length > 0) {
									setSelectedLogo(e.target.files[0]);
								}
							}}
						/>
						<Controller
							name="website"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									label="Organization Website"
									labelPlacement="outside"
									type="url"
									placeholder="https://example.com"
									value={field.value || ""}
									errorMessage={errors.website?.message}
									isInvalid={!!errors.website}
								/>
							)}
						/>
					</div>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<Textarea
								{...field}
								label="Organization Description"
								labelPlacement="outside"
								placeholder="Enter Organization Description"
								value={field.value || ""}
								errorMessage={errors.description?.message}
								isInvalid={!!errors.description}
							/>
						)}
					/>
				</CardBody>
				<CardFooter>
					<Button
						type="submit"
						fullWidth
						isLoading={
							isSubmitting ||
							isCreateOrganizationMutationInflight ||
							isCreateOrganizationLogoPresignedUrlMutationInflight
						}
						size="lg"
					>
						Create Organization
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}

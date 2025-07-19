"use client";
import type { NewOrganizationFormLogoPresignedUrlMutation } from "@/__generated__/NewOrganizationFormLogoPresignedUrlMutation.graphql";
import type { NewOrganizationFormMutation } from "@/__generated__/NewOrganizationFormMutation.graphql";
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
	Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
mutation NewOrganizationFormLogoPresignedUrlMutation($contentType: String!) {
	createOrganizationLogoPresignedUrl(contentType: $contentType) {
		presignedUrl
	}
}
`;

const formSchema = z.object({
	fullName: z
		.string()
		.min(1, { message: "This field is required" })
		.max(75, { message: "This field must be less than 75 characters" }),
	slug: z
		.string()
		.min(1, { message: "This field is required" })
		.max(75, { message: "This field must be less than 75 characters" })
		.regex(/^[a-z0-9-]+$/, { message: "Must be a valid slug" })
		.refine((value) => value === value.toLowerCase(), {
			message: "Must be lowercase",
		}),
	website: z.union([z.string().url({ message: "Invalid URL" }), z.literal("")]),
	description: z.nullable(
		z
			.string()
			.max(1024, { message: "Description must be less than 1024 characters" }),
	),
});

export default function NewOrganizationForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const defaultSlug = searchParams.get("slug");
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
		setError,
		register,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			slug: defaultSlug || "",
			website: "",
			description: "",
		},
		mode: "onChange",
	});

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
		let logoUrlResult: string | null = null;
		if (selectedLogo) {
			const presignedUrl = await getPresignedUrl(selectedLogo);
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
					website: formData.website ?? null,
					description: formData.description ?? null,
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
					<Input
						{...register("fullName")}
						label="Organization Full Name"
						labelPlacement="outside"
						placeholder="My Organization Name"
						errorMessage={errors.fullName?.message}
						isInvalid={!!errors.fullName}
						isRequired
						validationBehavior="aria"
					/>
					<Input
						{...register("slug")}
						label="Subdomain"
						labelPlacement="outside"
						placeholder="my-company"
						endContent={
							<span className="text-default-400 text-md">
								.{env.NEXT_PUBLIC_ROOT_DOMAIN}
							</span>
						}
						description={<p>A unique subdomain for your organization</p>}
						errorMessage={errors.slug?.message}
						isInvalid={!!errors.slug}
						isRequired
						validationBehavior="aria"
					/>
					<div className="flex flex-col sm:flex-row gap-12 w-full items-start">
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
						<Input
							{...register("website")}
							label="Organization Website"
							labelPlacement="outside"
							type="url"
							placeholder="https://example.com"
							errorMessage={errors.website?.message}
							isInvalid={!!errors.website}
							validationBehavior="aria"
						/>
					</div>
					<Textarea
						{...register("description")}
						label="Organization Description"
						labelPlacement="outside"
						placeholder="Enter Organization Description"
						errorMessage={errors.description?.message}
						isInvalid={!!errors.description}
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

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
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";

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
	fullName: z.string().check(z.minLength(1, "This field is required"), z.maxLength(75)),
	slug: z.string().check(z.minLength(1, "This field is required"), z.maxLength(75), z.regex(/^[a-z0-9-]+$/, "Must be a valid slug"), z.refine((value) => value === value.toLowerCase(), "Must be lowercase")),
	website: z.union([z.nullish(z.string().check(z.url("Invalid URL"))), z.literal("")]),
	description: z.nullable(z.string()),
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
		setError,
		register,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: {
			fullName: "",
			slug: "",
			website: "",
			description: "",
		},
		mode: "onChange",
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
					website: formData.website || null,
					description: formData.description || null,
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
						label="Organization Slug"
						labelPlacement="outside"
						placeholder="my-company"
						description={
							<p>
								A unique name for your organization used in URLs (like{" "}
								{env.NEXT_PUBLIC_URL.split("//")[1]}/<b>my-company</b>)
							</p>
						}
						errorMessage={errors.slug?.message}
						isInvalid={!!errors.slug}
						isRequired
						validationBehavior="aria"
					/>
					<div className="flex gap-12 w-full items-start">
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

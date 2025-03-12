"use client";
import type { NewOrganizationFormMutation } from "@/__generated__/NewOrganizationFormMutation.graphql";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Input,
	Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";

const CreateOrganizationMutation = graphql`
mutation NewOrganizationFormMutation($fullName: String!, $slug: String!, $website: String, $description: String) {
    createOrganization(fullName: $fullName, slug: $slug, website: $website, description: $description) {
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
	const [commitMutation, isMutationInFlight] =
		useMutation<NewOrganizationFormMutation>(CreateOrganizationMutation);
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

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				fullName: formData.fullName,
				slug: formData.slug,
				website: formData.website,
				description: formData.description,
			},
			onCompleted(response) {
				if (
					response.createOrganization.__typename ===
					"OrganizationSlugInUseError"
				) {
					setError("slug", { message: response.createOrganization.message });
				} else if (response.createOrganization.__typename === "Organization") {
					// Redirect to the organization detail page
					router.push(
						links.organizationDetail(response.createOrganization.slug),
					);
				}
			},
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
			<Card shadow="none" className="p-6 gap-8">
				<CardHeader>Create an Organization</CardHeader>
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
							/>
						)}
					/>
					<div className="flex gap-12 w-full items-center">
						<Input
							label="Organization Logo"
							labelPlacement="outside"
							type="file"
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
						isLoading={isSubmitting || isMutationInFlight}
						size="lg"
					>
						Create Organization
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}

import type { UpdateOrganizationFormFragment$key } from "@/__generated__/UpdateOrganizationFormFragment.graphql";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";

const UpdateOrganizationFormMutation = graphql`
mutation UpdateOrganizationFormMutation($organizationId: ID!, $name: String!, $slug: String!, $address: AddressInput!, $website: String, $logoUrl: String, $description: String) {
	updateOrganization(organizationId: $organizationId, name: $name, slug: $slug, address: $address, website: $website, logoUrl: $logoUrl, description: $description) {
		...on Organization {
			...UpdateOrganizationFormFragment
		}
        ... on OrganizationNotFoundError {
            __typename
        }
        ... on OrganizationSlugInUseError {
            __typename
        }
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
	logoUrl: z.string().url({ message: "Invalid URL" }).optional().nullable(),
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
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdateOrganizationFormMutation,
	);
	const data = useFragment(UpdateOrganizationFormFragment, rootQuery);

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: data.name,
			slug: data.slug,
			website: data.website ?? null,
			logoUrl: data.logoUrl ?? null,
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

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				organizationId: data.id,
				name: formData.name,
				slug: formData.slug,
				website: formData.website || null,
				logoUrl: formData.logoUrl || null,
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
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-12 w-full">
			<Card className="p-6 space-y-6" shadow="none">
				<CardBody>
					<div className="mb-12">
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
					</div>
					<div className="mb-12">
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
							name="logoUrl"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									fullWidth
									label="Logo URL"
									placeholder="Add logo URL"
									errorMessage={errors.logoUrl?.message}
									isInvalid={!!errors.logoUrl}
									value={field.value || ""}
								/>
							)}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<p className="text-xs text-foreground-500 px-2">Address</p>

						<div className="flex gap-8 mb-12">
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
			</Card>

			<div className="mt-4 flex justify-end gap-6">
				<Button type="submit" isLoading={isSubmitting || isMutationInFlight}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}

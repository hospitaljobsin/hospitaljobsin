"use client";
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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	fullName: z.string().min(1, "This field is required").max(75),
	slug: z.string().min(1, "This field is required").max(75),
	website: z.string().url().optional(),
	description: z.string().optional(),
});

export default function NewOrganizationForm() {
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			slug: "",
			website: "",
			description: "",
		},
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		console.log(formData);
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
									placeholder="https://example.com"
									value={field.value}
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
								value={field.value}
								errorMessage={errors.description?.message}
								isInvalid={!!errors.description}
							/>
						)}
					/>
				</CardBody>
				<CardFooter>
					<Button type="submit" fullWidth isLoading={isSubmitting}>
						Create Organization
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}

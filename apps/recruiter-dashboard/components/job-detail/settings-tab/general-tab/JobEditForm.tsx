"use client";
import type { JobEditFormFragment$key } from "@/__generated__/JobEditFormFragment.graphql";
import type { JobEditFormMutation } from "@/__generated__/JobEditFormMutation.graphql";
import { ChipsInput } from "@/components/forms/ChipsInput";
import LocationAutocomplete from "@/components/forms/LocationAutocomplete";
import MarkdownEditor from "@/components/forms/text-editor/MarkdownEditor";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import {
	Accordion,
	AccordionItem,
	Button,
	Card,
	CardBody,
	CardFooter,
	DatePicker,
	Input,
	Kbd,
	Link,
	NumberInput,
	Radio,
	RadioGroup,
	addToast,
	cn,
	useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	CalendarDateTime,
	parseAbsoluteToLocal,
} from "@internationalized/date";
import type { Key } from "@react-types/shared";
import {
	BriefcaseBusiness,
	IndianRupee,
	MapPin,
	TimerIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";
import CancelEditJobModal from "./CancelEditJobModal";

const JobEditFormFragment = graphql`
  fragment JobEditFormFragment on Job {
	id
    slug
	title
	description
	minExperience
	maxExperience
	minSalary
	maxSalary
	vacancies
	skills
	type
	workMode
	expiresAt
	location
	...CancelEditJobModalJobFragment
}`;

const UpdateJobMutation = graphql`
mutation JobEditFormMutation(
    $title: String!,
    $description: String!,
    $skills: [String!]!,
    $location: String,
    $jobId: ID!,
    $minSalary: Int,
    $maxSalary: Int,
    $minExperience: Int,
    $maxExperience: Int,
    $expiresAt: DateTime,
    $workMode: WorkMode,
    $jobType: JobType,
    $vacancies: Int
) {
    updateJob(
        title: $title,
        description: $description,
        skills: $skills,
        location: $location,
        jobId: $jobId,
        minSalary: $minSalary,
        maxSalary: $maxSalary,
        minExperience: $minExperience,
        maxExperience: $maxExperience,
        expiresAt: $expiresAt,
        workMode: $workMode,
        jobType: $jobType,
        vacancies: $vacancies
    ) {
        __typename
        ...on UpdateJobSuccess {
            __typename
            job {
                slug
				...JobTabsFragment
				...JobControlsFragment
				...JobDetailsFragment
				...JobFragment
				...JobEditFormFragment
            }
        }

        ... on JobNotFoundError {
            __typename
        }

        ... on OrganizationAuthorizationError {
            __typename
        }
    }
}
`;

const formSchema = z.object({
	title: z.string().min(1, "This field is required").max(75),
	description: z.string().min(1, "This field is required").max(2000),
	vacancies: z.number().positive().nullable(),
	skills: z.array(z.object({ value: z.string() })),
	location: z.string().nullable(),
	minSalary: z.number().positive().nullable(),
	maxSalary: z.number().positive().nullable(),
	minExperience: z.number().positive().nullable(),
	maxExperience: z.number().positive().nullable(),
	expiresAt: z.instanceof(CalendarDateTime).nullable(),
	jobType: z
		.enum(["CONTRACT", "FULL_TIME", "INTERNSHIP", "PART_TIME"])
		.nullable(),
	workMode: z.enum(["HYBRID", "OFFICE", "REMOTE"]).nullable(),
});

type Props = {
	rootQuery: JobEditFormFragment$key;
};

export default function JobEditForm({ rootQuery }: Props) {
	const router = useRouter();
	const { isOpen, onOpenChange, onOpen } = useDisclosure();

	const jobData = useFragment(JobEditFormFragment, rootQuery);

	const [commitMutation, isMutationInFlight] =
		useMutation<JobEditFormMutation>(UpdateJobMutation);

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		reValidateMode: "onChange",
		defaultValues: {
			title: jobData.title,
			description: jobData.description ?? "",
			vacancies: jobData.vacancies,
			skills: jobData.skills.map((skill) => ({
				value: skill,
			})),
			location: jobData.location,
			minSalary: jobData.minSalary,
			maxSalary: jobData.maxSalary,
			minExperience: jobData.minExperience,
			maxExperience: jobData.maxExperience,
			expiresAt: jobData.expiresAt
				? parseAbsoluteToLocal(jobData.expiresAt)
				: null,
			jobType: jobData.type ? jobData.type.toString() : null,
			workMode: jobData.workMode ? jobData.workMode.toString() : null,
		},
	});

	// Track which accordions should be open
	const [accordionSelectedKeys, setAccordionSelectedKeys] = useState<
		Iterable<Key>
	>(new Set([]));

	// Update accordions when errors change
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const newOpenAccordions = new Set<Key>([...accordionSelectedKeys]);

		if (errors.location) {
			newOpenAccordions.add("address");
		}
		if (errors.minSalary || errors.maxSalary) {
			newOpenAccordions.add("salary-range");
		}
		if (errors.minExperience || errors.maxExperience) {
			newOpenAccordions.add("experience-range");
		}
		if (errors.expiresAt) {
			newOpenAccordions.add("expires-at");
		}

		setAccordionSelectedKeys(newOpenAccordions);
	}, [errors]);

	function handleCancel() {
		if (isDirty) {
			// show confirmation modal
			onOpen();
		} else {
			router.push(links.organizationJobDetail(jobData.slug));
		}
	}

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				jobId: jobData.id,
				title: formData.title,
				description: formData.description,
				vacancies: formData.vacancies,
				skills: formData.skills.flatMap((skill) => skill.value),
				location: formData.location,
				minSalary: formData.minSalary,
				maxSalary: formData.maxSalary,
				minExperience: formData.minExperience,
				maxExperience: formData.maxExperience,
				expiresAt: formData.expiresAt ? formData.expiresAt.toString() : null,
				jobType: formData.jobType,
				workMode: formData.workMode,
			},
			onCompleted(response) {
				if (response.updateJob.__typename === "JobNotFoundError") {
					addToast({
						color: "danger",
						title: "An unexpected error occurred. Please try again.",
					});
				} else if (response.updateJob.__typename === "UpdateJobSuccess") {
					// handle success
					router.push(links.jobDetailSettings(response.updateJob.job.slug));
				} else if (
					response.updateJob.__typename === "OrganizationAuthorizationError"
				) {
					addToast({
						color: "danger",
						title: "You are not authorized to perform this action.",
					});
				}
			},
		});
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
				<Card shadow="none" className="p-6 gap-12 flex flex-col">
					<CardBody className="flex flex-col gap-12 overflow-y-hidden">
						<Input
							{...register("title")}
							label="Job Title"
							labelPlacement="outside"
							placeholder="My Job Title"
							errorMessage={errors.title?.message}
							isInvalid={!!errors.title}
							isRequired
							validationBehavior="aria"
						/>
						<Controller
							control={control}
							name="description"
							render={({ field }) => (
								<div className="flex flex-col gap-4 w-full">
									<h2
										className={cn("text-small inline-flex gap-0.5", {
											"text-danger": errors.description,
										})}
									>
										Job Description <p className="text-danger">*</p>
									</h2>
									<MarkdownEditor
										initialValue={field.value}
										onValueChange={(value) => {
											field.onChange(value);
										}}
										isInvalid={errors.description != null}
										description={
											errors.description ? (
												<p className="text-tiny text-danger">
													{errors.description.message}
												</p>
											) : (
												<p className="text-tiny text-foreground-400">
													Markdown editing is supported.{" "}
													<Link
														isExternal
														showAnchorIcon
														href="https://www.markdownguide.org/getting-started/"
														size="sm"
														className="text-tiny"
													>
														Learn more
													</Link>
												</p>
											)
										}
									/>
								</div>
							)}
						/>

						<ChipsInput<z.infer<typeof formSchema>, "skills">
							name="skills"
							label="Job Skills"
							delimiters={[",", "Enter"]}
							control={control}
							chipProps={{
								variant: "flat",
							}}
							inputProps={{
								placeholder: "Enter skills...",
								description: (
									<p className="mt-2">
										Separate skills with commas or Enter{" "}
										<Kbd
											keys={["enter"]}
											classNames={{ base: "p-0 px-2 shadow-none" }}
										/>
									</p>
								),
							}}
						/>
						<Controller
							control={control}
							name="vacancies"
							render={({ field }) => {
								return (
									<NumberInput
										errorMessage={errors.vacancies?.message}
										isInvalid={!!errors.vacancies}
										label="Vacancies"
										placeholder="Enter vacancies"
										labelPlacement="outside"
										value={field.value || 0}
										onValueChange={(value) => {
											field.onChange(value);
										}}
									/>
								);
							}}
						/>
						<div className="w-full flex flex-col sm:flex-row gap-12 items-start justify-start">
							{/* Job Type */}
							<Controller
								control={control}
								name="jobType"
								render={({ field }) => {
									return (
										<RadioGroup
											label="Select Job Type"
											value={field.value}
											onValueChange={field.onChange}
											className="flex-1 w-full"
										>
											<Radio value="CONTRACT">Contract</Radio>
											<Radio value="FULL_TIME">Full Time</Radio>
											<Radio value="INTERNSHIP">Internship</Radio>
											<Radio value="PART_TIME">Part Time</Radio>
										</RadioGroup>
									);
								}}
							/>
							{/* Work Mode */}
							<Controller
								control={control}
								name="workMode"
								render={({ field }) => {
									return (
										<RadioGroup
											label="Select Work Mode"
											value={field.value}
											onValueChange={field.onChange}
											className="flex-1 w-full"
										>
											<Radio value="HYBRID">Hybrid</Radio>
											<Radio value="OFFICE">Office</Radio>
											<Radio value="REMOTE">Remote</Radio>
										</RadioGroup>
									);
								}}
							/>
						</div>
						<Accordion
							selectionMode="multiple"
							variant="light"
							keepContentMounted
							fullWidth
							itemClasses={{ base: "pb-8" }}
							selectedKeys={accordionSelectedKeys}
							onSelectionChange={(keys) => {
								setAccordionSelectedKeys(keys);
							}}
						>
							<AccordionItem
								key="salary-range"
								aria-label="Salary range"
								title="Salary range"
								startContent={<IndianRupee size={20} />}
							>
								<div className="w-full flex gap-6 items-start">
									<Controller
										control={control}
										name="minSalary"
										render={({ field }) => {
											return (
												<NumberInput
													errorMessage={errors.minSalary?.message}
													isInvalid={!!errors.minSalary}
													label="Minimum Salary"
													placeholder="Enter minimum salary"
													formatOptions={{
														style: "currency",
														currency: "INR",
														currencyDisplay: "code",
														currencySign: "accounting",
													}}
													value={field.value || 0}
													onValueChange={(value) => {
														field.onChange(value);
													}}
												/>
											);
										}}
									/>
									<Controller
										control={control}
										name="maxSalary"
										render={({ field }) => {
											return (
												<NumberInput
													errorMessage={errors.maxSalary?.message}
													isInvalid={!!errors.maxSalary}
													label="Maximum Salary"
													placeholder="Enter maximum salary"
													formatOptions={{
														style: "currency",
														currency: "INR",
														currencyDisplay: "code",
														currencySign: "accounting",
													}}
													value={field.value || 0}
													onValueChange={(value) => {
														field.onChange(value);
													}}
												/>
											);
										}}
									/>
								</div>
							</AccordionItem>
							<AccordionItem
								key="experience-range"
								aria-label="Experience range"
								title="Experience range"
								startContent={<BriefcaseBusiness size={20} />}
							>
								<div className="w-full flex gap-6 items-start">
									<Controller
										control={control}
										name="minExperience"
										render={({ field }) => {
											return (
												<NumberInput
													errorMessage={errors.minExperience?.message}
													isInvalid={!!errors.minExperience}
													label="Minimum Experience"
													placeholder="Enter minimum experience"
													formatOptions={{
														style: "unit",
														unit: "year",
														unitDisplay: "long",
													}}
													value={field.value || 0}
													onValueChange={(value) => {
														field.onChange(value);
													}}
												/>
											);
										}}
									/>
									<Controller
										control={control}
										name="maxExperience"
										render={({ field }) => {
											return (
												<NumberInput
													errorMessage={errors.maxExperience?.message}
													isInvalid={!!errors.maxExperience}
													label="Maximum Experience"
													placeholder="Enter maximum experience"
													formatOptions={{
														style: "unit",
														unit: "year",
														unitDisplay: "long",
													}}
													value={field.value || 0}
													onValueChange={(value) => {
														field.onChange(value);
													}}
												/>
											);
										}}
									/>
								</div>
							</AccordionItem>
							<AccordionItem
								key="expires-at"
								aria-label="Posting expires at"
								title="Posting expires at"
								startContent={<TimerIcon size={20} />}
							>
								<Controller
									control={control}
									name="expiresAt"
									render={({ field }) => {
										return (
											<DatePicker
												showMonthAndYearPickers
												selectorButtonPlacement="start"
												granularity="hour"
												errorMessage={errors.expiresAt?.message}
												isInvalid={!!errors.expiresAt}
												value={field.value ?? undefined}
												onChange={field.onChange}
											/>
										);
									}}
								/>
							</AccordionItem>
							<AccordionItem
								key="address"
								aria-label="Address"
								title="Address"
								startContent={<MapPin size={20} />}
							>
								<div className="flex flex-col gap-4">
									<Controller
										name="location"
										control={control}
										render={({ field }) => (
											<LocationAutocomplete
												label="Location"
												placeholder="Add job location"
												value={field.value ?? ""}
												onChange={(value) => {
													field.onChange(value.displayName);
												}}
												onValueChange={(value) => {
													field.onChange(value);
												}}
												errorMessage={errors.location?.message}
												isInvalid={!!errors.location}
											/>
										)}
									/>
								</div>
							</AccordionItem>
						</Accordion>
					</CardBody>
					<CardFooter className="w-full justify-end gap-6">
						<Button type="button" variant="bordered" onPress={handleCancel}>
							Cancel
						</Button>
						<Button
							type="submit"
							color="primary"
							isLoading={isSubmitting || isMutationInFlight}
							isDisabled={!isDirty}
						>
							Update Job
						</Button>
					</CardFooter>
				</Card>
			</form>
			<CancelEditJobModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				job={jobData}
			/>
		</>
	);
}

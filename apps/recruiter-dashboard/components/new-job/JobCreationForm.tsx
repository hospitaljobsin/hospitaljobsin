import type { JobCreationFormFragment$key } from "@/__generated__/JobCreationFormFragment.graphql";
import type { JobCreationFormMutation } from "@/__generated__/JobCreationFormMutation.graphql";
import { ChipsInput } from "@/components/forms/ChipsInput";
import LocationAutocomplete from "@/components/forms/LocationAutocomplete";
import MarkdownEditor from "@/components/forms/text-editor/MarkdownEditor";
import {
	Accordion,
	AccordionItem,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	DatePicker,
	Input,
	Kbd,
	NumberInput,
	Radio,
	RadioGroup,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CalendarIdentifier } from "@internationalized/date";
import { CalendarDateTime, createCalendar } from "@internationalized/date";
import type { Key } from "@react-types/shared";
import {
	BriefcaseBusiness,
	IndianRupee,
	MapPin,
	TimerIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";

const jobFormSchema = z.object({
	title: z.string().min(1, "This field is required").max(75),
	description: z.string().min(1, "This field is required").max(2000),
	vacancies: z.number().positive().nullable().optional(),
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

type JobFormValues = z.infer<typeof jobFormSchema>;

const JobCreationFormFragment = graphql`
fragment JobCreationFormFragment on Organization {
	id
}`;

const CreateJobMutation = graphql`
  mutation JobCreationFormMutation(
    $organizationId: ID!,
    $title: String!,
    $description: String!,
    $skills: [String!]!,
    $location: String,
    $minSalary: Int,
    $maxSalary: Int,
    $minExperience: Int,
    $maxExperience: Int,
    $expiresAt: DateTime,
    $jobType: JobType,
    $workMode: WorkMode,
    $vacancies: Int
  ) {
    createJob(
      organizationId: $organizationId,
      title: $title,
      description: $description,
      skills: $skills,
      location: $location,
      minSalary: $minSalary,
      maxSalary: $maxSalary,
      minExperience: $minExperience,
      maxExperience: $maxExperience,
      expiresAt: $expiresAt,
      jobType: $jobType,
      workMode: $workMode,
      vacancies: $vacancies
    ) {
      __typename
      ... on CreateJobSuccess {
        jobEdge {
          node {
            slug
          }
        }
      }
      ... on OrganizationAuthorizationError {
        __typename
      }
      ... on OrganizationNotFoundError {
        __typename
      }
    }
  }
`;

export default function JobCreationForm({
	organization,
	onSuccess,
}: {
	organization: JobCreationFormFragment$key;
	onSuccess: (slug: string) => void;
}) {
	const data = useFragment(JobCreationFormFragment, organization);
	const [commitCreateJob, isCreatingJob] =
		useMutation<JobCreationFormMutation>(CreateJobMutation);
	const {
		handleSubmit,
		register,
		control,
		setError,
		setValue,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<JobFormValues>({
		resolver: zodResolver(jobFormSchema),
		defaultValues: {
			description: "",
			expiresAt: null,
			jobType: undefined,
			workMode: undefined,
			minSalary: null,
			maxSalary: null,
			minExperience: null,
			maxExperience: null,
			location: "",
			skills: [],
			title: "",
			vacancies: null,
		},
	});
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
	}, [
		errors.location,
		errors.minSalary,
		errors.maxSalary,
		errors.minExperience,
		errors.maxExperience,
		errors.expiresAt,
	]);

	// Warn user if form is dirty and they try to leave the page
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (isDirty) {
				e.preventDefault();
				return;
			}
		};
		if (isDirty) {
			window.addEventListener("beforeunload", handleBeforeUnload);
		} else {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		}
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [isDirty]);

	const onSubmit = (formData: JobFormValues) => {
		let hasValidationErrors = false;
		if (
			formData.minSalary != null &&
			formData.maxSalary != null &&
			formData.maxSalary < formData.minSalary
		) {
			setError("maxSalary", {
				message: "Maximum salary cannot be less than minimum salary.",
			});
			hasValidationErrors = true;
		}
		if (
			formData.minExperience != null &&
			formData.maxExperience != null &&
			formData.maxExperience < formData.minExperience
		) {
			setError("maxExperience", {
				message: "Maximum experience cannot be less than minimum experience.",
			});
			hasValidationErrors = true;
		}
		if (hasValidationErrors) {
			return;
		}
		commitCreateJob({
			variables: {
				organizationId: data.id,
				title: formData.title,
				description: formData.description,
				vacancies: formData.vacancies ?? undefined,
				skills: formData.skills.map((s) => s.value),
				location: formData.location ?? undefined,
				minSalary: formData.minSalary ?? undefined,
				maxSalary: formData.maxSalary ?? undefined,
				minExperience: formData.minExperience ?? undefined,
				maxExperience: formData.maxExperience ?? undefined,
				expiresAt: formData.expiresAt
					? formData.expiresAt.toString()
					: undefined,
				jobType: formData.jobType ?? undefined,
				workMode: formData.workMode ?? undefined,
			},
			onCompleted(response) {
				if (response.createJob.__typename === "CreateJobSuccess") {
					onSuccess(response.createJob.jobEdge.node.slug);
				} else {
					// TODO: handle errors
				}
			},
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-6 w-full mt-6 mb-16"
		>
			<Card shadow="none" className="p-6 gap-8 flex flex-col" fullWidth>
				<CardHeader className="text-lg text-foreground-600">
					Create new job
				</CardHeader>
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
									className={`text-small inline-flex gap-0.5${errors.description ? " text-danger" : ""}`}
								>
									Job Description <span className="text-danger">*</span>
								</h2>
								<MarkdownEditor
									initialValue={field.value}
									onValueChange={field.onChange}
									isInvalid={!!errors.description}
									description={
										errors.description ? (
											<p className="text-tiny text-danger">
												{errors.description.message}
											</p>
										) : (
											<p className="text-tiny text-foreground-400">
												Markdown editing is supported.
											</p>
										)
									}
								/>
							</div>
						)}
					/>
					<ChipsInput<JobFormValues, "skills">
						name="skills"
						label="Job Skills"
						delimiters={[",", "Enter"]}
						control={control}
						chipProps={{ variant: "flat" }}
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
						render={({ field }) => (
							<NumberInput
								label="Vacancies"
								placeholder="Enter vacancies"
								labelPlacement="outside"
								size="lg"
								minValue={0}
								value={field.value as number | undefined}
								onValueChange={(value) => {
									if (Number.isNaN(value)) {
										field.onChange(undefined);
									} else {
										field.onChange(value);
									}
								}}
								errorMessage={errors.vacancies?.message}
								isInvalid={!!errors.vacancies}
								isClearable
								hideStepper
							/>
						)}
					/>
					<div className="w-full flex flex-col sm:flex-row gap-12 items-start justify-start">
						<Controller
							control={control}
							name="jobType"
							render={({ field }) => (
								<RadioGroup
									label="Select Job Type"
									value={field.value}
									onValueChange={field.onChange}
									className="flex-1 w-full"
									errorMessage={errors.jobType?.message}
									isInvalid={!!errors.jobType}
								>
									<Radio value="CONTRACT">Contract</Radio>
									<Radio value="FULL_TIME">Full Time</Radio>
									<Radio value="INTERNSHIP">Internship</Radio>
									<Radio value="PART_TIME">Part Time</Radio>
								</RadioGroup>
							)}
						/>
						<Controller
							control={control}
							name="workMode"
							render={({ field }) => (
								<RadioGroup
									label="Select Work Mode"
									value={field.value}
									onValueChange={field.onChange}
									className="flex-1 w-full"
									errorMessage={errors.workMode?.message}
									isInvalid={!!errors.workMode}
								>
									<Radio value="HYBRID">Hybrid</Radio>
									<Radio value="OFFICE">Office</Radio>
									<Radio value="REMOTE">Remote</Radio>
								</RadioGroup>
							)}
						/>
					</div>
					<Accordion
						selectionMode="multiple"
						variant="light"
						keepContentMounted
						fullWidth
						itemClasses={{ base: "pb-8" }}
						selectedKeys={accordionSelectedKeys}
						onSelectionChange={setAccordionSelectedKeys}
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
									render={({ field }) => (
										<div className="flex flex-col gap-2 flex-1">
											<NumberInput
												label="Minimum Salary"
												placeholder="Enter minimum salary"
												formatOptions={{
													style: "currency",
													currency: "INR",
													currencyDisplay: "code",
													currencySign: "accounting",
												}}
												value={field.value as number | undefined}
												onValueChange={(value) => {
													if (Number.isNaN(value) || value === undefined) {
														field.onChange(null);
													} else {
														field.onChange(value);
													}
												}}
												errorMessage={errors.minSalary?.message}
												isInvalid={!!errors.minSalary}
												step={1000}
												isClearable
											/>
										</div>
									)}
								/>
								<Controller
									control={control}
									name="maxSalary"
									render={({ field }) => (
										<div className="flex flex-col gap-2 flex-1">
											<NumberInput
												label="Maximum Salary"
												placeholder="Enter maximum salary"
												formatOptions={{
													style: "currency",
													currency: "INR",
													currencyDisplay: "code",
													currencySign: "accounting",
												}}
												value={field.value as number | undefined}
												onValueChange={(value) => {
													if (Number.isNaN(value) || value === undefined) {
														field.onChange(null);
													} else {
														field.onChange(value);
													}
												}}
												errorMessage={errors.maxSalary?.message}
												isInvalid={!!errors.maxSalary}
												step={1000}
												isClearable
											/>
										</div>
									)}
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
									render={({ field }) => (
										<div className="flex flex-col gap-2 flex-1">
											<NumberInput
												label="Minimum Experience"
												placeholder="Enter minimum experience"
												formatOptions={{
													style: "unit",
													unit: "year",
													unitDisplay: "long",
												}}
												value={field.value as number | undefined}
												onValueChange={(value) => {
													if (Number.isNaN(value) || value === undefined) {
														field.onChange(null);
													} else {
														field.onChange(value);
													}
												}}
												errorMessage={errors.minExperience?.message}
												isInvalid={!!errors.minExperience}
												isClearable
											/>
										</div>
									)}
								/>
								<Controller
									control={control}
									name="maxExperience"
									render={({ field }) => (
										<div className="flex flex-col gap-2 flex-1">
											<NumberInput
												label="Maximum Experience"
												placeholder="Enter maximum experience"
												formatOptions={{
													style: "unit",
													unit: "year",
													unitDisplay: "long",
												}}
												value={field.value as number | undefined}
												onValueChange={(value) => {
													if (Number.isNaN(value) || value === undefined) {
														field.onChange(null);
													} else {
														field.onChange(value);
													}
												}}
												errorMessage={errors.maxExperience?.message}
												isInvalid={!!errors.maxExperience}
												isClearable
											/>
										</div>
									)}
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
								render={({ field }) => (
									<DatePicker
										showMonthAndYearPickers
										selectorButtonPlacement="start"
										granularity="hour"
										errorMessage={errors.expiresAt?.message}
										isInvalid={!!errors.expiresAt}
										value={field.value ?? undefined}
										onChange={(val: unknown) => {
											if (val instanceof CalendarDateTime || val == null) {
												field.onChange(val);
											} else if (
												typeof val === "object" &&
												val !== null &&
												"calendar" in val &&
												"era" in val &&
												"year" in val &&
												"month" in val &&
												"day" in val &&
												"hour" in val &&
												"minute" in val &&
												"second" in val &&
												"millisecond" in val
											) {
												const v = val as {
													calendar?: { identifier: string };
													era: string;
													year: number;
													month: number;
													day: number;
													hour: number;
													minute: number;
													second: number;
													millisecond: number;
												};
												field.onChange(
													new CalendarDateTime(
														createCalendar(
															(v.calendar?.identifier ??
																"gregory") as CalendarIdentifier,
														),
														v.era,
														v.year,
														v.month,
														v.day,
														v.hour,
														v.minute,
														v.second,
														v.millisecond,
													),
												);
											} else {
												field.onChange(null);
											}
										}}
									/>
								)}
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
											onChange={(value) => field.onChange(value.displayName)}
											onValueChange={field.onChange}
											errorMessage={errors.location?.message}
											isInvalid={!!errors.location}
										/>
									)}
								/>
							</div>
						</AccordionItem>
					</Accordion>
				</CardBody>
				<CardFooter>
					<Button
						type="submit"
						color="primary"
						isLoading={isSubmitting || isCreatingJob}
					>
						Create Job
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}

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
	DatePicker,
	Input,
	NumberInput,
	Radio,
	RadioGroup,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDateTime } from "@internationalized/date";
import type { Key } from "@react-types/shared";
import {
	BriefcaseBusiness,
	IndianRupee,
	MapPin,
	TimerIcon,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";

// --- Job Creation Form Schema (reuse from JobEditForm) ---
const jobFormSchema = z.object({
	title: z.string().min(1, "This field is required").max(75),
	description: z.string().min(1, "This field is required").max(2000),
	vacancies: z.number().positive().nullable(),
	skills: z.array(z.object({ value: z.string() })),
	location: z.string().nullable(),
	minSalary: z.number().positive().nullable(),
	maxSalary: z.number().positive().nullable(),
	minExperience: z.number().positive().nullable(),
	maxExperience: z.number().positive().nullable(),
	expiresAt: z
		.custom<CalendarDateTime>((data) => data instanceof CalendarDateTime)
		.nullable(),
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
	defaultValues,
	organization,
	onSuccess,
}: {
	defaultValues: JobFormValues;
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
		formState: { errors, isSubmitting },
	} = useForm<JobFormValues>({
		resolver: zodResolver(jobFormSchema),
		defaultValues,
	});
	const [accordionSelectedKeys, setAccordionSelectedKeys] = useState<
		Iterable<Key>
	>(new Set([]));

	const onSubmit = (formData: JobFormValues) => {
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
				expiresAt: formData.expiresAt ?? undefined,
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
			<Card shadow="none" className="p-6 gap-12 flex flex-col" fullWidth>
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
						inputProps={{ placeholder: "Enter skills..." }}
					/>
					<Controller
						control={control}
						name="vacancies"
						render={({ field }) => (
							<NumberInput
								label="Vacancies"
								placeholder="Enter vacancies"
								labelPlacement="outside"
								value={field.value || 0}
								onValueChange={field.onChange}
								errorMessage={errors.vacancies?.message}
								isInvalid={!!errors.vacancies}
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
										<NumberInput
											label="Minimum Salary"
											placeholder="Enter minimum salary"
											formatOptions={{
												style: "currency",
												currency: "INR",
												currencyDisplay: "code",
												currencySign: "accounting",
											}}
											value={field.value || 0}
											onValueChange={field.onChange}
											errorMessage={errors.minSalary?.message}
											isInvalid={!!errors.minSalary}
										/>
									)}
								/>
								<Controller
									control={control}
									name="maxSalary"
									render={({ field }) => (
										<NumberInput
											label="Maximum Salary"
											placeholder="Enter maximum salary"
											formatOptions={{
												style: "currency",
												currency: "INR",
												currencyDisplay: "code",
												currencySign: "accounting",
											}}
											value={field.value || 0}
											onValueChange={field.onChange}
											errorMessage={errors.maxSalary?.message}
											isInvalid={!!errors.maxSalary}
										/>
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
										<NumberInput
											label="Minimum Experience"
											placeholder="Enter minimum experience"
											formatOptions={{
												style: "unit",
												unit: "year",
												unitDisplay: "long",
											}}
											value={field.value || 0}
											onValueChange={field.onChange}
											errorMessage={errors.minExperience?.message}
											isInvalid={!!errors.minExperience}
										/>
									)}
								/>
								<Controller
									control={control}
									name="maxExperience"
									render={({ field }) => (
										<NumberInput
											label="Maximum Experience"
											placeholder="Enter maximum experience"
											formatOptions={{
												style: "unit",
												unit: "year",
												unitDisplay: "long",
											}}
											value={field.value || 0}
											onValueChange={field.onChange}
											errorMessage={errors.maxExperience?.message}
											isInvalid={!!errors.maxExperience}
										/>
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
										onChange={field.onChange}
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

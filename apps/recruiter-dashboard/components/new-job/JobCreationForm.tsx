import type { JobCreationFormFragment$key } from "@/__generated__/JobCreationFormFragment.graphql";
import type { JobCreationFormMutation } from "@/__generated__/JobCreationFormMutation.graphql";
import { ChipsInput } from "@/components/forms/ChipsInput";
import MarkdownEditor from "@/components/forms/text-editor/MarkdownEditor";
import { Button, Card, CardBody, CardFooter, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
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
	expiresAt: z.string().nullable(),
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
				if (
					response.createJob?.__typename === "CreateJobSuccess" &&
					response.createJob.jobEdge?.node?.slug
				) {
					onSuccess(response.createJob.jobEdge.node.slug);
				} else {
					// TODO: handle errors
				}
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full mt-6">
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
							<Input
								type="number"
								label="Vacancies"
								placeholder="Enter vacancies"
								labelPlacement="outside"
								value={
									field.value !== null && field.value !== undefined
										? String(field.value)
										: ""
								}
								onChange={(e) => field.onChange(Number(e.target.value))}
								errorMessage={errors.vacancies?.message}
								isInvalid={!!errors.vacancies}
							/>
						)}
					/>
					{/* Add other fields (location, salary, experience, jobType, workMode, etc.) as in JobEditForm */}
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

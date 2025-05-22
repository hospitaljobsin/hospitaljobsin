import type { JobApplyFormFragment$key } from "@/__generated__/JobApplyFormFragment.graphql";
import type { JobApplyFormMutation } from "@/__generated__/JobApplyFormMutation.graphql";
import type { JobApplyFormResumePresignedUrlMutation } from "@/__generated__/JobApplyFormResumePresignedUrlMutation.graphql";
import links from "@/lib/links";
import { uploadFileToS3 } from "@/lib/presignedUrl";
import { useRouter } from "@bprogress/next/app";
import { Button, Card, CardFooter, Input, addToast } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4";

const JobApplyFormFragment = graphql`
  fragment JobApplyFormFragment on Job {
    id
    slug
    title
    applicationForm {
      fields {
        fieldName
        defaultValue
        isRequired
      }
    }
    organization @required(action: THROW) {
      name
      logoUrl
	  slug
    }
  }
`;

const CreateJobApplicantResumePresignedUrlMutation = graphql`
mutation JobApplyFormResumePresignedUrlMutation {
	createJobApplicantResumePresignedUrl {
		presignedUrl
	}
}
`;

const CreateJobApplicantMutation = graphql`
  mutation JobApplyFormMutation($jobId: ID!, $applicantFields: [ApplicantFieldInput!]!, $resumeUrl: String!) {
    createJobApplication(jobId: $jobId, applicantFields: $applicantFields, resumeUrl: $resumeUrl) {
      __typename
      ... on CreateJobApplicantSuccess {
        __typename
		jobApplicant {
			job {
				...JobDetailsInternalFragment
			}
		}
      }

      ... on JobNotFoundError {
        __typename
      }

      ... on JobNotPublishedError {
        __typename
      }

      ... on JobApplicantAlreadyExistsError {
        __typename
      }

	  ... on JobIsExternalError {
		__typename
	  }
    }
  }
    `;

const formSchema = z.object({
	applicantFields: z.array(
		z.object({
			fieldValue: z.string().min(1, "This field is required"),
		}),
	),
	resume: z
		.instanceof(File)
		.refine((file) => file && file.size > 0, "Resume is required"),
});

export default function JobApplyForm({
	rootQuery,
}: {
	rootQuery: JobApplyFormFragment$key;
}) {
	const router = useRouter();
	const data = useFragment(JobApplyFormFragment, rootQuery);
	const [commitMutation, isMutationInFlight] =
		useMutation<JobApplyFormMutation>(CreateJobApplicantMutation);

	const [
		commitCreateJobApplicantResumePresignedUrlMutation,
		isCreateJobApplicantResumePresignedUrlMutationInflight,
	] = useMutation<JobApplyFormResumePresignedUrlMutation>(
		CreateJobApplicantResumePresignedUrlMutation,
	);

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
	});

	async function getPresignedUrl(): Promise<string | null> {
		return new Promise((resolve, reject) => {
			commitCreateJobApplicantResumePresignedUrlMutation({
				variables: {},
				onCompleted: (response) => {
					resolve(
						response.createJobApplicantResumePresignedUrl?.presignedUrl || null,
					);
				},
				onError: (error) => {
					console.error("Error fetching presigned URL:", error);
					reject(error);
				},
			});
		});
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const presignedUrl = await getPresignedUrl();
		if (!presignedUrl) {
			setError("resume", { message: "Could not get upload URL. Try again." });
			return;
		}
		await uploadFileToS3(presignedUrl, values.resume);
		const resumeUrlResult = presignedUrl.split("?")[0];
		commitMutation({
			variables: {
				jobId: data.id,
				applicantFields: values.applicantFields.map((field, index) => ({
					fieldName: data.applicationForm?.fields[index].fieldName || "",
					fieldValue: field.fieldValue,
				})),
				resumeUrl: resumeUrlResult,
			},
			onCompleted(response) {
				if (
					response.createJobApplication.__typename ===
					"CreateJobApplicantSuccess"
				) {
					router.push(links.jobDetail(data.organization.slug, data.slug));
				} else {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				}
			},
		});
	}

	return (
		<div className="w-full flex flex-col gap-6">
			<h2 className="text-lg font-medium mt-1 text-foreground-400">
				Apply for {data.title}
			</h2>
			<div className="w-full flex items-center gap-4 text-foreground-400">
				<div className="relative w-8 h-8">
					<Image
						src={data.organization.logoUrl}
						alt={data.organization.name}
						fill
						className="object-cover rounded-full"
					/>
				</div>
				{data.organization.name}
			</div>
			<Card className="p-6" shadow="none">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
					<Input
						type="file"
						label="Resume"
						labelPlacement="outside"
						accept="application/pdf"
						required
						onChange={(e) => {
							if (e.target.files && e.target.files.length > 0) {
								setValue("resume", e.target.files[0]);
							}
						}}
						errorMessage={errors.resume?.message}
						isInvalid={!!errors.resume}
					/>
					<div className="flex flex-col gap-6">
						<h2 className="text-sm">Screening Questions</h2>
						{data.applicationForm?.fields.map((field, index) => (
							<Input
								type="text"
								key={field.fieldName}
								label={field.fieldName}
								labelPlacement="outside"
								isRequired={
									data.applicationForm?.fields[index].isRequired || false
								}
								defaultValue={
									data.applicationForm?.fields[index].defaultValue || ""
								}
								errorMessage={
									errors.applicantFields?.[index]?.fieldValue?.message
								}
								isInvalid={!!errors.applicantFields?.[index]?.fieldValue}
								{...register(`applicantFields.${index}.fieldValue`)}
							/>
						))}
					</div>
					<CardFooter className="w-full justify-end">
						<Button
							type="submit"
							color="primary"
							disabled={isSubmitting}
							className="w-full sm:w-auto"
						>
							Submit Application
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

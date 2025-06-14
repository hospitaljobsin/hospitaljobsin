import type { JobApplyFormFragment$key } from "@/__generated__/JobApplyFormFragment.graphql";
import type { JobApplyFormMutation } from "@/__generated__/JobApplyFormMutation.graphql";
import type { JobApplyFormResumePresignedUrlMutation } from "@/__generated__/JobApplyFormResumePresignedUrlMutation.graphql";
import links from "@/lib/links";
import { uploadFileToS3 } from "@/lib/presignedUrl";
import { useRouter } from "@bprogress/next/app";
import { Button, Card, Input, addToast } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";

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
			fieldValue: z.string().check(z.minLength(1, "This field is required")),
		}),
	),
	resume: z
		.instanceof(File)
		.check(z.refine((file) => file && file.size > 0, "Resume is required")),
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
		getValues,
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
	});

	const [currentStep, setCurrentStep] = useState(0);
	const [reviewMode, setReviewMode] = useState(false);
	const totalQuestions = data.applicationForm?.fields.length || 0;
	const totalSteps = 1 + totalQuestions + 1; // 1 for resume, N for questions, 1 for review

	// Helper for progress
	const progressPercent =
		((reviewMode ? totalSteps : currentStep + 1) / totalSteps) * 100;

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
			{/* Progress Bar */}
			<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
				<div
					className="h-full bg-primary transition-all duration-300"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
			<Card className="p-6" shadow="none">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
					{/* Stepper Logic */}
					{!reviewMode && currentStep === 0 && (
						<div className="flex flex-col gap-6">
							<h2 className="text-md font-medium">Step 1: Upload Resume</h2>
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
							<div className="flex justify-end gap-2">
								<Button
									type="button"
									color="primary"
									onPress={() => setCurrentStep(1)}
									className="w-full sm:w-auto"
								>
									Next
								</Button>
							</div>
						</div>
					)}

					{!reviewMode && currentStep > 0 && currentStep <= totalQuestions && (
						<div className="flex flex-col gap-6">
							<h2 className="text-md font-medium">
								Step {currentStep + 1}: Screening Question {currentStep}
							</h2>
							{data.applicationForm?.fields[currentStep - 1] && (
								<Input
									type="text"
									key={data.applicationForm.fields[currentStep - 1].fieldName}
									label={data.applicationForm.fields[currentStep - 1].fieldName}
									labelPlacement="outside"
									isRequired={
										data.applicationForm.fields[currentStep - 1].isRequired ||
										false
									}
									defaultValue={
										data.applicationForm.fields[currentStep - 1].defaultValue ||
										""
									}
									errorMessage={
										errors.applicantFields?.[currentStep - 1]?.fieldValue
											?.message
									}
									isInvalid={
										!!errors.applicantFields?.[currentStep - 1]?.fieldValue
									}
									{...register(`applicantFields.${currentStep - 1}.fieldValue`)}
									autoFocus
								/>
							)}
							<div className="flex justify-between gap-2">
								<Button
									type="button"
									color="secondary"
									onPress={() => setCurrentStep((s) => s - 1)}
									className="w-full sm:w-auto"
									isDisabled={currentStep === 0}
								>
									Back
								</Button>
								{currentStep < totalQuestions ? (
									<Button
										type="button"
										color="primary"
										onPress={() => setCurrentStep((s) => s + 1)}
										className="w-full sm:w-auto"
										isDisabled={
											data.applicationForm.fields[currentStep - 1].isRequired &&
											!getValues(
												`applicantFields.${currentStep - 1}.fieldValue`,
											)
										}
									>
										Next
									</Button>
								) : (
									<Button
										type="button"
										color="primary"
										onPress={() => setReviewMode(true)}
										className="w-full sm:w-auto"
									>
										Review
									</Button>
								)}
							</div>
						</div>
					)}

					{reviewMode && (
						<div className="flex flex-col gap-6">
							<h2 className="text-sm font-semibold">Review Your Application</h2>
							<div className="flex flex-col gap-2">
								<div>
									<span className="font-medium">Resume:</span>{" "}
									{/* Show file name if available */}
									{typeof window !== "undefined" &&
										(getValues("resume")?.name || "Not uploaded")}
								</div>
								{data.applicationForm?.fields.map((field, idx) => (
									<div key={field.fieldName} className="flex flex-col">
										<span className="font-medium">{field.fieldName}:</span>
										<span className="text-foreground-400">
											{getValues(`applicantFields.${idx}.fieldValue`) || (
												<span className="italic text-gray-400">No answer</span>
											)}
										</span>
									</div>
								))}
							</div>
							<div className="flex justify-between gap-2">
								<Button
									type="button"
									color="secondary"
									onPress={() => {
										setReviewMode(false);
										setCurrentStep(totalQuestions);
									}}
									className="w-full sm:w-auto"
								>
									Back
								</Button>
								<Button
									type="submit"
									color="primary"
									isDisabled={isSubmitting}
									className="w-full sm:w-auto"
								>
									Submit Application
								</Button>
							</div>
						</div>
					)}
				</form>
			</Card>
		</div>
	);
}

import type { JobApplyFormFragment$key } from "@/__generated__/JobApplyFormFragment.graphql";
import type { JobApplyFormMutation } from "@/__generated__/JobApplyFormMutation.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next/app";
import { Button, Card, Progress, Textarea, addToast } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
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

const CreateJobApplicantMutation = graphql`
  mutation JobApplyFormMutation($jobId: ID!, $applicantFields: [ApplicantFieldInput!]!) {
    createJobApplication(jobId: $jobId, applicantFields: $applicantFields) {
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

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors, isSubmitting },
		getValues,
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
	});

	const [currentStep, setCurrentStep] = useState(0);
	const [reviewMode, setReviewMode] = useState(false);
	const totalQuestions = data.applicationForm?.fields.length || 0;
	const totalSteps = totalQuestions + 1; // N for questions, 1 for review

	// Helper for progress
	const progressPercent =
		((reviewMode ? totalSteps : currentStep + 1) / totalSteps) * 100;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				jobId: data.id,
				applicantFields: values.applicantFields.map((field, index) => ({
					fieldName: data.applicationForm?.fields[index].fieldName || "",
					fieldValue: field.fieldValue,
				})),
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
			<Card className="p-6" shadow="none">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
					{/* Stepper Logic */}
					{!reviewMode && currentStep < totalQuestions && (
						<div className="flex flex-col gap-6">
							<h2 className="text-sm text-foreground-600">
								Screening Question {currentStep + 1} of {totalQuestions}
							</h2>
							{data.applicationForm?.fields[currentStep] && (
								<div className="flex flex-col w-full gap-4">
									<h2 className="text-lg">
										{data.applicationForm.fields[currentStep].fieldName}
									</h2>
									<Textarea
										key={data.applicationForm.fields[currentStep].fieldName}
										isRequired={
											data.applicationForm.fields[currentStep].isRequired ||
											false
										}
										defaultValue={
											data.applicationForm.fields[currentStep].defaultValue ||
											""
										}
										errorMessage={
											errors.applicantFields?.[currentStep]?.fieldValue?.message
										}
										isInvalid={
											!!errors.applicantFields?.[currentStep]?.fieldValue
										}
										{...register(`applicantFields.${currentStep}.fieldValue`)}
										autoFocus
									/>
								</div>
							)}
							<div className="flex justify-between gap-12 w-full">
								<Button
									type="button"
									variant="bordered"
									fullWidth
									onPress={() => setCurrentStep((s) => s - 1)}
									isDisabled={currentStep === 0}
								>
									Back
								</Button>
								{currentStep < totalQuestions - 1 ? (
									<Button
										type="button"
										fullWidth
										variant="flat"
										color="primary"
										onPress={() => setCurrentStep((s) => s + 1)}
										isDisabled={
											data.applicationForm.fields[currentStep].isRequired &&
											!getValues(`applicantFields.${currentStep}.fieldValue`)
										}
									>
										Next
									</Button>
								) : (
									<Button
										type="button"
										fullWidth
										variant="flat"
										color="primary"
										onPress={() => setReviewMode(true)}
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
										setCurrentStep(totalQuestions - 1);
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
			{/* Progress Bar */}
			<Progress
				value={progressPercent}
				minValue={0}
				maxValue={100}
				aria-label="Application progress"
				className="w-full mb-2"
			/>
		</div>
	);
}

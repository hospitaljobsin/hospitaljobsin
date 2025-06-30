import type { JobApplyFormFragment$key } from "@/__generated__/JobApplyFormFragment.graphql";
import type { JobApplyFormMutation } from "@/__generated__/JobApplyFormMutation.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next/app";
import {
	Button,
	Card,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Progress,
	Textarea,
	addToast,
} from "@heroui/react";
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
	  ... on AccountProfileIncompleteError {
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
		watch,
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: {
			applicantFields:
				data.applicationForm?.fields.map((field) => ({
					fieldValue: field.defaultValue || "",
				})) || [],
		},
	});

	const [currentStep, setCurrentStep] = useState(0);
	const [reviewMode, setReviewMode] = useState(false);
	const totalQuestions = data.applicationForm?.fields.length || 0;
	const totalSteps = totalQuestions + 1; // N for questions, 1 for review

	// Helper for progress
	const progressPercent =
		((reviewMode ? totalSteps : currentStep + 1) / totalSteps) * 100;

	const currentFieldValue = watch(`applicantFields.${currentStep}.fieldValue`);

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [pendingSubmitValues, setPendingSubmitValues] = useState<z.infer<
		typeof formSchema
	> | null>(null);
	const [showDirectApplyModal, setShowDirectApplyModal] = useState(false);

	async function onSubmitConfirmed(values: z.infer<typeof formSchema>) {
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
					setShowConfirmModal(false);
				}
			},
		});
	}

	function handleFormSubmit(values: z.infer<typeof formSchema>) {
		setPendingSubmitValues(values);
		setShowConfirmModal(true);
	}

	function handleDirectApply() {
		setShowDirectApplyModal(true);
	}

	function onDirectApplyConfirmed() {
		commitMutation({
			variables: {
				jobId: data.id,
				applicantFields: [],
			},
			onCompleted(response) {
				if (
					response.createJobApplication.__typename ===
					"CreateJobApplicantSuccess"
				) {
					setShowDirectApplyModal(false);
					router.push(links.jobDetail(data.organization.slug, data.slug));
				} else {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
					setShowDirectApplyModal(false);
				}
			},
		});
	}

	return (
		<div className="w-full flex flex-col gap-6">
			{data.applicationForm && (
				<Card className="p-6" shadow="none">
					<form
						onSubmit={handleSubmit(handleFormSubmit)}
						className="space-y-12"
					>
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
												data.applicationForm.fields[currentStep].isRequired
											}
											defaultValue={
												data.applicationForm.fields[currentStep].defaultValue ||
												""
											}
											errorMessage={
												errors.applicantFields?.[currentStep]?.fieldValue
													?.message
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
												(!currentFieldValue || !currentFieldValue.trim())
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
								<h2 className="text-sm text-foreground-600">
									Review Your Application
								</h2>
								<div className="flex flex-col gap-4">
									{data.applicationForm?.fields.map((field, idx) => (
										<div key={field.fieldName} className="flex flex-col gap-2">
											<span className="text-md">{field.fieldName}</span>
											<span className="text-foreground-400">
												{getValues(`applicantFields.${idx}.fieldValue`) || (
													<span className="italic text-foreground-400">
														No answer
													</span>
												)}
											</span>
										</div>
									))}
								</div>
								<div className="flex flex-col justify-between gap-6 w-full">
									<Button
										type="submit"
										color="primary"
										fullWidth
										size="lg"
										isDisabled={isSubmitting}
									>
										Submit Application
									</Button>
									<Button
										type="button"
										variant="flat"
										size="lg"
										fullWidth
										onPress={() => {
											setReviewMode(false);
											setCurrentStep(totalQuestions - 1);
										}}
									>
										Go Back
									</Button>
								</div>
							</div>
						)}
					</form>
				</Card>
			)}
			{/* Progress Bar */}
			{reviewMode || !data.applicationForm ? null : (
				<Progress
					value={progressPercent}
					minValue={0}
					maxValue={100}
					aria-label="Application progress"
					className="w-full mb-2"
				/>
			)}

			{!data.applicationForm && (
				<div className="flex flex-col gap-4">
					{/* direct apply button, without applicant fields */}
					<Button
						type="button"
						color="primary"
						fullWidth
						size="lg"
						isDisabled={isSubmitting}
						onPress={handleDirectApply}
					>
						Submit Application
					</Button>
				</div>
			)}
			<Modal
				isOpen={showConfirmModal}
				onClose={() => {
					setShowConfirmModal(false);
					setPendingSubmitValues(null);
				}}
				size="md"
			>
				<ModalContent>
					<ModalHeader>Confirm Submission</ModalHeader>
					<ModalBody>
						<p>
							Are you sure you want to submit your job application? You won't be
							able to undo this.
						</p>
					</ModalBody>
					<ModalFooter className="flex gap-4 items-center w-full flex-row">
						<Button
							variant="flat"
							onPress={() => {
								setShowConfirmModal(false);
								setPendingSubmitValues(null);
							}}
							fullWidth
						>
							Cancel
						</Button>
						<Button
							color="primary"
							isLoading={isMutationInFlight}
							onPress={() => {
								if (pendingSubmitValues) {
									onSubmitConfirmed(pendingSubmitValues);
									setShowConfirmModal(false);
									setPendingSubmitValues(null);
								}
							}}
							fullWidth
						>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			{/* Direct Apply Confirmation Modal */}
			<Modal
				isOpen={showDirectApplyModal}
				onClose={() => setShowDirectApplyModal(false)}
				size="md"
			>
				<ModalContent className="p-6">
					<ModalHeader>Confirm Submission</ModalHeader>
					<ModalBody>
						<p>
							Are you sure you want to submit your job application? You won't be
							able to undo this.
						</p>
					</ModalBody>
					<ModalFooter className="flex gap-4 items-center w-full flex-row">
						<Button
							variant="flat"
							onPress={() => setShowDirectApplyModal(false)}
							fullWidth
						>
							Cancel
						</Button>
						<Button
							color="primary"
							isLoading={isMutationInFlight}
							onPress={onDirectApplyConfirmed}
							fullWidth
						>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

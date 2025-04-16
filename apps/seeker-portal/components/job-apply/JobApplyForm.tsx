import type { JobApplyFormFragment$key } from "@/__generated__/JobApplyFormFragment.graphql";
import type { JobApplyFormMutation } from "@/__generated__/JobApplyFormMutation.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next/app";
import { Button, Card, CardFooter, Input, addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";

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
    }
  }
    `;

const formSchema = z.object({
	applicantFields: z.array(
		z.object({
			fieldValue: z.string().min(1, "This field is required"),
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
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Handle form submission
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
					// Handle success
					router.push(links.jobDetail(data.organization.slug, data.slug));
				} else if (
					response.createJobApplication.__typename === "JobNotFoundError" ||
					response.createJobApplication.__typename === "JobNotPublishedError" ||
					response.createJobApplication.__typename ===
						"JobApplicantAlreadyExistsError"
				) {
					// Handle job not found error
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
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{data.applicationForm?.fields.map((field, index) => (
						<div key={field.fieldName} className="flex flex-col gap-2">
							<Input
								type="text"
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
						</div>
					))}
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

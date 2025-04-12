import type { JobApplyFormFragment$key } from "@/__generated__/JobApplyFormFragment.graphql";
import type { JobApplyFormMutation } from "@/__generated__/JobApplyFormMutation.graphql";
import { Button, Card, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";

const JobApplyFormFragment = graphql`
  fragment JobApplyFormFragment on Job {
    id
    title
    applicationForm {
      fields {
        fieldName
        defaultValue
        isRequired
      }
    }
    organization {
      name
    }
  }
`;

const CreateJobApplicationMutation = graphql`
  mutation JobApplyFormMutation($jobId: ID!, $applicantFields: [ApplicantFieldInput!]!) {
    createJobApplication(jobId: $jobId, applicantFields: $applicantFields) {
      __typename
      ... on CreateJobApplicationSuccess {
        __typename
      }

      ... on JobNotFoundError {
        __typename
      }

      ... on JobNotPublishedError {
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
	const data = useFragment(JobApplyFormFragment, rootQuery);
	const [commitMutation, isMutationInFlight] =
		useMutation<JobApplyFormMutation>(CreateJobApplicationMutation);

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
		});
	}

	return (
		<div className="w-full flex flex-col gap-6">
			<h2 className="text-lg font-medium mt-1 text-foreground-400">
				Apply for {data.title}
			</h2>
			<h3>In {data.organization?.name}</h3>
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
					<Button
						type="submit"
						color="primary"
						disabled={isSubmitting}
						className="w-full sm:w-auto"
					>
						Submit Application
					</Button>
				</form>
			</Card>
		</div>
	);
}

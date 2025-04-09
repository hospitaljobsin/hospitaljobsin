import type { ApplicationFormBuilderFragment$key } from "@/__generated__/ApplicationFormBuilderFragment.graphql";
import type { ApplicationFormBuilderMutation as ApplicationFormBuilderMutationType } from "@/__generated__/ApplicationFormBuilderMutation.graphql";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Input,
	addToast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import invariant from "tiny-invariant";
import { z } from "zod";

const ApplicationFormBuilderFragment = graphql`
  fragment ApplicationFormBuilderFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        id
        applicationForm {
            fields {
                fieldName
                defaultValue
            }
        }
      }
     
    }
  }
`;

const ApplicationFormBuilderMutation = graphql`
  mutation ApplicationFormBuilderMutation(
    $jobId: ID!
    $fields: [ApplicationFieldInput!]!
  ) {
    updateJobApplicationForm(jobId: $jobId, fields: $fields) {
      __typename
      ... on UpdateJobApplicationFormSuccess {
        jobApplicationForm {
            fields {
                fieldName
                defaultValue
                }
            }
        }

        ... on JobNotFoundError {
            __typename
        }

        ... on OrganizationAuthorizationError {
            __typename
        }
    }
}`;

const formSchema = z.object({
	fields: z.array(
		z.object({
			fieldName: z.string().min(1, "This field is required"),
			defaultValue: z.string().nullable(),
		}),
	),
});

export default function ApplicationFormBuilder({
	rootQuery,
}: { rootQuery: ApplicationFormBuilderFragment$key }) {
	const data = useFragment(ApplicationFormBuilderFragment, rootQuery);

	const job = data.job;
	invariant(job.__typename === "Job", "Expected 'Job' node type");

	const [commitMutation, isMutationInflight] =
		useMutation<ApplicationFormBuilderMutationType>(
			ApplicationFormBuilderMutation,
		);

	const { control, register, handleSubmit } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fields: [
				{
					fieldName: "",
					defaultValue: null,
				},
			],
		},
	});

	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
		{
			control,
			name: "fields",
		},
	);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Handle form submission
		commitMutation({
			variables: {
				jobId: job.id,
				fields: values.fields,
			},

			onCompleted(response) {
				if (
					response.updateJobApplicationForm.__typename ===
					"UpdateJobApplicationFormSuccess"
				) {
					// handle success case
				} else if (
					response.updateJobApplicationForm.__typename === "JobNotFoundError"
				) {
					// handle job not found error
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.updateJobApplicationForm.__typename ===
					"OrganizationAuthorizationError"
				) {
					// handle organization authorization error
					addToast({
						description: "You are not authorized to perform this action.",
						color: "danger",
					});
				}
			},
		});
	}

	return (
		<div className="w-full flex flex-col gap-6">
			<Card fullWidth className="p-6 space-y-6" shadow="none">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<CardHeader>Update Application Form</CardHeader>

					<CardBody className="space-y-6 w-full">
						<div className="space-y-6 w-full">
							<div className="w-full flex flex-col gap-6 items-center">
								{fields.map((item, index) => (
									<div key={item.id} className="flex w-full items-center gap-6">
										<Input
											{...register(`fields.${index}.fieldName`)}
											defaultValue={item.fieldName}
											placeholder="Field Name"
										/>
										<Input
											{...register(`fields.${index}.defaultValue`)}
											defaultValue={item.defaultValue || ""}
											placeholder="Default Value"
										/>
										<Button
											isIconOnly
											onPress={() => remove(index)}
											isDisabled={fields.length <= 1}
											variant="ghost"
										>
											<Trash size={18} />
										</Button>
									</div>
								))}
							</div>
							<Button
								onPress={() => append({ fieldName: "", defaultValue: null })}
								variant="bordered"
							>
								<Plus size={20} /> form field
							</Button>
						</div>
					</CardBody>
					<CardFooter className="w-full flex justify-end">
						<Button color="primary">Save Application Form</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

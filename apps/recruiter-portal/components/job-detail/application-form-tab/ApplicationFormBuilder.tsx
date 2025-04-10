import type { ApplicationFormBuilderFragment$key } from "@/__generated__/ApplicationFormBuilderFragment.graphql";
import type { ApplicationFormBuilderMutation as ApplicationFormBuilderMutationType } from "@/__generated__/ApplicationFormBuilderMutation.graphql";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Checkbox,
	Input,
	addToast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
                isRequired
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
                isRequired
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
			isRequired: z.boolean().default(false),
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

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fields:
				job.applicationForm != null
					? job.applicationForm.fields.map((field) => ({
							fieldName: field.fieldName,
							defaultValue: field.defaultValue,
							isRequired: field.isRequired,
						}))
					: [
							{
								fieldName: "",
								defaultValue: null,
								isRequired: false,
							},
						],
		},
		mode: "onSubmit",
		reValidateMode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "fields",
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log("Submitting form with values:", values);
		// Handle form submission
		commitMutation({
			variables: {
				jobId: job.id,
				fields: values.fields.map((field) => ({
					fieldName: field.fieldName,
					defaultValue: field.defaultValue,
					isRequired: field.isRequired,
				})),
			},

			onCompleted(response) {
				if (
					response.updateJobApplicationForm.__typename ===
					"UpdateJobApplicationFormSuccess"
				) {
					// handle success case
					reset(
						{
							fields:
								response.updateJobApplicationForm.jobApplicationForm.fields.map(
									(field) => ({
										fieldName: field.fieldName,
										defaultValue: field.defaultValue || null,
										isRequired: field.isRequired,
									}),
								),
						},
						{ keepDirty: false },
					);
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
									<div key={item.id} className="flex w-full items-start gap-6">
										<Input
											{...register(`fields.${index}.fieldName`)}
											defaultValue={item.fieldName}
											placeholder="Field Name"
											isInvalid={!!errors.fields?.[index]?.fieldName?.message}
											errorMessage={errors.fields?.[index]?.fieldName?.message}
										/>
										<Input
											{...register(`fields.${index}.defaultValue`)}
											defaultValue={item.defaultValue || ""}
											placeholder="Default Value"
											isInvalid={
												!!errors.fields?.[index]?.defaultValue?.message
											}
											errorMessage={
												errors.fields?.[index]?.defaultValue?.message
											}
										/>
										<Controller
											control={control}
											name={`fields.${index}.isRequired`}
											render={({ field }) => (
												<Checkbox
													type="checkbox"
													size="lg"
													defaultChecked={item.isRequired}
													isSelected={field.value}
													onValueChange={field.onChange}
													placeholder="Required"
													className="text-nowrap"
													isInvalid={
														!!errors.fields?.[index]?.isRequired?.message
													}
												>
													Is required
												</Checkbox>
											)}
										/>
										<Button
											type="button"
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
								type="button"
								onPress={() =>
									append({
										fieldName: "",
										defaultValue: null,
										isRequired: false,
									})
								}
								variant="bordered"
							>
								<Plus size={20} /> form field
							</Button>
						</div>
					</CardBody>
					<CardFooter className="w-full flex justify-end">
						<Button color="primary" type="submit">
							Save Application Form
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

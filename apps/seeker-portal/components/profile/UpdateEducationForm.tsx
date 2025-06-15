// NOTE: The mutation below assumes an EducationInput type exists in your GraphQL schema:
// input EducationInput { degree: String!, institution: String!, yearCompleted: Int! }
// You must add this input type and the updateProfileEducation mutation on the backend for this to work.
import type { UpdateEducationFormFragment$key } from "@/__generated__/UpdateEducationFormFragment.graphql";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";

const UpdateEducationFormMutation = graphql`
mutation UpdateEducationFormMutation($education: [EducationInput!]!) {
  updateProfileEducation(education: $education) {
    ...on Account {
      profile {
        ... on Profile {
          ...UpdateEducationFormFragment
        }
      }
    }
  }
}
`;

const UpdateEducationFormFragment = graphql`
  fragment UpdateEducationFormFragment on Profile {
    __typename
    education {
      degree
      institution
      yearCompleted
    }
  }
`;

type Props = {
	rootQuery: UpdateEducationFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	education: z.array(
		z.object({
			degree: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			institution: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			yearCompleted: z
				.string()
				.check(
					z.minLength(4, "Enter a valid year"),
					z.maxLength(4, "Enter a valid year"),
				),
		}),
	),
});

export default function UpdateEducationForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdateEducationFormMutation,
	);
	const data = useFragment(UpdateEducationFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues:
			data.education.length > 0
				? {
						education: data.education.map((edu) => ({
							degree: edu.degree,
							institution: edu.institution,
							yearCompleted: String(edu.yearCompleted),
						})),
					}
				: {
						education: [{ degree: "", institution: "", yearCompleted: "" }],
					},
	});

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: "education",
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				education: formData.education.map((edu) => ({
					...edu,
					yearCompleted: Number.parseInt(edu.yearCompleted, 10),
				})),
			},
		});
		onSaveChanges();
	}

	async function handleCancel() {
		onSaveChanges();
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<h1 className="text-lg font-medium">Editing Education</h1>
				</CardHeader>
				<CardBody>
					{/* Dynamic Array of education */}
					<div className="w-full space-y-12 items-center">
						{fields.map((item, index) => (
							<div
								key={`field-${item.degree}-${item.institution}-${index}`}
								className="flex gap-8 items-start w-full"
							>
								<div className="w-full space-y-4">
									<Controller
										name={`education.${index}.degree`}
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label="Degree"
												placeholder="Add degree"
												errorMessage={
													errors.education?.[index]?.degree?.message
												}
												isInvalid={!!errors.education?.[index]?.degree}
											/>
										)}
									/>
								</div>
								<div className="w-full space-y-4">
									<Controller
										name={`education.${index}.institution`}
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label="Institution"
												placeholder="Add institution"
												errorMessage={
													errors.education?.[index]?.institution?.message
												}
												isInvalid={!!errors.education?.[index]?.institution}
											/>
										)}
									/>
								</div>
								<div className="w-full space-y-4">
									<Controller
										name={`education.${index}.yearCompleted`}
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label="Year Completed"
												placeholder="e.g. 2022"
												errorMessage={
													errors.education?.[index]?.yearCompleted?.message
												}
												isInvalid={!!errors.education?.[index]?.yearCompleted}
												type="number"
												min={1900}
												max={2100}
											/>
										)}
									/>
								</div>
								<Button
									type="button"
									isIconOnly
									variant="bordered"
									onPress={() => remove(index)}
									isDisabled={fields.length <= 1}
								>
									<Trash size={18} />
								</Button>
							</div>
						))}
						<Button
							type="button"
							variant="bordered"
							startContent={<Plus size={18} />}
							onPress={() =>
								append({
									degree: "",
									institution: "",
									yearCompleted: "",
								})
							}
						>
							Education
						</Button>
					</div>
				</CardBody>
			</Card>
			<div className="mt-4 flex justify-end gap-6">
				<Button
					type="button"
					variant="light"
					onPress={handleCancel}
					isLoading={isMutationInFlight || isSubmitting}
				>
					Cancel
				</Button>
				<Button type="submit" isLoading={isMutationInFlight || isSubmitting}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}

import type { UpdateLanguagesFormFragment$key } from "@/__generated__/UpdateLanguagesFormFragment.graphql";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4";

const UpdateLanguagesFormMutation = graphql`
mutation UpdateLanguagesFormMutation($languages: [LanguageInput!]!) {
	updateProfileLanguages(languages: $languages) {
		...on Account {
			...UpdateLanguagesFormFragment
		}
	}
}
`;

const UpdateLanguagesFormFragment = graphql`
  fragment UpdateLanguagesFormFragment on Account {
    profile {
      ... on Profile {
        __typename
		languages {
			name
			proficiency
		}
      }
      ... on ProfileNotFoundError {
        __typename
      }
    }
  }
`;

type Props = {
	rootQuery: UpdateLanguagesFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	languages: z.array(
		z.object({
			name: z.string().min(1, "This field is required").max(75),
			proficiency: z.string().min(1, "This field is required").max(75),
		}),
	),
});

export default function UpdateLanguagesForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdateLanguagesFormMutation,
	);
	const data = useFragment(UpdateLanguagesFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues:
			data.profile.__typename === "Profile" && data.profile.languages.length > 0
				? {
						languages: data.profile.languages.map((language) => ({
							name: language.name,
							proficiency: language.proficiency,
						})),
					}
				: {
						languages: [{ name: "", proficiency: "" }],
					},
	});

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: "languages",
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				languages: formData.languages,
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
					<h1 className="text-lg font-medium">Editing Languages</h1>
				</CardHeader>
				<CardBody>
					{/* Dynamic Array of languages */}
					<div className="w-full space-y-12 items-center">
						{fields.map((item, index) => (
							<div
								key={`field-${item.name}-${index}`}
								className="flex gap-8 items-start w-full"
							>
								<div className="w-full space-y-4">
									<Controller
										name={`languages.${index}.name`}
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label="Name"
												placeholder="Add language name"
												errorMessage={errors.languages?.[index]?.name?.message}
												isInvalid={!!errors.languages?.[index]?.name}
											/>
										)}
									/>
								</div>
								<div className="w-full space-y-4">
									<Controller
										name={`languages.${index}.proficiency`}
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												fullWidth
												label="Proficiency"
												placeholder="Add language proficiency"
												errorMessage={
													errors.languages?.[index]?.proficiency?.message
												}
												isInvalid={!!errors.languages?.[index]?.proficiency}
											/>
										)}
									/>
								</div>

								<Button
									type="button"
									isIconOnly
									variant="bordered"
									onPress={() => remove(index)}
									isDisabled={fields.length <= 1} // Disable delete if only one field left
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
									name: "",
									proficiency: "",
								})
							}
						>
							Language
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

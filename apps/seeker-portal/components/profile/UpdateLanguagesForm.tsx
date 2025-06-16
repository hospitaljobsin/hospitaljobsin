import type { UpdateLanguagesFormFragment$key } from "@/__generated__/UpdateLanguagesFormFragment.graphql";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { LanguagesIcon, Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";

const UpdateLanguagesFormMutation = graphql`
mutation UpdateLanguagesFormMutation($languages: [LanguageInput!]!) {
	updateProfileLanguages(languages: $languages) {
		...on Account {
			profile {
				... on Profile {
					...UpdateLanguagesFormFragment
				}
			}
		}
	}
}
`;

const UpdateLanguagesFormFragment = graphql`
  fragment UpdateLanguagesFormFragment on Profile {
        __typename
		languages {
			name
			proficiency
		}
      }
`;

type Props = {
	rootQuery: UpdateLanguagesFormFragment$key;
	onSaveChanges: () => void;
};

const LANGUAGE_PROFICIENCY_OPTIONS = [
	{ key: "NATIVE", label: "Native" },
	{ key: "PROFESSIONAL", label: "Professional" },
	{ key: "BASIC", label: "Basic" },
];

const formSchema = z.object({
	languages: z.array(
		z.object({
			name: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(75)),
			proficiency: z.enum(["NATIVE", "PROFESSIONAL", "BASIC"]),
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
			data.languages.length > 0
				? {
						languages: data.languages.map((language) => ({
							name: language.name,
							proficiency:
								language.proficiency === "NATIVE"
									? "NATIVE"
									: language.proficiency === "PROFESSIONAL"
										? "PROFESSIONAL"
										: "BASIC",
						})),
					}
				: {
						languages: [{ name: "", proficiency: "BASIC" }],
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
					<div className="flex items-center gap-2 text-foreground-400">
						<LanguagesIcon />
						<h1 className="w-full text-sm font-medium">Editing Languages</h1>
					</div>
				</CardHeader>
				<CardBody>
					{/* Dynamic Array of languages */}
					<div className="w-full space-y-12 items-center">
						{fields.length === 0 ? (
							<div className="flex flex-col items-center gap-4">
								<p className="text-gray-500">
									No language entries. Add your languages.
								</p>
								<Button
									type="button"
									variant="bordered"
									startContent={<Plus size={18} />}
									onPress={() =>
										append({
											name: "",
											proficiency: "BASIC",
										})
									}
								>
									Add Language
								</Button>
							</div>
						) : (
							<>
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
														errorMessage={
															errors.languages?.[index]?.name?.message
														}
														isInvalid={!!errors.languages?.[index]?.name}
													/>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<Controller
												name={`languages.${index}.proficiency`}
												control={control}
												defaultValue="BASIC"
												render={({ field }) => (
													<Select
														{...field}
														fullWidth
														label="Proficiency"
														placeholder="Select proficiency"
														selectionMode="single"
														selectedKeys={[field.value ?? "BASIC"]}
														defaultSelectedKeys={[field.value ?? "BASIC"]}
														onSelectionChange={(keys) => {
															const value = Array.from(keys)[0] as
																| "NATIVE"
																| "PROFESSIONAL"
																| "BASIC";
															field.onChange(value);
														}}
														errorMessage={
															errors.languages?.[index]?.proficiency?.message
														}
														isInvalid={!!errors.languages?.[index]?.proficiency}
													>
														{LANGUAGE_PROFICIENCY_OPTIONS.map((option) => (
															<SelectItem key={option.key}>
																{option.label}
															</SelectItem>
														))}
													</Select>
												)}
											/>
										</div>
										<Button
											type="button"
											isIconOnly
											variant="bordered"
											onPress={() => remove(index)}
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
											proficiency: "BASIC",
										})
									}
								>
									Add Language
								</Button>
							</>
						)}
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

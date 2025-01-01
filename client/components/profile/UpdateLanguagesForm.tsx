import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment } from "react-relay";
import type { UpdateLanguagesFormFragment$key } from "./__generated__/UpdateLanguagesFormFragment.graphql";

const UpdateLanguagesFormFragment = graphql`
  fragment UpdateLanguagesFormFragment on Account {
    profile {
      ... on Profile {
        __typename
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

type FormData = {
	languages: { name: string; proficiency: string }[];
};

// TODO: use react-hook-form here

export default function UpdateLanguagesForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const data = useFragment(UpdateLanguagesFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			languages: [{ name: "", proficiency: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: "languages",
	});

	async function onSubmit(formData: FormData) {
		console.log("Form Data Submitted:", formData);
		onSaveChanges();
	}

	async function handleCancel() {
		onSaveChanges();
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
			<Card className="p-6 space-y-6" shadow="sm">
				<CardHeader>
					<h1 className="text-lg font-medium">Editing Languages</h1>
				</CardHeader>
				<CardBody>
					{/* Dynamic Array of languages */}
					<div className="w-full space-y-12 items-center">
						{fields.map((item, index) => (
							<div
								key={`field-${item.name}-${index}`}
								className="flex gap-8 items-center w-full"
							>
								<div className="w-full">
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
											/>
										)}
									/>
									{errors.address?.state && (
										<p className="text-red-500">This field is required</p>
									)}
								</div>
								<div className="w-full">
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
											/>
										)}
									/>
									{errors.address?.state && (
										<p className="text-red-500">This field is required</p>
									)}
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
				<Button type="button" variant="light" onPress={handleCancel}>
					Cancel
				</Button>
				<Button type="submit">Save Changes</Button>
			</div>
		</form>
	);
}

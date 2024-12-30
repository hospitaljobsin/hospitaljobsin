import type { DateValue } from "@nextui-org/react";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	DatePicker,
	Input,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment } from "react-relay";
import type { UpdatePersonalDetailsFormFragment$key } from "./__generated__/UpdatePersonalDetailsFormFragment.graphql";

const UpdatePersonalDetailsFormFragment = graphql`
  fragment UpdatePersonalDetailsFormFragment on Account {
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
	rootQuery: UpdatePersonalDetailsFormFragment$key;
	onSaveChanges: () => void;
};

type FormData = {
	gender: string;
	dateOfBirth: DateValue;
	address: {
		city: string;
		country: string;
		line1: string | null;
		line2: string | null;
		pincode: string | null;
		state: string;
	};
	maritalStatus: string;
	category: string;
	languages: { name: string; proficiency: string }[];
};

// TODO: use react-hook-form here

export default function UpdatePersonalDetailsForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const data = useFragment(UpdatePersonalDetailsFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			address: {
				city: "",
				country: "",
				line1: "",
				line2: "",
				pincode: "",
				state: "",
			},
			category: "",
			gender: "",
			languages: [{ name: "", proficiency: "" }],
			maritalStatus: "",
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
			{/* Personal Details */}
			<Card className="p-6 space-y-6" shadow="sm">
				<CardHeader>
					<h1 className="text-lg font-medium">Editing Personal Details</h1>
				</CardHeader>
				<CardBody>
					<div className="mb-12">
						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<Select
									fullWidth
									label="Gender"
									placeholder="Add your gender"
									selectionMode="single"
									{...field}
								>
									<SelectItem key={"male"}>Male</SelectItem>
									<SelectItem key={"female"}>Female</SelectItem>
									<SelectItem key={"other"}>Other</SelectItem>
								</Select>
							)}
						/>
						{errors.gender && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-12">
						<Controller
							name="dateOfBirth"
							control={control}
							render={({ field }) => (
								<DatePicker
									fullWidth
									className="max-w-[284px]"
									label="Date of Birth"
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						{errors.dateOfBirth && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="flex flex-col gap-4">
						<p className="text-xs text-foreground-500 px-2">Address</p>

						<div className="flex gap-8 mb-12">
							<div className="flex flex-col w-full gap-8">
								<div>
									<Controller
										name="address.city"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												label="City"
												placeholder="Add your city"
											/>
										)}
									/>
									{errors.address?.city && (
										<p className="text-red-500">This field is required</p>
									)}
								</div>
								<div>
									<Controller
										name="address.country"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												label="Country"
												placeholder="Add your country"
											/>
										)}
									/>
									{errors.address?.country && (
										<p className="text-red-500">This field is required</p>
									)}
								</div>
								<div>
									<Controller
										name="address.pincode"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												label="Pincode"
												placeholder="Add your pincode"
											/>
										)}
									/>
									{errors.address?.pincode && (
										<p className="text-red-500">This field is required</p>
									)}
								</div>
							</div>
							<div className="flex flex-col w-full gap-8">
								<div>
									<Controller
										name="address.line1"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												label="Line 1"
												placeholder="Add line 1"
											/>
										)}
									/>
									{errors.address?.line1 && (
										<p className="text-red-500">This field is required</p>
									)}
								</div>
								<div>
									<Controller
										name="address.line2"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												label="Line 2"
												placeholder="Add line 2"
											/>
										)}
									/>
									{errors.address?.line2 && (
										<p className="text-red-500">This field is required</p>
									)}
								</div>
								<div>
									<Controller
										name="address.state"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Input
												{...field}
												label="State"
												placeholder="Add your state"
											/>
										)}
									/>
									{errors.address?.state && (
										<p className="text-red-500">This field is required</p>
									)}
								</div>
							</div>
						</div>
						<div className="mb-12">
							<Controller
								name="maritalStatus"
								control={control}
								render={({ field }) => (
									<Select
										fullWidth
										label="Marital Status"
										placeholder="Add your marital status"
										selectionMode="single"
										{...field}
									>
										<SelectItem key={"single"}>Single</SelectItem>
										<SelectItem key={"married"}>Married</SelectItem>
									</Select>
								)}
							/>
							{errors.maritalStatus && (
								<p className="text-red-500">This field is required</p>
							)}
						</div>
						<div className="mb-12">
							<Controller
								name="category"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<Input
										{...field}
										label="Category"
										placeholder="Add your category"
									/>
								)}
							/>
							{errors.category && (
								<p className="text-red-500">This field is required</p>
							)}
						</div>
					</div>
					{/* Dynamic Array of languages */}
					<div className="w-full space-y-12 items-center">
						<p className="text-xs text-foreground-500 -mb-8 px-2">Languages</p>
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
									disabled={fields.length <= 1} // Disable delete if only one field left
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

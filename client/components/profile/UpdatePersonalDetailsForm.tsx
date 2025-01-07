import { parseDate } from "@internationalized/date";
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
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";
import type { UpdatePersonalDetailsFormFragment$key } from "./__generated__/UpdatePersonalDetailsFormFragment.graphql";

const UpdatePersonalDetailsFormMutation = graphql`
mutation UpdatePersonalDetailsFormMutation($gender: GenderType, $dateOfBirth: Date, $address: AddressInput, $maritalStatus: MaritalStatusType, $category: String) {
	updateProfile(address: $address, gender: $gender, dateOfBirth: $dateOfBirth, maritalStatus: $maritalStatus, category: $category) {
		__typename
	}
}
`;
const UpdatePersonalDetailsFormFragment = graphql`
  fragment UpdatePersonalDetailsFormFragment on Account {
    profile {
      ... on Profile {
        __typename
		address {
			city
			country
			line1
			line2
			pincode
			state
		}
		gender
		dateOfBirth
		maritalStatus
		category
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

const formSchema = z.object({
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable(),
	dateOfBirth: z.date().nullable(),
	address: z.object({
		city: z.string().min(1, "City is required").nullable(),
		country: z.string().min(1, "Country is required").nullable(),
		line1: z.string().nullable(),
		line2: z.string().nullable(),
		pincode: z.string().nullable(),
		state: z.string().min(1, "State is required"),
	}),
	maritalStatus: z.string().nullable(),
	category: z.string().nullable(),
});

export default function UpdatePersonalDetailsForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdatePersonalDetailsFormMutation,
	);
	const data = useFragment(UpdatePersonalDetailsFormFragment, rootQuery);
	console.log("Data:", data);
	console.log(data.profile?.__typename === "Profile");
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		defaultValues:
			data.profile.__typename === "Profile"
				? {
						address: {
							city: data.profile.address?.city ?? null,
							country: data.profile.address?.country ?? null,
							line1: data.profile.address?.line1 ?? null,
							line2: data.profile.address?.line2 ?? null,
							pincode: data.profile.address?.pincode ?? null,
							state: data.profile.address?.state ?? null,
						},
						category: data.profile.category ?? null,
						gender: data.profile.gender ?? null,
						maritalStatus: data.profile.maritalStatus ?? null,
						dateOfBirth: data.profile.dateOfBirth ?? null,
					}
				: {
						// address: {
						// 	city: null,
						// 	country: null,
						// 	line1: null,
						// 	line2: null,
						// 	pincode: null,
						// 	state: null,
						// },
						address: null,
						category: null,
						gender: "MALE",
						maritalStatus: null,
					},
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		console.log("Form Data Submitted:", formData);
		commitMutation({
			variables: {
				gender: formData.gender,
				dateOfBirth: formData.dateOfBirth,
				category: formData.category,
				maritalStatus: formData.maritalStatus,
				address: formData.address && {
					city: formData.address.city,
					country: formData.address.country,
					line1: formData.address.line1,
					line2: formData.address.line2,
					pincode: formData.address.pincode,
					state: formData.address.state,
				},
			},
		});
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
									{...field}
									fullWidth
									label="Gender"
									placeholder="Add your gender"
									selectionMode="single"
									value={field.value ?? ""}
								>
									<SelectItem key={"MALE"}>Male</SelectItem>
									<SelectItem key={"FEMALE"}>Female</SelectItem>
									<SelectItem key={"OTHER"}>Other</SelectItem>
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
									value={
										field.value instanceof Date
											? parseDate(String(field.value))
											: null
									}
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
												value={field.value ?? ""}
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
												value={field.value ?? ""}
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
												value={field.value ?? ""}
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
												value={field.value ?? ""}
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
												value={field.value ?? ""}
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
										{...field}
										fullWidth
										label="Marital Status"
										placeholder="Add your marital status"
										selectionMode="single"
										value={field.value ?? ""}
									>
										<SelectItem key={"SINGLE"}>Single</SelectItem>
										<SelectItem key={"MARRIED"}>Married</SelectItem>
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
										value={field.value ?? ""}
									/>
								)}
							/>
							{errors.category && (
								<p className="text-red-500">This field is required</p>
							)}
						</div>
					</div>
				</CardBody>
			</Card>

			<div className="mt-4 flex justify-end gap-6">
				<Button type="button" variant="light" onPress={handleCancel}>
					Cancel
				</Button>
				<Button type="submit" isDisabled={isSubmitting || isMutationInFlight}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}

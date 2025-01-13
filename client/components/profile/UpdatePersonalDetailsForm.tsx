import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, parseDate } from "@internationalized/date";
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
mutation UpdatePersonalDetailsFormMutation($gender: GenderType, $dateOfBirth: Date, $address: AddressInput!, $maritalStatus: MaritalStatusType, $category: String) {
	updateProfilePersonalDetails(address: $address, gender: $gender, dateOfBirth: $dateOfBirth, maritalStatus: $maritalStatus, category: $category) {
		...on Account {
			...UpdatePersonalDetailsFormFragment
		}
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
	dateOfBirth: z.instanceof(CalendarDate).nullable(),
	address: z.object({
		city: z.string().nullable(),
		country: z.string().nullable(),
		line1: z.string().nullable(),
		line2: z.string().nullable(),
		pincode: z.string().nullable(),
		state: z.string().nullable(),
	}),
	maritalStatus: z.enum(["MARRIED", "SINGLE"]).nullable(),
	category: z.string().max(25).nullable(),
});

export default function UpdatePersonalDetailsForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdatePersonalDetailsFormMutation,
	);
	const data = useFragment(UpdatePersonalDetailsFormFragment, rootQuery);

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
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
						dateOfBirth: data.profile.dateOfBirth
							? parseDate(data.profile.dateOfBirth)
							: null,
					}
				: {
						address: {
							city: null,
							country: null,
							line1: null,
							line2: null,
							pincode: null,
							state: null,
						},
						category: null,
						gender: "MALE",
						maritalStatus: null,
						dateOfBirth: null,
					},
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				gender: formData.gender || null,
				dateOfBirth: formData.dateOfBirth
					? formData.dateOfBirth.toString()
					: null,
				category: formData.category || null,
				maritalStatus: formData.maritalStatus || null,
				address: {
					city: formData.address.city || null,
					country: formData.address.country || null,
					line1: formData.address.line1 || null,
					line2: formData.address.line2 || null,
					pincode: formData.address.pincode || null,
					state: formData.address.state || null,
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
									selectedKeys={[field.value ?? ""]}
									defaultSelectedKeys={[field.value ?? ""]}
									onSelectionChange={field.onChange}
									errorMessage={errors.gender?.message}
									isInvalid={!!errors.gender}
								>
									<SelectItem key={"MALE"}>Male</SelectItem>
									<SelectItem key={"FEMALE"}>Female</SelectItem>
									<SelectItem key={"OTHER"}>Other</SelectItem>
								</Select>
							)}
						/>
					</div>
					<div className="mb-12">
						<Controller
							name="dateOfBirth"
							control={control}
							render={({ field }) => {
								return (
									<DatePicker
										fullWidth
										label="Date of Birth"
										{...field}
										value={field.value ?? undefined}
										onChange={field.onChange}
										errorMessage={errors.dateOfBirth?.message}
										isInvalid={!!errors.dateOfBirth}
									/>
								);
							}}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<p className="text-xs text-foreground-500 px-2">Address</p>

						<div className="flex gap-8 mb-12">
							<div className="flex flex-col w-full gap-8">
								<Controller
									name="address.city"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="City"
											placeholder="Add your city"
											value={field.value ?? ""}
											errorMessage={errors.address?.city?.message}
											isInvalid={!!errors.address?.city}
										/>
									)}
								/>
								<Controller
									name="address.country"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="Country"
											placeholder="Add your country"
											value={field.value ?? ""}
											errorMessage={errors.address?.country?.message}
											isInvalid={!!errors.address?.country}
										/>
									)}
								/>
								<Controller
									name="address.pincode"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="Pincode"
											placeholder="Add your pincode"
											value={field.value ?? ""}
											errorMessage={errors.address?.pincode?.message}
											isInvalid={!!errors.address?.pincode}
										/>
									)}
								/>
							</div>
							<div className="flex flex-col w-full gap-8">
								<Controller
									name="address.line1"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="Line 1"
											placeholder="Add line 1"
											value={field.value ?? ""}
											errorMessage={errors.address?.line1?.message}
											isInvalid={!!errors.address?.line1}
										/>
									)}
								/>
								<Controller
									name="address.line2"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="Line 2"
											placeholder="Add line 2"
											value={field.value ?? ""}
											errorMessage={errors.address?.line2?.message}
											isInvalid={!!errors.address?.line2}
										/>
									)}
								/>
								<Controller
									name="address.state"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label="State"
											placeholder="Add your state"
											value={field.value ?? ""}
											errorMessage={errors.address?.state?.message}
											isInvalid={!!errors.address?.state}
										/>
									)}
								/>
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
										selectedKeys={[field.value ?? ""]}
										defaultSelectedKeys={[field.value ?? ""]}
										onSelectionChange={field.onChange}
										errorMessage={errors.maritalStatus?.message}
										isInvalid={!!errors.maritalStatus}
									>
										<SelectItem key={"SINGLE"}>Single</SelectItem>
										<SelectItem key={"MARRIED"}>Married</SelectItem>
									</Select>
								)}
							/>
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
										errorMessage={errors.category?.message}
										isInvalid={!!errors.category}
									/>
								)}
							/>
						</div>
					</div>
				</CardBody>
			</Card>

			<div className="mt-4 flex justify-end gap-6">
				<Button
					type="button"
					variant="light"
					onPress={handleCancel}
					isLoading={isSubmitting || isMutationInFlight}
				>
					Cancel
				</Button>
				<Button type="submit" isLoading={isSubmitting || isMutationInFlight}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}

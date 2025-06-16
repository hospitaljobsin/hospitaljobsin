import type { UpdatePersonalDetailsFormFragment$key } from "@/__generated__/UpdatePersonalDetailsFormFragment.graphql";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	DatePicker,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CalendarDate, parseDate } from "@internationalized/date";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";
import LocationAutocomplete from "../forms/LocationAutocomplete";

const UpdatePersonalDetailsFormMutation = graphql`
mutation UpdatePersonalDetailsFormMutation($gender: GenderType, $dateOfBirth: Date, $address: String!, $maritalStatus: MaritalStatusType, $category: String) {
	updateProfilePersonalDetails(gender: $gender, dateOfBirth: $dateOfBirth, address: $address, maritalStatus: $maritalStatus, category: $category) {
		...on Account {
			profile {
				... on Profile {
					...UpdatePersonalDetailsFormFragment
				}
			}
		}
	}
}
`;
const UpdatePersonalDetailsFormFragment = graphql`
  fragment UpdatePersonalDetailsFormFragment on  Profile {
        address
        gender
        dateOfBirth
        maritalStatus
        category
      }
`;

type Props = {
	rootQuery: UpdatePersonalDetailsFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	gender: z.union([
		z.literal("MALE"),
		z.literal("FEMALE"),
		z.literal("OTHER"),
		z.null(),
	]),
	dateOfBirth: z.nullable(
		z.custom<CalendarDate>((data) => data instanceof CalendarDate),
	),
	address: z.string().check(z.minLength(3, "Address is required")),
	maritalStatus: z.union([z.literal("MARRIED"), z.literal("SINGLE"), z.null()]),
	category: z.nullable(
		z.string().check(z.maxLength(25, "Category is too long")),
	),
});

export default function UpdatePersonalDetailsForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdatePersonalDetailsFormMutation,
	);
	const data = useFragment(UpdatePersonalDetailsFormFragment, rootQuery);

	const defaultValues: z.infer<typeof formSchema> = {
		address: String(data.address ?? ""),
		category: data.category ?? null,
		gender: ["MALE", "FEMALE", "OTHER"].includes(data.gender ?? "")
			? (data.gender as "MALE" | "FEMALE" | "OTHER")
			: null,
		maritalStatus: ["MARRIED", "SINGLE"].includes(data.maritalStatus ?? "")
			? (data.maritalStatus as "MARRIED" | "SINGLE")
			: null,
		dateOfBirth: data.dateOfBirth ? parseDate(data.dateOfBirth) : null,
	};

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues,
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
				address: formData.address,
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
			<Card className="p-6 space-y-6" shadow="none">
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
										showMonthAndYearPickers
										label="Date of Birth"
										{...field}
										value={field.value as any}
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
									name="address"
									control={control}
									render={({ field }) => {
										return (
											<LocationAutocomplete
												value={field.value || ""}
												onValueChange={field.onChange}
												onChange={(location) => {
													field.onChange(location.displayName);
												}}
												placeholder="Enter your address"
												errorMessage={errors.address?.message}
												isInvalid={!!errors.address}
											/>
										);
									}}
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

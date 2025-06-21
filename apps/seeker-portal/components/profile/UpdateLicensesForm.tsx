import type { UpdateLicensesFormFragment$key } from "@/__generated__/UpdateLicensesFormFragment.graphql";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	DatePicker,
	Input,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CalendarDate, parseDate } from "@internationalized/date";
import { IdCardIcon, Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";

const UpdateLicensesFormMutation = graphql`
mutation UpdateLicensesFormMutation($licenses: [LicenseInput!]!) {
  updateProfileLicenses(licenses: $licenses) {
    ...on Account {
		...IncompleteProfileBannerFragment
      profile {
          ...UpdateLicensesFormFragment
      }
    }
  }
}
`;

const UpdateLicensesFormFragment = graphql`
  fragment UpdateLicensesFormFragment on Profile {
    __typename
    licenses {
      name
      issuer
      licenseNumber
      issuedAt
      expiresAt
    }
  }
`;

type Props = {
	rootQuery: UpdateLicensesFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	licenses: z.array(
		z.object({
			name: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			issuer: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			licenseNumber: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			issuedAt: z.custom<CalendarDate>((data) => data instanceof CalendarDate),
			expiresAt: z.nullable(
				z.custom<CalendarDate>((data) => data instanceof CalendarDate),
			),
		}),
	),
});

export default function UpdateLicensesForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdateLicensesFormMutation,
	);
	const data = useFragment(UpdateLicensesFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues:
			data.licenses.length > 0
				? {
						licenses: data.licenses.map((lic) => ({
							name: lic.name,
							issuer: lic.issuer,
							licenseNumber: lic.licenseNumber,
							issuedAt: parseDate(lic.issuedAt),
							expiresAt: lic.expiresAt ? parseDate(lic.expiresAt) : null,
						})),
					}
				: {
						licenses: [
							{
								name: "",
								issuer: "",
								licenseNumber: "",
								issuedAt: undefined,
								expiresAt: undefined,
							},
						],
					},
	});

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: "licenses",
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				licenses: formData.licenses.map((lic) => ({
					name: lic.name,
					issuer: lic.issuer,
					licenseNumber: lic.licenseNumber,
					issuedAt: lic.issuedAt.toString(),
					expiresAt: lic.expiresAt ? lic.expiresAt.toString() : null,
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
					<div className="flex items-center gap-2 text-foreground-400">
						<IdCardIcon />
						<h1 className="w-full text-sm font-medium">Editing Licenses</h1>
					</div>
				</CardHeader>
				<CardBody className="w-full flex flex-col">
					{/* Dynamic Array of licenses */}
					<div className="w-full space-y-12 items-center">
						{fields.length === 0 ? (
							<div className="flex flex-col items-center gap-4">
								<p className="text-gray-500">
									No license entries. Add your licenses.
								</p>
								<Button
									type="button"
									variant="bordered"
									startContent={<Plus size={18} />}
									onPress={() =>
										append({
											name: "",
											issuer: "",
											licenseNumber: "",
											issuedAt: undefined,
											expiresAt: null,
										})
									}
								>
									Add License
								</Button>
							</div>
						) : (
							<>
								{fields.map((item, index) => (
									<div
										key={`field-${item.name}-${index}`}
										className="flex gap-8 items-end w-full flex-col"
									>
										<div className="w-full space-y-4">
											<Controller
												name={`licenses.${index}.name`}
												control={control}
												defaultValue=""
												render={({ field }) => (
													<Input
														{...field}
														fullWidth
														label="Name"
														placeholder="License name"
														errorMessage={
															errors.licenses?.[index]?.name?.message
														}
														isInvalid={!!errors.licenses?.[index]?.name}
													/>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<Controller
												name={`licenses.${index}.issuer`}
												control={control}
												defaultValue=""
												render={({ field }) => (
													<Input
														{...field}
														fullWidth
														label="Issuer"
														placeholder="License issuer"
														errorMessage={
															errors.licenses?.[index]?.issuer?.message
														}
														isInvalid={!!errors.licenses?.[index]?.issuer}
													/>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<Controller
												name={`licenses.${index}.licenseNumber`}
												control={control}
												defaultValue=""
												render={({ field }) => (
													<Input
														{...field}
														fullWidth
														label="License Number"
														placeholder="License number"
														errorMessage={
															errors.licenses?.[index]?.licenseNumber?.message
														}
														isInvalid={
															!!errors.licenses?.[index]?.licenseNumber
														}
													/>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<Controller
												name={`licenses.${index}.issuedAt`}
												control={control}
												defaultValue={undefined}
												render={({ field }) => (
													<DatePicker
														{...field}
														label="Issued At"
														errorMessage={
															errors.licenses?.[index]?.issuedAt?.message
														}
														isInvalid={!!errors.licenses?.[index]?.issuedAt}
													/>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<Controller
												name={`licenses.${index}.expiresAt`}
												control={control}
												defaultValue={undefined}
												render={({ field }) => (
													<DatePicker
														{...field}
														label="Expires At"
														errorMessage={
															errors.licenses?.[index]?.expiresAt?.message
														}
														isInvalid={!!errors.licenses?.[index]?.expiresAt}
													/>
												)}
											/>
										</div>
										<Button
											type="button"
											variant="bordered"
											startContent={<Trash size={18} />}
											onPress={() => remove(index)}
										>
											Delete License
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
											issuer: "",
											licenseNumber: "",
											issuedAt: undefined,
											expiresAt: undefined,
										})
									}
								>
									Add License
								</Button>
							</>
						)}
					</div>
				</CardBody>
			</Card>
			<div className="flex gap-4 justify-end">
				<Button type="button" variant="light" onPress={handleCancel}>
					Cancel
				</Button>
				<Button type="submit" isLoading={isSubmitting || isMutationInFlight}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}

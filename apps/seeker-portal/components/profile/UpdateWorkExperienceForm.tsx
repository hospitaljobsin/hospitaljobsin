import type { UpdateWorkExperienceFormFragment$key } from "@/__generated__/UpdateWorkExperienceFormFragment.graphql";
import type { DateValue } from "@heroui/react";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	DatePicker,
	Input,
	Kbd,
	Select,
	SelectItem,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CalendarDate, parseDate } from "@internationalized/date";
import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";
import { ChipsInput } from "../forms/ChipsInput";

const UpdateWorkExperienceFormMutation = graphql`
mutation UpdateWorkExperienceFormMutation($workExperience: [WorkExperienceInput!]!) {
  updateProfileExperience(workExperience: $workExperience) {
    ...on Account {
      profile {
        ... on Profile {
          ...UpdateWorkExperienceFormFragment
        }
      }
    }
  }
}
`;

const UpdateWorkExperienceFormFragment = graphql`
  fragment UpdateWorkExperienceFormFragment on Profile {
    __typename
    workExperience {
      title
      organization
      startedAt
      completedAt
      employmentType
      skills
    }
  }
`;

type Props = {
	rootQuery: UpdateWorkExperienceFormFragment$key;
	onSaveChanges: () => void;
};

const EMPLOYMENT_TYPE_OPTIONS = [
	{ value: "FULL_TIME", label: "Full Time" },
	{ value: "PART_TIME", label: "Part Time" },
	{ value: "CONTRACT", label: "Contract" },
	{ value: "INTERNSHIP", label: "Internship" },
	{ value: "TEMPORARY", label: "Temporary" },
	{ value: "VOLUNTEER", label: "Volunteer" },
	{ value: "OTHER", label: "Other" },
];

const formSchema = z.object({
	workExperience: z.array(
		z.object({
			title: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			organization: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			employmentType: z.nullable(
				z.union([
					z.enum([
						"FULL_TIME",
						"PART_TIME",
						"CONTRACT",
						"INTERNSHIP",
						"TEMPORARY",
						"VOLUNTEER",
						"OTHER",
					]),
					z.literal(""),
				]),
			),
			skills: z.array(z.object({ value: z.string() })),
			startedAt: z.custom<CalendarDate | null>(
				(data) => data === null || data instanceof CalendarDate,
			),
			completedAt: z.custom<CalendarDate | null>(
				(data) => data === null || data instanceof CalendarDate,
			),
		}),
	),
});

export default function UpdateWorkExperienceForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdateWorkExperienceFormMutation,
	);
	const data = useFragment(UpdateWorkExperienceFormFragment, rootQuery);

	const defaultWorkExperience = {
		title: "",
		organization: "",
		employmentType: undefined,
		skills: [],
		startedAt: null,
		completedAt: null,
	};

	const defaultValues =
		data.workExperience.length > 0
			? {
					workExperience: data.workExperience.map((exp) => ({
						title: exp.title,
						organization: exp.organization,
						employmentType: exp.employmentType,
						skills: exp.skills.map((skill) => ({ value: skill })),
						startedAt: exp.startedAt
							? (parseDate(exp.startedAt) as DateValue)
							: null,
						completedAt: exp.completedAt
							? (parseDate(exp.completedAt) as DateValue)
							: null,
					})),
				}
			: {
					workExperience: [{ ...defaultWorkExperience }],
				};

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues,
	});

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: "workExperience",
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				workExperience: formData.workExperience.map((exp) => ({
					title: exp.title,
					organization: exp.organization,
					employmentType: exp.employmentType || null,
					skills: exp.skills.flatMap((skill) => skill.value),
					startedAt: exp.startedAt ? exp.startedAt.toString() : null,
					completedAt: exp.completedAt ? exp.completedAt.toString() : null,
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
					<h1 className="text-lg font-medium">Editing Work Experience</h1>
				</CardHeader>
				<CardBody>
					{/* Dynamic Array of work experience */}
					<div className="w-full space-y-12 items-center">
						{fields.length === 0 ? (
							<div className="flex flex-col items-center gap-4">
								<p className="text-gray-500">
									No work experience entries. Add your work experience.
								</p>
								<Button
									type="button"
									variant="bordered"
									startContent={<Plus size={18} />}
									onPress={() => append({ ...defaultWorkExperience })}
								>
									Add Work Experience
								</Button>
							</div>
						) : (
							<>
								{fields.map((item, index) => (
									<div
										key={`field-${item.title}-${item.organization}-${index}`}
										className="flex flex-col gap-8 items-end w-full"
									>
										<div className="w-full space-y-4">
											<Controller
												name={`workExperience.${index}.title`}
												control={control}
												defaultValue=""
												render={({ field }) => (
													<Input
														{...field}
														fullWidth
														label="Title"
														placeholder="Add job title"
														errorMessage={
															errors.workExperience?.[index]?.title?.message
														}
														isInvalid={!!errors.workExperience?.[index]?.title}
													/>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<Controller
												name={`workExperience.${index}.organization`}
												control={control}
												defaultValue=""
												render={({ field }) => (
													<Input
														{...field}
														fullWidth
														label="Organization"
														placeholder="Add organization"
														errorMessage={
															errors.workExperience?.[index]?.organization
																?.message
														}
														isInvalid={
															!!errors.workExperience?.[index]?.organization
														}
													/>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<Controller
												name={`workExperience.${index}.employmentType`}
												control={control}
												defaultValue={undefined}
												render={({ field }) => (
													<Select
														{...field}
														label="Employment Type"
														placeholder="Select employment type"
														selectionMode="single"
														selectedKeys={field.value ? [field.value] : []}
														defaultSelectedKeys={
															field.value ? [field.value] : []
														}
														onSelectionChange={(keys) => {
															const value = Array.from(keys)[0] as
																| string
																| undefined;
															console.log("value changed:", value);
															field.onChange(value);
														}}
														errorMessage={
															errors.workExperience?.[index]?.employmentType
																?.message
														}
														isInvalid={
															!!errors.workExperience?.[index]?.employmentType
														}
													>
														{EMPLOYMENT_TYPE_OPTIONS.map((option) => (
															<SelectItem key={option.value}>
																{option.label}
															</SelectItem>
														))}
													</Select>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<ChipsInput<
												z.infer<typeof formSchema>,
												`workExperience.${index}.skills`
											>
												name={`workExperience.${index}.skills`}
												control={control}
												label="Skills"
												delimiters={[",", "Enter"]}
												inputProps={{
													placeholder: "Enter skills...",
													description: (
														<p className="mt-2">
															Separate skills with commas or Enter{" "}
															<Kbd
																keys={["enter"]}
																classNames={{ base: "p-0 px-2 shadow-none" }}
															/>
														</p>
													),
												}}
											/>
										</div>
										<div className="w-full flex gap-4">
											<Controller
												name={`workExperience.${index}.startedAt`}
												control={control}
												render={({ field }) => (
													<DatePicker
														{...field}
														label="Start Date"
														errorMessage={
															errors.workExperience?.[index]?.startedAt?.message
														}
														isInvalid={
															!!errors.workExperience?.[index]?.startedAt
														}
														value={field.value as DateValue | null}
													/>
												)}
											/>
											<Controller
												name={`workExperience.${index}.completedAt`}
												control={control}
												render={({ field }) => (
													<DatePicker
														{...field}
														label="End Date"
														errorMessage={
															errors.workExperience?.[index]?.completedAt
																?.message
														}
														isInvalid={
															!!errors.workExperience?.[index]?.completedAt
														}
														value={field.value as DateValue | null}
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
											Delete Experience
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="bordered"
									startContent={<Plus size={18} />}
									onPress={() => append({ ...defaultWorkExperience })}
								>
									Add Work Experience
								</Button>
							</>
						)}
					</div>
				</CardBody>
				<div className="flex gap-4 justify-end">
					<Button type="button" variant="light" onPress={handleCancel}>
						Cancel
					</Button>
					<Button
						type="submit"
						color="primary"
						isLoading={isSubmitting || isMutationInFlight}
					>
						Save Changes
					</Button>
				</div>
			</Card>
		</form>
	);
}

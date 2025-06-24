import type { UpdateWorkExperienceFormFragment$key } from "@/__generated__/UpdateWorkExperienceFormFragment.graphql";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Checkbox,
	Input,
	Kbd,
	Select,
	SelectItem,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { BriefcaseIcon, Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";
import { ChipsInput } from "../forms/ChipsInput";
import type { MonthYearValue } from "../forms/MonthYearPicker";
import {
	MonthYearPicker,
	parseMonthYear,
	toDateString,
} from "../forms/MonthYearPicker";

const UpdateWorkExperienceFormMutation = graphql`
mutation UpdateWorkExperienceFormMutation($workExperience: [WorkExperienceInput!]!) {
  updateProfileExperience(workExperience: $workExperience) {
    ...on Account {
		...IncompleteProfileBannerFragment
      profile {
          ...UpdateWorkExperienceFormFragment
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

type EmploymentType =
	| ""
	| "FULL_TIME"
	| "PART_TIME"
	| "CONTRACT"
	| "INTERNSHIP"
	| "TEMPORARY"
	| "VOLUNTEER"
	| "OTHER";

type WorkExperienceFormType = {
	workExperience: Array<{
		title: string;
		organization: string;
		employmentType: EmploymentType;
		skills: { value: string }[];
		startedAt: MonthYearValue;
		completedAt: MonthYearValue;
		isCurrentRole?: boolean;
	}>;
};

type WorkExperienceFragmentItem = {
	title: string;
	organization: string;
	employmentType: string | null | undefined;
	skills: readonly string[];
	startedAt: string | null;
	completedAt: string | null;
};

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

const allowedEmploymentTypes: EmploymentType[] = [
	"",
	"FULL_TIME",
	"PART_TIME",
	"CONTRACT",
	"INTERNSHIP",
	"TEMPORARY",
	"VOLUNTEER",
	"OTHER",
];

function toEmploymentType(val: string | null | undefined): EmploymentType {
	return allowedEmploymentTypes.includes(val as EmploymentType)
		? (val as EmploymentType)
		: "";
}

const formSchema = z.object({
	workExperience: z.array(
		z.object({
			title: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			organization: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			employmentType: z.enum([
				"FULL_TIME",
				"PART_TIME",
				"CONTRACT",
				"INTERNSHIP",
				"TEMPORARY",
				"VOLUNTEER",
				"OTHER",
				"",
			]),
			skills: z.array(z.object({ value: z.string() })),
			startedAt: z.custom<MonthYearValue>((data) => {
				if (data === null) return true;
				if (
					typeof data === "object" &&
					data !== null &&
					typeof data.month === "number" &&
					typeof data.year === "number"
				)
					return true;
				return false;
			}),
			completedAt: z.custom<MonthYearValue>((data) => {
				if (data === null) return true;
				if (
					typeof data === "object" &&
					data !== null &&
					typeof data.month === "number" &&
					typeof data.year === "number"
				)
					return true;
				return false;
			}),
			isCurrentRole: z.boolean(),
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

	const defaultWorkExperience: WorkExperienceFormType["workExperience"][number] =
		{
			title: "",
			organization: "",
			employmentType: "",
			skills: [],
			startedAt: null,
			completedAt: null,
			isCurrentRole: true,
		};

	const defaultValues: WorkExperienceFormType =
		data.workExperience.length > 0
			? {
					workExperience: data.workExperience.map(
						(exp: WorkExperienceFragmentItem) => ({
							title: exp.title,
							organization: exp.organization,
							employmentType: toEmploymentType(exp.employmentType),
							skills: exp.skills.map((skill: string) => ({ value: skill })),
							startedAt: parseMonthYear(exp.startedAt),
							completedAt: parseMonthYear(exp.completedAt),
							isCurrentRole: !exp.completedAt,
						}),
					),
				}
			: {
					workExperience: [{ ...defaultWorkExperience }],
				};

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<WorkExperienceFormType>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues,
	});

	const value = useWatch({
		control,
		name: "workExperience",
	});

	const { fields, append, remove } = useFieldArray<WorkExperienceFormType>({
		control: control,
		name: "workExperience",
	});

	function onSubmit(formData: WorkExperienceFormType) {
		let hasValidationErrors = false;
		for (let index = 0; index < formData.workExperience.length; index++) {
			const exp = formData.workExperience[index];
			if (exp.startedAt && exp.completedAt) {
				if (exp.startedAt.year > exp.completedAt.year) {
					setError(
						`workExperience.${index}.completedAt`,
						{
							message: "Start date cannot be after end date",
						},
						{ shouldFocus: true },
					);
					hasValidationErrors = true;
				}

				if (
					exp.startedAt.year > new Date().getFullYear() ||
					(exp.startedAt.year === new Date().getFullYear() &&
						exp.startedAt.month > new Date().getMonth() + 1)
				) {
					setError(
						`workExperience.${index}.startedAt`,
						{
							message: "Start date cannot be in the future",
						},
						{ shouldFocus: true },
					);
					hasValidationErrors = true;
				}

				if (
					exp.completedAt.year > new Date().getFullYear() ||
					(exp.completedAt.year === new Date().getFullYear() &&
						exp.completedAt.month > new Date().getMonth() + 1)
				) {
					setError(
						`workExperience.${index}.completedAt`,
						{
							message: "End date cannot be in the future",
						},
						{ shouldFocus: true },
					);
					hasValidationErrors = true;
				}
			}
		}

		if (hasValidationErrors) {
			return;
		}

		commitMutation({
			variables: {
				workExperience: formData.workExperience.map((exp) => ({
					title: exp.title,
					organization: exp.organization,
					employmentType: exp.employmentType || null,
					skills: exp.skills.flatMap((skill) => skill.value),
					startedAt: toDateString(exp.startedAt),
					completedAt: exp.isCurrentRole ? null : toDateString(exp.completedAt),
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
						<BriefcaseIcon />
						<h1 className="w-full text-sm font-medium">
							Editing Work Experience
						</h1>
					</div>
				</CardHeader>
				<CardBody>
					{/* Dynamic Array of work experience */}
					<div className="w-full space-y-12 items-center">
						{fields.length === 0 ? (
							<div className="flex flex-col items-center gap-4">
								<p className="text-foreground-500">
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
										key={item.id}
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
												defaultValue={""}
												render={({ field }) => (
													<Select
														{...field}
														label="Employment Type"
														placeholder="Select employment type"
														selectionMode="single"
														selectedKeys={field.value ? [field.value] : [""]}
														defaultSelectedKeys={
															field.value ? [field.value] : [""]
														}
														onSelectionChange={(keys) => {
															const value = Array.from(
																keys,
															)[0] as EmploymentType;
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
												WorkExperienceFormType,
												`workExperience.${number}.skills`
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
										<div className="w-full flex gap-4 items-center">
											<Controller
												name={`workExperience.${index}.isCurrentRole`}
												control={control}
												render={({ field }) => (
													<Checkbox
														isSelected={field.value}
														onValueChange={field.onChange}
														aria-label="I am currently working in this role"
														className="mb-2"
													>
														I am currently working in this role
													</Checkbox>
												)}
											/>
										</div>
										<div className="w-full flex flex-col sm:flex-row gap-4">
											<Controller
												name={`workExperience.${index}.startedAt`}
												control={control}
												render={({ field }) => (
													<MonthYearPicker
														label="Start Date"
														value={field.value}
														onChange={field.onChange}
														errorMessage={
															errors.workExperience?.[index]?.startedAt?.message
														}
														isInvalid={
															!!errors.workExperience?.[index]?.startedAt
														}
													/>
												)}
											/>
											<Controller
												name={`workExperience.${index}.completedAt`}
												control={control}
												render={({ field }) => {
													const isCurrentRole =
														value[index]?.isCurrentRole || false;
													return (
														<MonthYearPicker
															label="End Date"
															value={isCurrentRole ? null : field.value}
															onChange={field.onChange}
															isDisabled={isCurrentRole}
															errorMessage={
																errors.workExperience?.[index]?.completedAt
																	?.message
															}
															isInvalid={
																!!errors.workExperience?.[index]?.completedAt
															}
														/>
													);
												}}
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

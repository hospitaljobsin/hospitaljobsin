// NOTE: The mutation below assumes an EducationInput type exists in your GraphQL schema:
// input EducationInput { degree: String!, institution: String!, yearCompleted: Int! }
// You must add this input type and the updateProfileEducation mutation on the backend for this to work.
import type { UpdateEducationFormFragment$key } from "@/__generated__/UpdateEducationFormFragment.graphql";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { BookIcon, Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";
import {
	MonthYearPicker,
	parseMonthYear,
	toDateString,
} from "../forms/MonthYearPicker";

const UpdateEducationFormMutation = graphql`
mutation UpdateEducationFormMutation($education: [EducationInput!]!) {
  updateProfileEducation(education: $education) {
    ...on Account {
		...IncompleteProfileBannerFragment
      profile  {
          ...UpdateEducationFormFragment
      }
    }
  }
}
`;

const UpdateEducationFormFragment = graphql`
  fragment UpdateEducationFormFragment on Profile {
    __typename
    education {
      degree
      institution
      startedAt
      completedAt
    }
  }
`;

type Props = {
	rootQuery: UpdateEducationFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	education: z.array(
		z.object({
			degree: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			institution: z
				.string()
				.check(z.minLength(1, "This field is required"), z.maxLength(100)),
			startedAt: z.custom<{ month: number; year: number }>((data) => {
				return (
					data &&
					typeof data === "object" &&
					data !== null &&
					typeof data.month === "number" &&
					typeof data.year === "number"
				);
			}, "Start date is required and must be a valid month/year"),
			completedAt: z.custom<{ month: number; year: number }>((data) => {
				return (
					data &&
					typeof data === "object" &&
					data !== null &&
					typeof data.month === "number" &&
					typeof data.year === "number"
				);
			}, "End date is required and must be a valid month/year"),
		}),
	),
});

export default function UpdateEducationForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdateEducationFormMutation,
	);
	const data = useFragment(UpdateEducationFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues:
			data.education.length > 0
				? {
						education: data.education.map((edu) => {
							return {
								degree: edu.degree,
								institution: edu.institution,
								startedAt: parseMonthYear(edu.startedAt),
								completedAt: parseMonthYear(edu.completedAt),
							};
						}),
					}
				: {
						education: [
							{
								degree: "",
								institution: "",
								startedAt: { month: 1, year: 2000 },
								completedAt: { month: 1, year: 2000 },
							},
						],
					},
	});

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: "education",
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		let hasValidationErrors = false;
		for (let index = 0; index < formData.education.length; index++) {
			const exp = formData.education[index];
			if (
				exp.startedAt &&
				(exp.startedAt.year > new Date().getFullYear() ||
					(exp.startedAt.year === new Date().getFullYear() &&
						exp.startedAt.month > new Date().getMonth() + 1))
			) {
				setError(
					`education.${index}.startedAt`,
					{
						message: "Start date cannot be in the future",
					},
					{ shouldFocus: true },
				);
				hasValidationErrors = true;
			}

			if (exp.startedAt && exp.completedAt) {
				if (exp.startedAt.year > exp.completedAt.year) {
					setError(
						`education.${index}.completedAt`,
						{
							message: "Start date cannot be after end date",
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
				education: formData.education.map((edu) => ({
					degree: edu.degree,
					institution: edu.institution,
					startedAt: toDateString(edu.startedAt),
					completedAt: toDateString(edu.completedAt),
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
						<BookIcon />
						<h1 className="w-full text-sm font-medium">Editing Education</h1>
					</div>
				</CardHeader>
				<CardBody>
					{/* Dynamic Array of education */}
					<div className="w-full space-y-12 items-center">
						{fields.length === 0 ? (
							<div className="flex flex-col items-center gap-4">
								<p className="text-foreground-500">
									No education entries. Add your education history.
								</p>
								<Button
									type="button"
									variant="bordered"
									startContent={<Plus size={18} />}
									onPress={() =>
										append({
											degree: "",
											institution: "",
											startedAt: { month: 1, year: 2000 },
											completedAt: { month: 1, year: 2000 },
										})
									}
								>
									Add Education
								</Button>
							</div>
						) : (
							<>
								{fields.map((item, index) => (
									<div
										key={`field-${item.degree}-${item.institution}-${index}`}
										className="flex flex-col gap-8 items-end w-full"
									>
										<div className="w-full space-y-4">
											<Controller
												name={`education.${index}.degree`}
												control={control}
												defaultValue=""
												render={({ field }) => (
													<Input
														{...field}
														fullWidth
														label="Degree"
														placeholder="Add degree"
														errorMessage={
															errors.education?.[index]?.degree?.message
														}
														isInvalid={!!errors.education?.[index]?.degree}
													/>
												)}
											/>
										</div>
										<div className="w-full space-y-4">
											<Controller
												name={`education.${index}.institution`}
												control={control}
												defaultValue=""
												render={({ field }) => (
													<Input
														{...field}
														fullWidth
														label="Institution"
														placeholder="Add institution"
														errorMessage={
															errors.education?.[index]?.institution?.message
														}
														isInvalid={!!errors.education?.[index]?.institution}
													/>
												)}
											/>
										</div>
										<div className="w-full flex gap-4 flex-col sm:flex-row">
											<div className="flex gap-2 w-full">
												<Controller
													control={control}
													name={`education.${index}.startedAt`}
													render={({ field }) => (
														<MonthYearPicker
															label="Start Date"
															value={field.value}
															onChange={field.onChange}
															errorMessage={
																errors.education?.[index]?.startedAt?.message
															}
															isInvalid={!!errors.education?.[index]?.startedAt}
														/>
													)}
												/>
											</div>
											<Controller
												control={control}
												name={`education.${index}.completedAt`}
												render={({ field }) => (
													<MonthYearPicker
														label="End Date"
														value={field.value}
														onChange={field.onChange}
														errorMessage={
															errors.education?.[index]?.completedAt?.message
														}
														isInvalid={!!errors.education?.[index]?.completedAt}
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
											Delete Education
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="bordered"
									startContent={<Plus size={18} />}
									onPress={() =>
										append({
											degree: "",
											institution: "",
											startedAt: { month: 1, year: 2000 },
											completedAt: { month: 1, year: 2000 },
										})
									}
								>
									Add Education
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

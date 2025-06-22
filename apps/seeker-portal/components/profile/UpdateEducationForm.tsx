// NOTE: The mutation below assumes an EducationInput type exists in your GraphQL schema:
// input EducationInput { degree: String!, institution: String!, yearCompleted: Int! }
// You must add this input type and the updateProfileEducation mutation on the backend for this to work.
import type { UpdateEducationFormFragment$key } from "@/__generated__/UpdateEducationFormFragment.graphql";
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
import { BookIcon, Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";

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
			startedAt: z.custom<CalendarDate>((data) => data instanceof CalendarDate),
			completedAt: z.custom<CalendarDate>(
				(data) => data instanceof CalendarDate,
			),
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
								startedAt: parseDate(edu.startedAt),
								completedAt: parseDate(edu.completedAt),
							};
						}),
					}
				: {
						education: [
							{
								degree: "",
								institution: "",
								startedAt: undefined,
								completedAt: undefined,
							},
						],
					},
	});

	const { fields, append, remove } = useFieldArray({
		control: control,
		name: "education",
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				education: formData.education.map((edu) => ({
					degree: edu.degree,
					institution: edu.institution,
					startedAt: edu.startedAt.toString(),
					completedAt: edu.completedAt.toString(),
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
											startedAt: undefined,
											completedAt: undefined,
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
													render={({ field }) => {
														return (
															<DatePicker
																label="Start Date"
																showMonthAndYearPickers
																selectorButtonPlacement="start"
																errorMessage={
																	errors.education?.[index]?.startedAt?.message
																}
																isInvalid={
																	!!errors.education?.[index]?.startedAt
																}
																value={field.value ?? undefined}
																onChange={field.onChange}
															/>
														);
													}}
												/>
											</div>
											<Controller
												control={control}
												name={`education.${index}.completedAt`}
												render={({ field }) => {
													return (
														<DatePicker
															label="End Date"
															showMonthAndYearPickers
															selectorButtonPlacement="start"
															errorMessage={
																errors.education?.[index]?.completedAt?.message
															}
															isInvalid={
																!!errors.education?.[index]?.completedAt
															}
															value={field.value ?? undefined}
															onChange={field.onChange}
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
											startedMonth: String(new Date().getMonth() + 1).padStart(
												2,
												"0",
											),
											startedYear: String(new Date().getFullYear()),
											completedMonth: String(
												new Date().getMonth() + 1,
											).padStart(2, "0"),
											completedYear: String(new Date().getFullYear()),
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

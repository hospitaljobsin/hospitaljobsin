"use client";
import type { NewJobFormAccountFragment$key } from "@/__generated__/NewJobFormAccountFragment.graphql";
import type { NewJobFormMutation } from "@/__generated__/NewJobFormMutation.graphql";
import type { NewJobFormOrganizationFragment$key } from "@/__generated__/NewJobFormOrganizationFragment.graphql";
import { ChipsInput } from "@/components/forms/ChipsInput";
import FixedMenu from "@/components/forms/text-editor/FixedMenu";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import {
	Accordion,
	AccordionItem,
	Button,
	Card,
	CardBody,
	CardFooter,
	DatePicker,
	Input,
	Kbd,
	Link,
	NumberInput,
	Radio,
	RadioGroup,
	addToast,
	cn,
	useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate } from "@internationalized/date";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	BriefcaseBusiness,
	IndianRupee,
	MapPin,
	TimerIcon,
} from "lucide-react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { Markdown } from "tiptap-markdown";
import { z } from "zod";
import CancelNewJobModal from "./CancelNewJobModal";

const CreateJobMutation = graphql`
mutation NewJobFormMutation(
	$title: String!, 
	$description: String!, 
	$skills: [String!]!, 
	$address: AddressInput! 
	$organizationId: ID!, 
	$hasSalaryRange: Boolean!, 
	$minSalary: Int, 
	$maxSalary: Int, 
	$hasExperienceRange: Boolean!, 
	$minExperience: Int, 
	$maxExperience: Int,
	$expiresAt: datetime,
	$workMode: WorkMode,
	$jobType: JobType
) {
    createJob(
		title: $title,
		description: $description, 
		skills: $skills, 
		address: $address, 
		organizationId: $organizationId, 
		hasSalaryRange: $hasSalaryRange, 
		minSalary: $minSalary, 
		maxSalary: $maxSalary, 
		hasExperienceRange: $hasExperienceRange, 
		minExperience: $minExperience, 
		maxExperience: $maxExperience,
		expiresAt: $expiresAt,
		workMode: $workMode,
		jobType: $jobType
	) {
        __typename
        ...on CreateJobSuccess {
            __typename
            jobEdge {
				node {
					slug
				}
			}
        }

		... on OrganizationNotFoundError {
			__typename
		}
    }
}
`;

const NewJobFormAccountFragment = graphql`
fragment NewJobFormAccountFragment on Account {
	__typename
	fullName
	avatarUrl
}
`;

const NewJobFormOrganizationFragment = graphql`
fragment NewJobFormOrganizationFragment on Organization {
	__typename
	slug
	id
	address {
		city
		country
		line1
		line2
		pincode
		state
	}
	...CancelNewJobModalOrganizationFragment
}
`;

const formSchema = z.object({
	title: z.string().min(1, "This field is required").max(75),
	description: z.string().min(1, "This field is required").max(2000),
	skills: z.array(z.object({ value: z.string() })),
	address: z.object({
		city: z.string().nullable(),
		country: z.string().nullable(),
		line1: z.string().nullable(),
		line2: z.string().nullable(),
		pincode: z.string().nullable(),
		state: z.string().nullable(),
	}),
	minSalary: z.number().positive().nullable(),
	maxSalary: z.number().positive().nullable(),
	minExperience: z.number().positive().nullable(),
	maxExperience: z.number().positive().nullable(),
	expiresAt: z.instanceof(CalendarDate).nullable(),
	jobType: z
		.enum(["CONTRACT", "FULL_TIME", "INTERNSHIP", "PART_TIME"])
		.nullable(),
	workMode: z.enum(["HYBRID", "OFFICE", "REMOTE"]).nullable(),
});

type Props = {
	account: NewJobFormAccountFragment$key;
	organization: NewJobFormOrganizationFragment$key;
};

export default function NewJobForm({ account, organization }: Props) {
	const router = useRouter();
	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	const data = useFragment(NewJobFormAccountFragment, account);
	const organizationData = useFragment(
		NewJobFormOrganizationFragment,
		organization,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<NewJobFormMutation>(CreateJobMutation);

	const {
		handleSubmit,
		register,
		setValue,
		control,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		reValidateMode: "onChange",
		defaultValues: {
			title: "",
			description: "",
			skills: [],
			address: {
				city: organizationData.address.city,
				country: organizationData.address.country,
				line1: organizationData.address.line1,
				line2: organizationData.address.line2,
				pincode: organizationData.address.pincode,
				state: organizationData.address.state,
			},
			minSalary: null,
			maxSalary: null,
			minExperience: null,
			maxExperience: null,
			expiresAt: null,
			jobType: null,
			workMode: null,
		},
	});

	const editor = useEditor({
		extensions: [StarterKit, Markdown],
		content: "",
		immediatelyRender: false,
		shouldRerenderOnTransaction: false,
		editorProps: {
			attributes: {
				class: cn(
					"p-4 prose prose-sm focus:outline-none border-2 w-full min-w-full rounded-md min-h-56",
					{
						"border-danger": errors.description,
						"border-background-700": !errors.description,
					},
				),
			},
		},
		onUpdate({ editor }) {
			// convert the editor's JSON to markdown
			const markdown = editor.storage.markdown.getMarkdown();
			setValue("description", markdown, {
				shouldDirty: true,
				shouldValidate: true,
			});
		},
	});

	function handleCancel() {
		if (isDirty) {
			// show confirmation modal
			onOpen();
		} else {
			router.push(links.organizationDetailJobs(organizationData.slug));
		}
	}

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				organizationId: organizationData.id,
				title: formData.title,
				description: formData.description,
				skills: formData.skills.flatMap((skill) => skill.value),
				address: {
					city: formData.address.city,
					country: formData.address.country,
					line1: formData.address.line1,
					line2: formData.address.line2,
					pincode: formData.address.pincode,
					state: formData.address.state,
				},
				hasSalaryRange:
					formData.minSalary !== null || formData.maxSalary !== null,
				minSalary: formData.minSalary,
				maxSalary: formData.maxSalary,
				hasExperienceRange:
					formData.minExperience !== null || formData.maxExperience !== null,
				minExperience: formData.minExperience,
				maxExperience: formData.maxExperience,
				expiresAt: formData.expiresAt ? formData.expiresAt.toString() : null,
				jobType: formData.jobType,
				workMode: formData.workMode,
			},
			onCompleted(response) {
				if (response.createJob.__typename === "OrganizationNotFoundError") {
					addToast({
						color: "danger",
						title: "An unexpected error occurred. Please try again.",
					});
				} else if (response.createJob.__typename === "CreateJobSuccess") {
					// Redirect to the organization detail page
					router.push(
						links.organizationJobDetail(
							organizationData.slug,
							response.createJob.jobEdge.node.slug,
						),
					);
				}
			},
		});
	}

	return (
		<>
			<div className="w-full gap-6 flex flex-col sm:flex-row items-start">
				<Image
					src={data.avatarUrl}
					alt={data.fullName}
					width={35}
					height={35}
					className="rounded-full hidden sm:block"
				/>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
					<h2 className="text-lg font-medium mt-1 text-foreground-400">
						Create new job posting
					</h2>
					<Card shadow="none" className="p-6 gap-12 flex flex-col">
						<CardBody className="flex flex-col gap-12 overflow-y-hidden">
							<Input
								{...register("title")}
								label="Job Title"
								labelPlacement="outside"
								placeholder="My Job Title"
								errorMessage={errors.title?.message}
								isInvalid={!!errors.title}
								isRequired
								validationBehavior="aria"
							/>
							<div className="flex flex-col gap-4 w-full">
								<h2
									className={cn("text-small inline-flex gap-0.5", {
										"text-danger": errors.description,
									})}
								>
									Job Description <p className="text-danger">*</p>
								</h2>
								<div className="w-full flex flex-col gap-4">
									<FixedMenu editor={editor} />
									<div className="flex flex-col w-full gap-1">
										<EditorContent editor={editor} className="w-full" />

										{errors.description ? (
											<p className="text-tiny text-danger">
												{errors.description.message}
											</p>
										) : (
											<p className="text-tiny text-foreground-400">
												Markdown editing is supported.{" "}
												<Link
													isExternal
													showAnchorIcon
													href="https://www.markdownguide.org/getting-started/"
													size="sm"
													className="text-tiny"
												>
													Learn more
												</Link>
											</p>
										)}
									</div>
								</div>
							</div>
							<ChipsInput<z.infer<typeof formSchema>, "skills">
								name="skills"
								label="Job Skills"
								delimiters={[",", "Enter"]}
								control={control}
								chipProps={{
									variant: "flat",
								}}
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
							<div className="w-full flex flex-col sm:flex-row gap-12 items-start justify-start">
								{/* Job Type */}
								<Controller
									control={control}
									name="jobType"
									render={({ field }) => {
										return (
											<RadioGroup
												label="Select Job Type"
												value={field.value}
												onValueChange={field.onChange}
												className="flex-1 w-full"
											>
												<Radio value="CONTRACT">Contract</Radio>
												<Radio value="FULL_TIME">Full Time</Radio>
												<Radio value="INTERNSHIP">Internship</Radio>
												<Radio value="PART_TIME">Part Time</Radio>
											</RadioGroup>
										);
									}}
								/>
								{/* Work Mode */}
								<Controller
									control={control}
									name="workMode"
									render={({ field }) => {
										return (
											<RadioGroup
												label="Select Work Mode"
												value={field.value}
												onValueChange={field.onChange}
												className="flex-1 w-full"
											>
												<Radio value="HYBRID">Hybrid</Radio>
												<Radio value="OFFICE">Office</Radio>
												<Radio value="REMOTE">Remote</Radio>
											</RadioGroup>
										);
									}}
								/>
							</div>
							<Accordion
								selectionMode="multiple"
								variant="light"
								keepContentMounted
								fullWidth
								itemClasses={{ base: "pb-8" }}
							>
								<AccordionItem
									key="salary-range"
									aria-label="Salary range"
									title="Salary range"
									startContent={<IndianRupee size={20} />}
								>
									<div className="w-full flex gap-6 items-start">
										<Controller
											control={control}
											name="minSalary"
											render={({ field }) => {
												return (
													<NumberInput
														errorMessage={errors.minSalary?.message}
														isInvalid={!!errors.minSalary}
														label="Minimum Salary"
														placeholder="Enter minimum salary"
														formatOptions={{
															style: "currency",
															currency: "INR",
															currencyDisplay: "code",
															currencySign: "accounting",
														}}
														value={field.value || 0}
														onValueChange={(value) => {
															field.onChange(value);
														}}
													/>
												);
											}}
										/>
										<Controller
											control={control}
											name="maxSalary"
											render={({ field }) => {
												return (
													<NumberInput
														errorMessage={errors.maxSalary?.message}
														isInvalid={!!errors.maxSalary}
														label="Maximum Salary"
														placeholder="Enter maximum salary"
														formatOptions={{
															style: "currency",
															currency: "INR",
															currencyDisplay: "code",
															currencySign: "accounting",
														}}
														value={field.value || 0}
														onValueChange={(value) => {
															field.onChange(value);
														}}
													/>
												);
											}}
										/>
									</div>
								</AccordionItem>
								<AccordionItem
									key="experience-range"
									aria-label="Experience range"
									title="Experience range"
									startContent={<BriefcaseBusiness size={20} />}
								>
									<div className="w-full flex gap-6 items-start">
										<Controller
											control={control}
											name="minExperience"
											render={({ field }) => {
												return (
													<NumberInput
														errorMessage={errors.minExperience?.message}
														isInvalid={!!errors.minExperience}
														label="Minimum Experience"
														placeholder="Enter minimum experience"
														formatOptions={{
															style: "unit",
															unit: "year",
															unitDisplay: "long",
														}}
														value={field.value || 0}
														onValueChange={(value) => {
															field.onChange(value);
														}}
													/>
												);
											}}
										/>
										<Controller
											control={control}
											name="maxExperience"
											render={({ field }) => {
												return (
													<NumberInput
														errorMessage={errors.maxExperience?.message}
														isInvalid={!!errors.maxExperience}
														label="Maximum Experience"
														placeholder="Enter maximum experience"
														formatOptions={{
															style: "unit",
															unit: "year",
															unitDisplay: "long",
														}}
														value={field.value || 0}
														onValueChange={(value) => {
															field.onChange(value);
														}}
													/>
												);
											}}
										/>
									</div>
								</AccordionItem>
								<AccordionItem
									key="expires-at"
									aria-label="Posting expires at"
									title="Posting expires at"
									startContent={<TimerIcon size={20} />}
								>
									<Controller
										control={control}
										name="expiresAt"
										render={({ field }) => {
											return (
												<DatePicker
													showMonthAndYearPickers
													selectorButtonPlacement="start"
													granularity="hour"
													errorMessage={errors.expiresAt?.message}
													isInvalid={!!errors.expiresAt}
													value={field.value ?? undefined}
													onChange={field.onChange}
												/>
											);
										}}
									/>
								</AccordionItem>
								<AccordionItem
									key="address"
									aria-label="Address"
									title="Address"
									startContent={<MapPin size={20} />}
								>
									<div className="flex flex-col gap-4">
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
									</div>
								</AccordionItem>
							</Accordion>
						</CardBody>
						<CardFooter className="w-full justify-end gap-6">
							<Button type="button" variant="bordered" onPress={handleCancel}>
								Cancel
							</Button>
							<Button
								type="submit"
								color="primary"
								isLoading={isSubmitting || isMutationInFlight}
							>
								Create Job
							</Button>
						</CardFooter>
					</Card>
				</form>
			</div>
			<CancelNewJobModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				organization={organizationData}
			/>
		</>
	);
}

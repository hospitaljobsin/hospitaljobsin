"use client";
import type { NewJobFormAccountFragment$key } from "@/__generated__/NewJobFormAccountFragment.graphql";
import type { NewJobFormMutation } from "@/__generated__/NewJobFormMutation.graphql";
import type { NewJobFormOrganizationFragment$key } from "@/__generated__/NewJobFormOrganizationFragment.graphql";
import { ChipsInput } from "@/components/forms/ChipsInput";
import FixedMenu from "@/components/forms/text-editor/FixedMenu";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Input,
	Kbd,
	Link,
	addToast,
	useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { Markdown } from "tiptap-markdown";
import { z } from "zod";
import CancelNewJobModal from "./CancelNewJobModal";

const CreateJobMutation = graphql`
mutation NewJobFormMutation($title: String!, $description: String!, $application: String!, $skills: [String!]!, $address: AddressInput! $organizationId: ID!) {
    createJob(title: $title, description: $description, application: $application, skills: $skills, address: $address, organizationId: $organizationId) {
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
	...CancelNewJobModalOrganizationFragment
}
`;

const formSchema = z.object({
	title: z.string().min(1, "This field is required").max(75),
	description: z.string().min(1, "This field is required").max(75),
	application: z.string().min(1, "This field is required").url(),
	skills: z.array(z.object({ value: z.string() })),
	address: z.object({
		city: z.string().nullable(),
		country: z.string().nullable(),
		line1: z.string().nullable(),
		line2: z.string().nullable(),
		pincode: z.string().nullable(),
		state: z.string().nullable(),
	}),
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
		defaultValues: {
			title: "",
			description: "",
			application: "",
			skills: [],
			address: {
				city: null,
				country: null,
				line1: null,
				line2: null,
				pincode: null,
				state: null,
			},
		},
	});

	const editor = useEditor({
		extensions: [StarterKit, Markdown],
		content: "",
		editorProps: {
			attributes: {
				class:
					"p-4 prose prose-sm sm:prose-base focus:outline-none border-2 border-background-700 w-full min-w-full rounded-md min-h-56",
			},
		},
		onUpdate({ editor }) {
			// convert the editor's JSON to markdown
			const markdown = editor.storage.markdown.getMarkdown();
			setValue("description", markdown, { shouldDirty: true });
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
				organizationId: "",
				title: formData.title,
				description: formData.description,
				application: formData.application,
				skills: formData.skills.flatMap((skill) => skill.value),
				address: {
					city: formData.address.city,
					country: formData.address.country,
					line1: formData.address.line1,
					line2: formData.address.line2,
					pincode: formData.address.pincode,
					state: formData.address.state,
				},
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
					<Card shadow="none" className="p-6 gap-8">
						<CardBody className="flex flex-col gap-8">
							<Input
								{...register("title")}
								label="Job Title"
								labelPlacement="outside"
								placeholder="My Job Title"
								errorMessage={errors.title?.message}
								isInvalid={!!errors.title}
							/>
							<div className="flex flex-col gap-6 w-full">
								<h2 className="text-small">Job Description</h2>
								<div className="w-full flex flex-col gap-4">
									<FixedMenu editor={editor} />
									<EditorContent editor={editor} className="w-full" />
								</div>
								<p className="text-sm text-foreground-400">
									Markdown editing is supported.{" "}
									<Link
										isExternal
										showAnchorIcon
										href="https://www.markdownguide.org/getting-started/"
										size="sm"
									>
										Learn more
									</Link>
								</p>
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

import type { JobDetailsFragment$key } from "@/__generated__/JobDetailsFragment.graphql";
import type {
	JobDetailsInternalFragment$key as JobDetailsInternalFragmentType,
	JobType,
	WorkMode,
} from "@/__generated__/JobDetailsInternalFragment.graphql";
import { dateFormat } from "@/lib/intl";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Divider,
	Link,
} from "@heroui/react";
import Heading from "@tiptap/extension-heading";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Briefcase, Globe, IndianRupee, MapPin } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import { Markdown } from "tiptap-markdown";
import JobControls from "./JobControls";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
		organization(slug: $slug) {
		__typename
		... on Organization {
			job(slug: $jobSlug) {
				__typename
				... on Job {
					...JobDetailsInternalFragment
				}
			}
		}
	}
	viewer {
		__typename
		...JobControlsAuthFragment
	  }
  }
`;

const JobDetailsInternalFragment = graphql`
  fragment JobDetailsInternalFragment on Job {
	...JobControlsFragment
    title
	slug
    description
    type
    workMode
    location
    skills
    currency
    hasSalaryRange
    minSalary
    maxSalary
    hasExperienceRange
    minExperience
    maxExperience
    createdAt
	isApplied
    organization @required(action: THROW) {
      slug
      name
      description
      logoUrl
    }
  }
`;

export default function JobDetails({
	rootQuery,
}: {
	rootQuery: JobDetailsFragment$key;
}) {
	const root = useFragment(JobDetailsFragment, rootQuery);

	invariant(
		root.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);

	invariant(
		root.organization.job.__typename === "Job",
		"Expected 'Job' node type",
	);

	const data = useFragment<JobDetailsInternalFragmentType>(
		JobDetailsInternalFragment,
		root.organization.job,
	);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false, // Disable default heading
			}),
			Heading.configure({
				levels: [1, 2, 3], // Allow only H1, H2, and H3
			}),
			Markdown,
		],
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					"prose prose-foreground prose-sm w-full min-w-full whitespace-pre-wrap",
			},
		},
		editable: false, // Disable editing to make it a viewer
		content: data.description,
	});

	const formattedCreatedAt = dateFormat.format(new Date(data.createdAt));

	// Map currency to icons
	const currencyIcon = (currency: string) => {
		switch (currency) {
			case "INR":
				return <IndianRupee size={14} />;
			default:
				return null; // Handle other currencies or add more cases
		}
	};

	const jobType = (type: JobType) => {
		switch (type) {
			case "CONTRACT":
				return "Contract";
			case "FULL_TIME":
				return "Full Time";
			case "INTERNSHIP":
				return "Internship";
			case "PART_TIME":
				return "Part Time";
			default:
				return null;
		}
	};

	const workMode = (mode: WorkMode) => {
		switch (mode) {
			case "HYBRID":
				return "Hybrid";
			case "OFFICE":
				return "Office";
			case "REMOTE":
				return "Remote";
			default:
				return null;
		}
	};

	function formatExperienceRange({
		hasExperienceRange,
		minExperience,
		maxExperience,
	}: {
		hasExperienceRange: boolean;
		minExperience: number | null | undefined;
		maxExperience: number | null | undefined;
	}) {
		if (hasExperienceRange) {
			if (!minExperience) {
				return `Maximum ${maxExperience} years`;
			}
			if (!maxExperience) {
				return `Minimum ${minExperience} years`;
			}
			return `${minExperience} - ${maxExperience} years`;
		}
		return "Not specified";
	}

	const salaryRange = data.hasSalaryRange ? (
		<div className="flex items-center gap-2 text-xl text-foreground-500">
			{currencyIcon(data.currency)}
			{`${data.minSalary} - ${data.maxSalary}`}{" "}
			<p className="text-sm">/ month</p>
		</div>
	) : (
		<div className="flex items-center gap-2 text-sm sm:text-base text-foreground-500">
			{currencyIcon(data.currency)}
			{"Not disclosed"}
		</div>
	);

	return (
		<div className="w-full flex flex-col gap-6">
			{/* Job Title and Company */}
			<Card fullWidth className="p-6" shadow="none">
				<CardHeader>
					<div className="flex flex-col sm:flex-row w-full justify-between gap-4 items-start sm:items-center">
						<h4 className="text-xl font-medium">{data.title}</h4>
						{/* TODO: check for authentication before redirecting here */}
						<Button
							as={Link}
							href={links.jobDetailApply(data.organization.slug, data.slug)}
							size="lg"
							className="w-full sm:w-auto"
							isDisabled={data.isApplied}
						>
							{data.isApplied ? "Applied" : "Apply now"}
						</Button>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
					<div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-8 w-full">
						<p className="text-foreground-500 text-sm sm:text-base font-normal">
							Posted on {formattedCreatedAt}
						</p>
						{salaryRange}
					</div>
				</CardBody>
				<CardFooter className="flex flex-col sm:flex-row justify-between items-end sm:items-center w-full gap-6">
					<div className="flex sm:flex-row flex-wrap gap-8 items-start sm:items-center text-foreground-600 w-full">
						{data.type && <p>{jobType(data.type)}</p>}

						{data.location && (
							<div className="flex items-center gap-2">
								<MapPin size={16} />
								{data.location}
							</div>
						)}
						<div className="flex items-center gap-2">
							<Briefcase size={16} />{" "}
							{formatExperienceRange({
								hasExperienceRange: data.hasExperienceRange,
								minExperience: data.minExperience,
								maxExperience: data.maxExperience,
							})}
						</div>
						{data.workMode && (
							<div className="flex items-center gap-2">
								<Globe size={16} /> {workMode(data.workMode)}
							</div>
						)}
					</div>
					<JobControls job={data} authQueryRef={root.viewer} />
				</CardFooter>
			</Card>

			{/* Job and Company Details */}

			<Card fullWidth className="p-6" shadow="none">
				<CardBody className="flex items-center gap-6 flex-row w-full">
					<div className="relative h-14 w-14">
						<Image
							src={data.organization.logoUrl}
							alt={data.organization.name}
							fill
							className="rounded-md object-cover"
						/>
					</div>

					<div className="w-full flex flex-col gap-2">
						<Link
							as={NextLink}
							color="foreground"
							isExternal
							showAnchorIcon
							href={links.organizationDetail(data.organization.slug)}
						>
							{data.organization.name}
						</Link>
						<p className="text-default-500">{data.organization.description}</p>
					</div>
				</CardBody>
			</Card>

			{/* Job Description */}
			<Card className="p-6" fullWidth shadow="none">
				<CardHeader>
					<h3 className="font-medium text-foreground-500">About the Job</h3>
				</CardHeader>
				<Divider />
				<CardBody className="w-full">
					<EditorContent editor={editor} className="w-full" />
				</CardBody>
				<CardFooter>
					<div className="flex flex-wrap gap-4 mt-2 w-full">
						{data.skills.map((skill) => (
							<Chip variant="flat" key={skill}>
								{skill}
							</Chip>
						))}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

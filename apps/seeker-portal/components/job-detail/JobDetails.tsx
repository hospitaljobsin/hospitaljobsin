import type { JobDetailsFragment$key } from "@/__generated__/JobDetailsFragment.graphql";
import type {
	JobDetailsInternalFragment$key as JobDetailsInternalFragmentType,
	JobType,
	WorkMode,
} from "@/__generated__/JobDetailsInternalFragment.graphql";
import { dateFormat, salaryFormat } from "@/lib/intl";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Divider,
	Tooltip,
} from "@heroui/react";
import Heading from "@tiptap/extension-heading";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Briefcase,
	Clock,
	ExternalLinkIcon,
	Globe,
	IndianRupee,
	MapPin,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
		... on Account {
			profile @required(action: THROW) {
				isComplete
			}
		}
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
	externalApplicationUrl
	vacancies
    isSalaryNegotiable
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

	const isAuthenticated = root.viewer.__typename === "Account";

	const isProfileIncomplete =
		root.viewer.__typename === "Account" && !root.viewer.profile?.isComplete;

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
			case "LOCUM":
				return "Locum";
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

	const salaryRange =
		data.hasSalaryRange && data.minSalary && data.maxSalary ? (
			<div className="flex flex-col sm:flex-row sm:items-center gap-2 text-md sm:text-xl text-foreground-500">
				<div className="w-full flex items-center flex-wrap gap-2">
					{currencyIcon(data.currency)}
					{`${salaryFormat.format(data.minSalary)} - ${salaryFormat.format(data.maxSalary)}`}{" "}
					<p className="text-xs sm:text-sm">/ month</p>
				</div>
				{data.isSalaryNegotiable && (
					<Chip size="sm" color="primary" className="ml-2">
						Negotiable
					</Chip>
				)}
			</div>
		) : (
			<div className="flex items-center gap-2 text-sm sm:text-base text-foreground-500">
				{currencyIcon(data.currency)}
				Not disclosed
			</div>
		);

	return (
		<div className="w-full flex flex-col gap-6 flex-1">
			{/* Job Title and Company */}
			<Card fullWidth className="p-4 sm:p-6" shadow="none">
				<CardHeader>
					<div className="flex flex-col sm:flex-row w-full justify-between gap-3 sm:gap-4 items-start sm:items-center">
						<h4 className="text-lg sm:text-xl font-medium break-words max-w-full leading-snug text-foreground-900">
							{data.title}
						</h4>
						{data.externalApplicationUrl !== null ? (
							<Button
								as={Link}
								href={data.externalApplicationUrl}
								size="lg"
								className="w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3"
								target="_blank"
								rel="noopener noreferrer"
								isDisabled={data.isApplied}
								startContent={<ExternalLinkIcon size={16} />}
							>
								{data.isApplied ? "Applied" : "Apply now"}
							</Button>
						) : isProfileIncomplete && !data.isApplied ? (
							<Tooltip
								showArrow
								content={
									<div className="px-1 py-2">
										<div className="text-sm">
											<Link href={links.profile}>Complete your profile</Link> to
											apply for this job
										</div>
									</div>
								}
							>
								<span className="w-full sm:w-auto">
									<Button
										as={Link}
										href={links.jobDetailApply(
											data.organization.slug,
											data.slug,
										)}
										size="lg"
										className="w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3"
										isDisabled
									>
										Apply now
									</Button>
								</span>
							</Tooltip>
						) : (
							<Button
								as={Link}
								href={
									isAuthenticated
										? links.jobDetailApply(data.organization.slug, data.slug)
										: links.login(
												links.jobDetailApply(data.organization.slug, data.slug),
											)
								}
								size="lg"
								className="w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3"
								isDisabled={data.isApplied}
							>
								{data.isApplied ? "Applied" : "Apply now"}
							</Button>
						)}
					</div>
				</CardHeader>
				<CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 w-full">
					<div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 sm:gap-8 w-full">
						<p className="text-foreground-500 text-base font-normal hidden sm:block">
							Posted on {formattedCreatedAt}
						</p>
						{salaryRange}
					</div>
				</CardBody>
				<CardFooter className="flex flex-col sm:flex-row justify-between items-end sm:items-center w-full gap-4 sm:gap-6">
					<div className="flex flex-col border-t border-foreground-300 sm:border-none sm:pt-0 pt-8 sm:flex-row flex-wrap gap-4 sm:gap-8 items-start sm:items-center text-foreground-600 w-full">
						{data.type && (
							<div className="flex items-center gap-2 text-sm sm:text-base">
								<Clock size={16} />
								{jobType(data.type)}
							</div>
						)}

						{data.location && (
							<div className="flex items-center gap-2 text-sm sm:text-base">
								<MapPin size={16} />
								{data.location}
							</div>
						)}
						<div className="flex items-center gap-2 text-sm sm:text-base">
							<Briefcase size={16} />{" "}
							{formatExperienceRange({
								hasExperienceRange: data.hasExperienceRange,
								minExperience: data.minExperience,
								maxExperience: data.maxExperience,
							})}
						</div>
						{data.workMode && (
							<div className="flex items-center gap-2 text-sm sm:text-base">
								<Globe size={16} /> {workMode(data.workMode)}
							</div>
						)}
						{typeof data.vacancies === "number" && (
							<div className="flex items-center gap-2 text-sm sm:text-base font-medium text-foreground-500">
								<Users size={16} />
								<span>
									{data.vacancies}{" "}
									{data.vacancies === 1 ? "Vacancy" : "Vacancies"}
								</span>
							</div>
						)}
					</div>
					<div className="w-full sm:w-auto flex justify-end items-center gap-4">
						<p className="text-foreground-500 text-xs block sm:hidden w-full">
							{formattedCreatedAt}
						</p>
						<div className="w-full sm:w-auto flex justify-end">
							<JobControls job={data} authQueryRef={root.viewer} />
						</div>
					</div>
				</CardFooter>
			</Card>

			{/* Job and Company Details */}

			<Card fullWidth className="p-4 sm:p-6" shadow="none">
				<CardBody className="flex items-center gap-4 sm:gap-6 flex-row w-full">
					<div className="relative aspect-square h-12 w-12 sm:h-14 sm:w-14 min-w-[3rem] sm:min-w-[3.5rem]">
						<Image
							src={data.organization.logoUrl}
							alt={data.organization.name}
							fill
							className="rounded-md object-cover"
						/>
					</div>

					<div className="w-full flex flex-col gap-1 sm:gap-2">
						<Link
							color="foreground"
							target="_blank"
							rel="noopener noreferrer"
							href={links.organizationDetail(data.organization.slug)}
							className="text-base sm:text-lg font-medium flex items-center gap-2"
						>
							{data.organization.name} <ExternalLinkIcon size={16} />
						</Link>
						<p className="text-xs sm:text-base text-default-500 leading-tight">
							{data.organization.description}
						</p>
					</div>
				</CardBody>
			</Card>

			{/* Job Description */}
			<Card className="p-4 sm:p-6" fullWidth shadow="none">
				<CardHeader>
					<h3 className="font-medium text-foreground-500 text-base sm:text-lg">
						About the Job
					</h3>
				</CardHeader>
				<Divider />
				<CardBody className="w-full">
					<EditorContent editor={editor} className="w-full" />
				</CardBody>
				<CardFooter>
					<div className="flex flex-wrap gap-2 sm:gap-4 mt-2 w-full">
						{data.skills.map((skill) => (
							<Chip
								variant="flat"
								key={skill}
								className="text-xs sm:text-base px-2 sm:px-3 py-1 sm:py-2"
							>
								{skill}
							</Chip>
						))}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

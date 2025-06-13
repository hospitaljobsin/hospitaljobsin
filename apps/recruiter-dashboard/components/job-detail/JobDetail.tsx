import type {
	JobDetailFragment$key,
	JobType,
	WorkMode,
} from "@/__generated__/JobDetailFragment.graphql";
import { dateFormat } from "@/lib/intl";
import links from "@/lib/links";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
} from "@heroui/react";
import Heading from "@tiptap/extension-heading";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Briefcase, Globe, IndianRupee, MapPin } from "lucide-react";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Markdown } from "tiptap-markdown";
import JobControls from "./JobControls";
import JobStatistics from "./JobStatistics";

export const JobDetailFragment = graphql`
  fragment JobDetailFragment on Job {
    slug
    title
    description
    skills
    viewCount
    createdAt
    vacancies
    type
    workMode
    location
    currency
    minSalary
    maxSalary
    hasSalaryRange
    minExperience
    maxExperience
    hasExperienceRange
    externalApplicationUrl
	applicationForm {
		__typename
	}
	organization @required(action: THROW) {
		isAdmin
	}
	...JobStatisticsFragment
  }
`;

type Props = {
	job: JobDetailFragment$key;
};

export default function JobDetail({ job }: Props) {
	const data = useFragment(JobDetailFragment, job);

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
	const showApplicationFormWarning =
		data.organization.isAdmin &&
		data.externalApplicationUrl === null &&
		!data.applicationForm;

	const showJobControls =
		(data.organization.isAdmin && data.applicationForm !== null) ||
		(data.organization.isAdmin && data.externalApplicationUrl !== null);
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

	// Map currency to icons
	const currencyIcon = (currency: string) => {
		switch (currency) {
			case "INR":
				return <IndianRupee size={14} />;
			default:
				return null; // Handle other currencies or add more cases
		}
	};

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
			{/* Job Title and Skills */}
			{/* <Card className="p-4 sm:p-8 space-y-8" shadow="none">
				<CardHeader className="flex flex-col gap-4 w-full items-start">
					<h4 className="text-xl font-semibold text-balance">{data.title}</h4></CardHeader>
					<CardBody>
					<div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-start mt-2">
						{data.skills.map((skill) => (
							<Chip variant="flat" key={skill}>
								{skill}
							</Chip>
						))}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-4 border-t border-t-foreground-100 mt-4">
						<div className="flex flex-col gap-2">
							<span className="text-foreground-500 text-xs">Job Type</span>
							<span className="font-medium flex items-center gap-2">
								<BriefcaseIcon size={16} />
								{data.type?.replace(/_/g, " ") || "-"}
							</span>
						</div>
						{data.workMode && (
						<div className="flex flex-col gap-2">
							<span className="text-foreground-500 text-xs">Work Mode</span>
							<span className="font-medium">
								{data.workMode.charAt(0) +
									data.workMode.slice(1).toLowerCase() || "-"}
							</span>
						</div>)}
						<div className="flex flex-col gap-2">
							<span className="text-foreground-500 text-xs">Location</span>
							<span className="font-medium flex items-center gap-2">
								<MapPinIcon size={16} />
								{data.location || "-"}
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-foreground-500 text-xs">Vacancies</span>
							<span className="font-medium">{data.vacancies ?? "-"}</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-foreground-500 text-xs">Salary</span>
							<span className="font-medium">
								{data.hasSalaryRange && data.minSalary != null && data.maxSalary != null
									? `${data.currency || ""} ${data.minSalary} - ${data.maxSalary}`
									: data.minSalary != null
										? `${data.currency || ""} ${data.minSalary}`
										: "-"}
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-foreground-500 text-xs">Experience</span>
							<span className="font-medium">
								{data.hasExperienceRange &&
								data.minExperience &&
								data.maxExperience
									? `${data.minExperience} - ${data.maxExperience} years`
									: data.minExperience
										? `${data.minExperience} years`
										: "-"}
							</span>
						</div>
						{data.externalApplicationUrl && (
							<div className="flex flex-col gap-2 col-span-full">
								<span className="text-foreground-500 text-xs">
									External Application
								</span>
								<a
									href={data.externalApplicationUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="font-medium flex items-center gap-2 text-primary-600 hover:underline"
								>
									<LinkIcon size={16} />
									Apply on external site
								</a>
							</div>
						)}
					</div>
				</CardBody>

			</Card> */}

			<Card fullWidth className="p-6" shadow="none">
				<CardHeader>
					<div className="flex flex-col sm:flex-row w-full justify-between gap-6 items-start sm:items-center">
						<h4 className="text-xl font-medium text-pretty w-full">
							{data.title}
						</h4>
						{data.organization.isAdmin && (
							<div className="items-center gap-4 flex justify-end flex-col sm:flex-row w-full">
								{showJobControls ? <JobControls job={data} /> : null}
							</div>
						)}
					</div>
				</CardHeader>
				<CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
					<div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-8 w-full">
						<p className="text-foreground-500 text-sm sm:text-base font-normal">
							Posted on {dateFormat.format(new Date(data.createdAt))}
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
				</CardFooter>
			</Card>
			{/* Application Form Card */}
			{showApplicationFormWarning ? (
				<Alert
					color="warning"
					title="You need to set up screening questions before publishing this job"
					variant="flat"
					endContent={
						<Button
							variant="flat"
							color="warning"
							as={Link}
							href={links.jobDetailSettingsApplicationForm(data.slug)}
						>
							Set up screening questions
						</Button>
					}
				/>
			) : null}

			{/* Job Views Graph Card */}
			<JobStatistics job={data} />

			{/* Job Description */}
			{data.description && (
				<Card className="p-6" fullWidth shadow="none">
					<CardHeader>
						<h3 className="font-medium text-foreground-500">About the Job</h3>
					</CardHeader>
					<Divider />
					<CardBody className="w-full">
						<EditorContent editor={editor} className="w-full" />
					</CardBody>
				</Card>
			)}
		</div>
	);
}

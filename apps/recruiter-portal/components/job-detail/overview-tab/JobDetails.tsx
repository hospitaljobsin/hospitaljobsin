import type { JobDetailsFragment$key } from "@/__generated__/JobDetailsFragment.graphql";
import type {
	JobDetailsInternalFragment$key as JobDetailsInternalFragmentType,
	JobType,
	WorkMode,
} from "@/__generated__/JobDetailsInternalFragment.graphql";
import { dateFormat } from "@/lib/intl";
import links from "@/lib/links";
import {
	Alert,
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
import {
	Briefcase,
	Edit2,
	FileText,
	Globe,
	IndianRupee,
	MapPin,
} from "lucide-react";
import { useParams } from "next/navigation";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import { Markdown } from "tiptap-markdown";
import JobControls from "./JobControls";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        ...JobDetailsInternalFragment
      }
     
    }
  }
`;

const JobDetailsInternalFragment = graphql`
  fragment JobDetailsInternalFragment on Job {
    title
    description
    slug
    skills
    minSalary
    maxSalary
	hasSalaryRange
    minExperience
    maxExperience
	hasExperienceRange
	currency
	workMode
	type
    address {
      city
      state
      country
    }
    createdAt
    updatedAt
    isActive
    applicationForm {
      __typename
      id
    }
    organization {
      isAdmin
      name
    }
	  ...JobControlsFragment
  }
`;

export default function JobDetails({
	rootQuery,
}: { rootQuery: JobDetailsFragment$key }) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const root = useFragment(JobDetailsFragment, rootQuery);
	invariant(root.job.__typename === "Job", "Expected 'Job' node type");
	const data = useFragment<JobDetailsInternalFragmentType>(
		JobDetailsInternalFragment,
		root.job,
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

	const hasApplicationForm = data.applicationForm !== null;

	const formatAddress = (address: {
		readonly city: string | null | undefined;
		readonly state: string | null | undefined;
		readonly country?: string | null | undefined;
		readonly line1?: string | null | undefined;
		readonly line2?: string | null | undefined;
		readonly pincode?: string | null | undefined;
	}) => {
		const { city, state, country } = address;

		// Build address parts with available components
		const parts = [];
		if (city) parts.push(city);
		if (state) parts.push(state);
		if (country) parts.push(country);

		// Return combined parts or default message
		return parts.length > 0 ? parts.join(", ") : "Not specified";
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
			<Card fullWidth className="p-6" shadow="none">
				<CardHeader>
					<div className="flex flex-col sm:flex-row w-full justify-between gap-6 items-start sm:items-center">
						<h4 className="text-xl font-medium text-pretty w-full">
							{data.title}
						</h4>
						{data.organization?.isAdmin && (
							<div className="items-center gap-4 flex justify-end flex-col sm:flex-row w-full">
								{hasApplicationForm ? <JobControls job={data} /> : null}
								<Button
									as={Link}
									href={links.jobDetailEdit(params.slug, params.jobSlug)}
									variant="bordered"
									startContent={<Edit2 className="w-4 h-4" />}
									className="w-full sm:w-auto"
								>
									Edit Details
								</Button>
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

						{data.address && (
							<div className="flex items-center gap-2">
								<MapPin size={16} />
								{formatAddress(data.address)}
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
			{hasApplicationForm && data.organization?.isAdmin ? (
				<Card className="p-6" shadow="none">
					<div className="flex justify-between items-center">
						<div className="sm:flex items-center gap-4 hidden">
							<FileText size={20} />
							<h3 className="text-md">Application Form</h3>
						</div>
						<Button
							as={Link}
							href={links.jobDetailApplicationForm(params.slug, params.jobSlug)}
							variant="bordered"
							className="w-full sm:w-auto"
						>
							Update Application Form
						</Button>
					</div>
				</Card>
			) : (
				<Alert
					color="warning"
					title="You need to set up an application form before publishing this job"
					variant="flat"
					endContent={
						<Button
							variant="flat"
							color="warning"
							as={Link}
							href={links.jobDetailApplicationForm(params.slug, params.jobSlug)}
						>
							Set up application form
						</Button>
					}
				/>
			)}
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

			{/* Hiring Stats Overview */}
			{/* {data.hiringStats && (
				<Card className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<ChartBarIcon className="w-5 h-5 text-primary-500" />
						<h3 className="font-semibold text-lg">Hiring Statistics</h3>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						<div className="bg-gray-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold">
								{data.hiringStats.totalApplications}
							</p>
							<p className="text-sm text-gray-600">Total Applications</p>
						</div>
						<div className="bg-blue-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-blue-600">
								{data.hiringStats.newApplications}
							</p>
							<p className="text-sm text-gray-600">New Applications</p>
						</div>
						<div className="bg-purple-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-purple-600">
								{data.hiringStats.interviewsScheduled}
							</p>
							<p className="text-sm text-gray-600">Interviews Scheduled</p>
						</div>
						<div className="bg-yellow-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-yellow-600">
								{data.hiringStats.offersExtended}
							</p>
							<p className="text-sm text-gray-600">Offers Extended</p>
						</div>
						<div className="bg-green-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-green-600">
								{data.hiringStats.hiredCount}
							</p>
							<p className="text-sm text-gray-600">Hired</p>
						</div>
						<div className="bg-red-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-red-600">
								{data.hiringStats.rejectedCount}
							</p>
							<p className="text-sm text-gray-600">Rejected</p>
						</div>
					</div>
				</Card>
			)} */}
		</div>
	);
}

import type { JobFragment$key } from "@/__generated__/JobFragment.graphql";
import { getRelativeTimeString, salaryFormat } from "@/lib/intl";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import {
	Briefcase,
	CheckCircle2,
	Clock,
	EyeIcon,
	Globe,
	IndianRupee,
	MapPin,
	Users,
} from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const JobFragment = graphql`
  fragment JobFragment on Job {
    slug
    title
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
    minExperience
    maxExperience
    isActive
    expiresAt
    applicantCount @required(action: THROW) {
      applied
      shortlisted
      interviewed
      onHold
      offered
    }
  }
`;

type Props = {
	job: JobFragment$key;
};

// Job type mapping
const jobType = (type: string | null | undefined) => {
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

// Work mode mapping
const workMode = (mode: string | null | undefined) => {
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

// Currency icon
const currencyIcon = (currency: string) => {
	switch (currency) {
		case "INR":
			return <IndianRupee size={14} />;
		default:
			return null;
	}
};

// Salary range formatting
function salaryRange(
	currency: string,
	min?: number | null,
	max?: number | null,
) {
	if (min && max) {
		return (
			<span className="flex items-center gap-1">
				{currencyIcon(currency)}
				{salaryFormat.format(min ?? 0)} - {salaryFormat.format(max ?? 0)}
				<span className="text-xs">/ month</span>
			</span>
		);
	}

	if ((min || max) !== null) {
		return (
			<span className="flex items-center gap-1">
				{currencyIcon(currency)}
				{salaryFormat.format(min ?? max ?? 0)}
				<span className="text-xs">/ month</span>
			</span>
		);
	}
	return (
		<span className="flex items-center gap-1 text-foreground-500">
			{currencyIcon(currency)}
			Not disclosed
		</span>
	);
}

// Experience range formatting
function formatExperienceRange(min?: number | null, max?: number | null) {
	if (min && max) {
		return `${min} - ${max} years`;
	}

	if (min || max) {
		if (!min) return `Maximum ${max} years`;
		if (!max) return `Minimum ${min} years`;
	}
	return "Not specified";
}

export default function Job({ job }: Props) {
	const router = useRouter();
	const data = useFragment(JobFragment, job);

	const hasExpired = data.expiresAt && new Date(data.expiresAt) < new Date();

	// Applicant pipeline
	const { applied, shortlisted, interviewed, onHold, offered } =
		data.applicantCount;
	const totalApplicants =
		applied + shortlisted + interviewed + onHold + offered;
	const pipeline = [
		{ label: "Shortlisted", value: shortlisted, color: "bg-primary-200" },
		{ label: "Interviewed", value: interviewed, color: "bg-primary-300" },
		{ label: "On Hold", value: onHold, color: "bg-primary-400" },
		{ label: "Offered", value: offered, color: "bg-primary-600" },
	];

	// For the bar, show proportion of each stage out of total applicants

	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer space-y-4 sm:space-y-6"
			isPressable
			as="div"
			disableRipple
			onPress={() => {
				router.push(links.jobDetailApplicants(data.slug));
			}}
			shadow="none"
		>
			{/* Header: Title, Status, Skills */}
			<CardHeader className="flex flex-col gap-3 sm:gap-4 w-full items-start">
				<div className="flex items-center gap-2 w-full justify-between">
					<h4 className="text-lg/7 sm:text-xl/8 font-medium text-balance flex-1">
						{data.title}
					</h4>
					<Chip
						variant="flat"
						color={
							hasExpired ? "warning" : data.isActive ? "success" : "danger"
						}
					>
						{hasExpired ? "Expired" : data.isActive ? "Published" : "Draft"}
					</Chip>
				</div>
				<div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-start">
					{data.skills.map((skill) => (
						<Chip variant="flat" key={skill} className="text-xs">
							{skill}
						</Chip>
					))}
				</div>
			</CardHeader>

			{/* Meta Row: Type, Work Mode, Location, Salary, Experience */}
			<div className="flex flex-wrap gap-3 sm:gap-6 w-full items-center px-1 sm:px-2 text-foreground-500 text-xs sm:text-sm">
				{data.type && (
					<span className="flex items-center gap-1">
						<Clock size={14} />
						{jobType(data.type)}
					</span>
				)}
				{data.workMode && (
					<span className="flex items-center gap-1">
						<Globe size={14} />
						{workMode(data.workMode)}
					</span>
				)}
				{data.location && (
					<span className="flex items-center gap-1">
						<MapPin size={14} />
						{data.location}
					</span>
				)}
				<span className="flex items-center gap-1">
					<Briefcase size={14} />
					{formatExperienceRange(data.minExperience, data.maxExperience)}
				</span>
				{salaryRange(data.currency, data.minSalary, data.maxSalary)}
			</div>

			{/* Applicant Pipeline Bar & Numbers */}
			<CardBody className="flex flex-col gap-4 w-full">
				<div className="flex flex-col gap-2 w-full">
					<div className="flex items-center justify-between w-full">
						<span className="flex items-center gap-1 text-foreground-700 text-base font-medium">
							<Users size={16} />
							{totalApplicants} applicants
						</span>
						<span className="text-xs text-foreground-500">
							{pipeline[0].value} shortlisted
						</span>
					</div>
					{/* Pipeline segmented bar */}
					<div className="flex h-2 w-full rounded overflow-hidden bg-foreground-100">
						{pipeline.map((stage, i) => {
							const width = totalApplicants
								? (stage.value / totalApplicants) * 100
								: 0;
							return (
								<div
									key={stage.label}
									className={`${stage.color} h-full`}
									style={{ width: `${width}%` }}
									title={`${stage.label}: ${stage.value}`}
								/>
							);
						})}
					</div>
					<div className="flex flex-wrap gap-2 mt-1 text-xs text-foreground-500">
						{pipeline.map((stage) => (
							<span key={stage.label} className="flex items-center gap-1">
								<CheckCircle2
									size={12}
									className={stage.color.replace("bg-", "text-")}
								/>
								{stage.value} {stage.label}
							</span>
						))}
					</div>
				</div>
			</CardBody>

			{/* Footer: Vacancies, Views, Posted */}
			<CardFooter className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 sm:gap-8 w-full text-center sm:text-left">
				<div className="flex items-center gap-2 text-foreground-500 text-sm sm:text-base font-normal whitespace-nowrap">
					{typeof data.vacancies === "number" && (
						<span>
							<span className="font-medium">{data.vacancies}</span> vacancies
						</span>
					)}
				</div>
				<div className="w-full flex flex-col sm:flex-row justify-end gap-2 sm:gap-6 items-end sm:items-center">
					<div className="flex items-center gap-2">
						<EyeIcon size={16} className="text-primary-600" />
						<p className="text-primary-600 text-sm sm:text-base font-normal whitespace-nowrap">
							<span className="font-medium">{data.viewCount}</span> views
						</p>
					</div>
					<p
						className="text-foreground-500 text-xs sm:text-base font-normal whitespace-nowrap"
						suppressHydrationWarning
					>
						Posted {getRelativeTimeString(data.createdAt)}
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}

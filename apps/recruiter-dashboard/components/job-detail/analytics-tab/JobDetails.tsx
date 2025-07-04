import type {
	JobDetailsFragment$key,
	JobType,
	WorkMode,
} from "@/__generated__/JobDetailsFragment.graphql";
import { dateFormat } from "@/lib/intl";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { Briefcase, Clock, Globe, IndianRupee, MapPin } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import JobStatistics from "./JobStatistics";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Job {
    title
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
    location
    createdAt
    updatedAt
    isActive
	externalApplicationUrl
    applicationForm {
      __typename
      id
    }
    organization @required(action: THROW) {
      isAdmin
      name
    }
	  ...JobStatisticsFragment
  }
`;

export default function JobDetails({
	rootQuery,
}: { rootQuery: JobDetailsFragment$key }) {
	const data = useFragment(JobDetailsFragment, rootQuery);

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
						{data.type && (
							<p className="flex items-center gap-2">
								<Clock size={14} />
								{jobType(data.type)}
							</p>
						)}

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

			<JobStatistics job={data} />
		</div>
	);
}

import type { JobControlsAuthFragment$key } from "@/__generated__/JobControlsAuthFragment.graphql";
import type { JobType } from "@/__generated__/JobDetailsInternalFragment.graphql";
import type {
	JobFragment$key,
	WorkMode,
} from "@/__generated__/JobFragment.graphql";
import { dateFormat, salaryFormat } from "@/lib/intl";
import links from "@/lib/links";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { Briefcase, Globe, IndianRupee, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import JobControls from "../job-detail/JobControls";

export const JobFragment = graphql`
  fragment JobFragment on Job @argumentDefinitions(
		showOrganization: { type: "Boolean!", defaultValue: true }
	) {
	...JobControlsFragment
    slug
    title
    type
    workMode
    location
    skills
    currency
    minSalary
    maxSalary
    minExperience
    maxExperience
    createdAt
    organization @required(action: THROW) {
      name @include(if: $showOrganization)
      logoUrl @include(if: $showOrganization)
	  slug
    }
  }
`;

export const JobAuthFragment = graphql`
  fragment JobAuthFragment on ViewerPayload {
	__typename
  }
`;

type Props = {
	job: JobFragment$key;
	authQueryRef: JobControlsAuthFragment$key;
};

export default function Job({ job, authQueryRef: rootQuery }: Props) {
	const data = useFragment(JobFragment, job);

	const formattedCreatedAt = dateFormat.format(new Date(data.createdAt));

	// Map currency to icons
	const currencyIcon = (currency: string) => {
		switch (currency) {
			case "INR":
				return <IndianRupee size={16} />;
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

	const salaryRange =
		data.minSalary && data.maxSalary ? (
			<div className="flex items-center gap-2 text-xl font-medium text-nowrap">
				{currencyIcon(data.currency)}
				{`${salaryFormat.format(data.minSalary ?? 0)} - ${salaryFormat.format(data.maxSalary ?? 0)}`}{" "}
				<p className="text-foreground-500 text-sm">/ month</p>
			</div>
		) : data.minSalary || data.maxSalary ? (
			<div className="flex items-center gap-2 text-xl font-medium">
				{currencyIcon(data.currency)}
				{`${salaryFormat.format(data.minSalary ?? data.maxSalary ?? 0)}`}{" "}
				<p className="text-foreground-500 text-sm">/ month</p>
			</div>
		) : (
			<div className="flex items-center gap-2 text-xl font-medium">
				{currencyIcon(data.currency)}
				{"Not disclosed"}
			</div>
		);

	function formatExperienceRange({
		minExperience,
		maxExperience,
	}: {
		minExperience: number | null | undefined;
		maxExperience: number | null | undefined;
	}) {
		if (minExperience && maxExperience) {
			return `${minExperience} - ${maxExperience} years`;
		}

		if (minExperience || maxExperience) {
			if (!minExperience) {
				return `Maximum ${maxExperience} years`;
			}
			if (!maxExperience) {
				return `Minimum ${minExperience} years`;
			}
		}
		return "Not specified";
	}

	return (
		<Link href={links.jobDetail(data.organization.slug, data.slug)}>
			<Card
				fullWidth
				className="p-3 sm:p-6 cursor-pointer rounded-xl bg-background"
				isPressable
				as="div"
				disableRipple
				shadow="none"
			>
				<CardHeader>
					<div className="flex flex-col sm:flex-row w-full justify-between gap-4 sm:gap-6 items-start sm:items-center">
						<div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
							{data.organization.logoUrl && (
								<div className="relative aspect-square h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
									<Image
										src={data.organization.logoUrl || ""}
										alt={data.organization?.name || ""}
										fill
										className="rounded-md object-cover"
									/>
								</div>
							)}
							<div className="flex flex-col gap-1 items-start min-w-0">
								<h4 className="text-base sm:text-xl font-medium truncate max-w-full sm:max-w-none">
									{data.title}
								</h4>
								{data.organization && (
									<p className="text-xs sm:text-base font-normal text-foreground-500 truncate max-w-[140px] sm:max-w-none">
										{data.organization.name}
									</p>
								)}
							</div>
						</div>
						<div className="mt-2 sm:mt-0 w-full sm:w-auto flex justify-start sm:justify-end">
							{salaryRange}
						</div>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-4 sm:gap-6 w-full">
					<div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 w-full text-left">
						<p className="text-foreground-500 text-xs sm:text-base font-normal">
							Posted on {formattedCreatedAt}
						</p>
					</div>
					<div className="flex flex-wrap justify-start gap-2 sm:gap-8 items-start text-foreground-600 w-full text-left sm:text-center">
						{data.type && (
							<p className="text-xs sm:text-base px-2 py-1 sm:p-0 bg-default-100 rounded-md sm:bg-transparent">
								{jobType(data.type)}
							</p>
						)}
						{data.location && (
							<div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 py-1 sm:p-0 bg-default-100 rounded-md sm:bg-transparent">
								<MapPin size={14} className="sm:hidden" />
								<MapPin size={16} className="hidden sm:inline" />
								{data.location}
							</div>
						)}
						<div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 py-1 sm:p-0 bg-default-100 rounded-md sm:bg-transparent">
							<Briefcase size={14} className="sm:hidden" />
							<Briefcase size={16} className="hidden sm:inline" />
							{formatExperienceRange({
								minExperience: data.minExperience,
								maxExperience: data.maxExperience,
							})}
						</div>
						{data.workMode && (
							<div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 py-1 sm:p-0 bg-default-100 rounded-md sm:bg-transparent">
								<Globe size={14} className="sm:hidden" />
								<Globe size={16} className="hidden sm:inline" />
								{workMode(data.workMode)}
							</div>
						)}
					</div>
				</CardBody>
				<CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-6 w-full text-left sm:text-left">
					<div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 w-full sm:w-auto justify-start">
						{data.skills.map((skill) => (
							<Chip
								variant="flat"
								key={skill}
								className="text-xs sm:text-sm px-2 py-1"
							>
								{skill}
							</Chip>
						))}
					</div>
					<div className="w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
						<JobControls job={data} authQueryRef={rootQuery} />
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}

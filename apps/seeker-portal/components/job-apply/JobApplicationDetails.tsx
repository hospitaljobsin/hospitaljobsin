import type {
	JobDetailsInternalFragment$key as JobDetailsInternalFragmentType,
	JobType,
	WorkMode,
} from "@/__generated__/JobDetailsInternalFragment.graphql";
import links from "@/lib/links";
import { Card, CardBody, CardHeader, Chip, Divider, Link } from "@heroui/react";
import { Briefcase, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { graphql, useFragment } from "react-relay";

const JobDetailsInternalFragment = graphql`
  fragment JobApplicationDetailsFragment on Job {
    title
	slug
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
    description
    organization @required(action: THROW) {
      name
      logoUrl
      slug
    }
  }
`;

function jobType(type: JobType | null | undefined) {
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
}

function workMode(mode: WorkMode | null | undefined) {
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
}

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

function currencyIcon(currency: string) {
	// Only INR supported for now
	if (currency === "INR") {
		return <span className="font-bold">₹</span>;
	}
	return null;
}

export default function JobApplicationDetails({
	job,
}: {
	job: JobDetailsInternalFragmentType;
}) {
	const data = useFragment(JobDetailsInternalFragment, job);

	// Short description: first 3-4 lines, fade if long
	const shortDescription = useMemo(() => {
		if (!data.description) return null;
		const lines = data.description.split("\n");
		if (lines.length <= 4) return data.description;
		return `${lines.slice(0, 4).join("\n")}...`;
	}, [data.description]);

	return (
		<Card fullWidth className="p-6" shadow="none">
			<CardHeader className="w-full flex flex-col items-start gap-4">
				<h3 className="text-base text-foreground-600">Applying for</h3>
				<h2 className="text-2xl font-medium">{data.title}</h2>
				<div className="w-full flex items-center gap-4">
					<div className="relative h-6 w-6">
						<Image
							src={data.organization.logoUrl}
							alt={data.organization.name}
							fill
							className="rounded-md object-cover"
						/>
					</div>
					<Link
						href={links.organizationDetail(data.organization.slug)}
						isExternal
						showAnchorIcon
						className="font-medium text-foreground-600"
					>
						{data.organization.name}
					</Link>
				</div>
			</CardHeader>
			<Divider className="my-4" />
			<CardBody className="flex flex-col gap-3">
				<div className="flex flex-wrap gap-4 text-foreground-600 text-sm items-center">
					{data.type && <span>{jobType(data.type)}</span>}
					{data.location && (
						<span className="flex items-center gap-1">
							<MapPin size={16} />
							{data.location}
						</span>
					)}
					<span className="flex items-center gap-1">
						<Briefcase size={16} />
						{formatExperienceRange({
							hasExperienceRange: data.hasExperienceRange,
							minExperience: data.minExperience,
							maxExperience: data.maxExperience,
						})}
					</span>
					{data.workMode && (
						<span className="flex items-center gap-1">
							<Globe size={16} />
							{workMode(data.workMode)}
						</span>
					)}
					{data.hasSalaryRange ? (
						<span className="flex items-center gap-1">
							{currencyIcon(data.currency)}
							{data.minSalary} - {data.maxSalary}{" "}
							<span className="text-xs">/ month</span>
						</span>
					) : (
						<span>Salary: Not disclosed</span>
					)}
				</div>
				{data.skills.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-2 w-full">
						{data.skills.map((skill) => (
							<Chip key={skill} variant="flat" className="text-xs">
								{skill}
							</Chip>
						))}
					</div>
				)}
				<div className="mt-2">
					<Link
						href={links.jobDetail(data.organization.slug, data.slug)}
						color="foreground"
						isExternal
						showAnchorIcon
					>
						View more
					</Link>
				</div>
			</CardBody>
		</Card>
	);
}

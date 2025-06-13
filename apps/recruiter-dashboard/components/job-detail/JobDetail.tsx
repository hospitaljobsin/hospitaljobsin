import type { JobDetailFragment$key } from "@/__generated__/JobDetailFragment.graphql";
import { getRelativeTimeString } from "@/lib/intl";
import {
	Avatar,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
} from "@heroui/react";
import {
	BriefcaseIcon,
	Building2Icon,
	EyeIcon,
	LinkIcon,
	MapPinIcon,
} from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const JobDetailFragment = graphql`
  fragment JobDetailFragment on Job {
    slug
    title
    description
    skills
    viewCount
    createdAt
    applicantCount @required(action: THROW) {
      applied
      shortlisted
      interviewed
      onHold
      offered
    }
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
    organization {
      name
      slug
      logoUrl
      description
    }
  }
`;

type Props = {
	job: JobDetailFragment$key;
};

export default function JobDetail({ job }: Props) {
	const data = useFragment(JobDetailFragment, job);

	return (
		<Card className="p-4 sm:p-8 space-y-8" shadow="none">
			<CardHeader className="flex flex-col gap-4 w-full items-start">
				<div className="flex items-center gap-4 w-full">
					{data.organization?.logoUrl && (
						<Avatar
							src={data.organization.logoUrl}
							alt={data.organization.name}
							size="md"
						/>
					)}
					<div>
						<h4 className="text-xl font-semibold text-balance">{data.title}</h4>
						{data.organization && (
							<div className="flex items-center gap-2 mt-1 text-foreground-500 text-sm">
								<Building2Icon size={16} />
								<span>{data.organization.name}</span>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-start mt-2">
					{data.skills.map((skill) => (
						<Chip variant="flat" key={skill}>
							{skill}
						</Chip>
					))}
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-8 w-full">
				{data.description && (
					<div className="prose max-w-none text-foreground-700 text-base leading-relaxed">
						{data.description}
					</div>
				)}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="flex flex-col gap-2">
						<span className="text-foreground-500 text-xs">Job Type</span>
						<span className="font-medium flex items-center gap-2">
							<BriefcaseIcon size={16} />
							{data.type?.replace(/_/g, " ") || "-"}
						</span>
					</div>
					<div className="flex flex-col gap-2">
						<span className="text-foreground-500 text-xs">Work Mode</span>
						<span className="font-medium">
							{data.workMode?.charAt(0) +
								data.workMode?.slice(1).toLowerCase() || "-"}
						</span>
					</div>
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
							{data.hasSalaryRange && data.minSalary && data.maxSalary
								? `${data.currency} ${data.minSalary} - ${data.maxSalary}`
								: data.minSalary
									? `${data.currency} ${data.minSalary}`
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
				{data.organization?.description && (
					<div className="mt-6">
						<span className="text-foreground-500 text-xs">
							About {data.organization.name}
						</span>
						<div className="text-foreground-700 text-sm mt-1">
							{data.organization.description}
						</div>
					</div>
				)}
			</CardBody>
			<CardFooter className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 sm:gap-8 w-full text-center sm:text-left">
				<div className="flex flex-wrap gap-6 sm:gap-8 w-full justify-between">
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicantCount.applied}
						</h2>
						<p className="text-md text-foreground-500">Applied</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicantCount.shortlisted}
						</h2>
						<p className="text-md text-foreground-500">Shortlisted</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicantCount.interviewed}
						</h2>
						<p className="text-md text-foreground-500">Interviewed</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicantCount.onHold}
						</h2>
						<p className="text-md text-foreground-500">On Hold</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicantCount.offered}
						</h2>
						<p className="text-md text-foreground-500">Offered</p>
					</div>
				</div>
				<div className="w-full flex justify-end gap-6 sm:gap-8 mt-6 sm:mt-0">
					<div className="flex items-center gap-2">
						<EyeIcon size={16} className="text-primary-600" />
						<p className="text-primary-600 text-sm sm:text-base font-normal whitespace-nowrap">
							<span className="font-medium">{data.viewCount}</span> views
						</p>
					</div>
					<p
						className="text-foreground-500 text-sm sm:text-base font-normal whitespace-nowrap"
						suppressHydrationWarning
					>
						Posted {getRelativeTimeString(data.createdAt)}
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}

import type { JobControlsAuthFragment$key } from "@/__generated__/JobControlsAuthFragment.graphql";
import type { JobType } from "@/__generated__/JobDetailsInternalFragment.graphql";
import type {
	JobFragment$key,
	WorkMode,
} from "@/__generated__/JobFragment.graphql";
import { dateFormat } from "@/lib/intl";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { Briefcase, Globe, IndianRupee, MapPin } from "lucide-react";
import Image from "next/image";
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
    hasSalaryRange
    minSalary
    maxSalary
    hasExperienceRange
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
	const router = useRouter();
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

	const salaryRange = data.hasSalaryRange ? (
		<div className="flex items-center gap-2 text-xl font-medium text-nowrap">
			{currencyIcon(data.currency)}
			{`${data.minSalary} - ${data.maxSalary}`}{" "}
			<p className="text-foreground-500 text-sm">/ month</p>
		</div>
	) : (
		<div className="flex items-center gap-2 text-xl font-medium">
			{currencyIcon(data.currency)}
			{"Not disclosed"}
		</div>
	);

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

	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer"
			isPressable
			as="div"
			disableRipple
			onPress={() => {
				router.push(links.jobDetail(data.organization.slug, data.slug));
			}}
			shadow="none"
		>
			<CardHeader>
				<div className="flex flex-col sm:flex-row w-full justify-between gap-6 items-start sm:items-center">
					<div className="flex items-center gap-4">
						{data.organization && (
							<div className="relative h-14 w-14">
								<Image
									src={data.organization.logoUrl || ""}
									alt={data.organization?.name || ""}
									fill
									className="rounded-md object-cover"
								/>
							</div>
						)}
						<div className="flex flex-col gap-2 items-start">
							<h4 className="text-lg/7 sm:text-xl/8 font-medium text-balance">
								{data.title}
							</h4>
							{data.organization && (
								<p className="text-sm sm:text-base font-normal text-foreground-500">
									{data.organization.name}
								</p>
							)}
						</div>
					</div>
					{salaryRange}
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-6 w-full">
				<div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full text-left">
					<p className="text-foreground-500 text-sm sm:text-base font-normal">
						Posted on {formattedCreatedAt}
					</p>
				</div>
				<div className="flex flex-wrap justify-start gap-4 sm:gap-8 items-start text-foreground-600 w-full text-center">
					{data.type && <p>{jobType(data.type)}</p>}
					{data.location && (
						<div className="flex items-center gap-2">
							<MapPin size={16} /> {data.location}
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
			</CardBody>
			<CardFooter className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 sm:gap-6 w-full text-center sm:text-left">
				<div className="flex flex-wrap gap-2 sm:gap-4 mt-2 w-full justify-start">
					{data.skills.map((skill) => (
						<Chip variant="flat" key={skill}>
							{skill}
						</Chip>
					))}
				</div>
				<JobControls job={data} authQueryRef={rootQuery} />
			</CardFooter>
		</Card>
	);
}

import type { JobType } from "@/__generated__/JobDetailsInternalFragment.graphql";
import type {
	RelatedJobFragment$key,
	WorkMode,
} from "@/__generated__/RelatedJobFragment.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Briefcase, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const RelatedJobFragment = graphql`
  fragment RelatedJobFragment on Job @argumentDefinitions(
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
    organization @required(action: THROW) {
      name @include(if: $showOrganization)
      logoUrl @include(if: $showOrganization)
	  slug
    }
  }
`;

type Props = {
	job: RelatedJobFragment$key;
};

export default function RelatedJob({ job }: Props) {
	const router = useRouter();
	const data = useFragment(RelatedJobFragment, job);

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
		<Card
			className="p-4 sm:p-6 cursor-pointer w-full lg:max-w-sm"
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
						{data.organization.logoUrl && (
							<div className="relative aspect-square h-8 w-8">
								<Image
									src={data.organization.logoUrl || ""}
									alt={data.organization?.name || ""}
									fill
									className="rounded-md object-cover"
								/>
							</div>
						)}
						<div className="flex flex-col gap-2 items-start">
							<h4 className="text-medium/7 sm:text-medium/8 font-medium text-balance">
								{data.title}
							</h4>
							{data.organization && (
								<p className="text-xs sm:text-sm font-normal text-foreground-500">
									{data.organization.name}
								</p>
							)}
						</div>
					</div>
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-6 w-full">
				<div className="flex flex-wrap justify-start gap-4 items-start text-foreground-600 w-full text-center text-sm">
					{data.type && <p>{jobType(data.type)}</p>}
					{data.location && (
						<div className="flex items-center gap-2">
							<MapPin size={16} /> {data.location}
						</div>
					)}
					<div className="flex items-center gap-2">
						<Briefcase size={16} />{" "}
						{formatExperienceRange({
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
		</Card>
	);
}

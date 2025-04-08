import type { JobType } from "@/__generated__/JobDetailsInternalFragment.graphql";
import type {
	JobFragment$key,
	WorkMode,
} from "@/__generated__/JobFragment.graphql";
import { getRelativeTimeString } from "@/lib/intl";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const JobFragment = graphql`
  fragment JobFragment on Job {
    slug
    title
    type
    workMode
    address {
      city
      state
    }
    skills
    currency
    hasSalaryRange
    minSalary
    maxSalary
    hasExperienceRange
    minExperience
    maxExperience
    createdAt
	applicationCount
    organization {
      name
      logoUrl
	  slug
      address {
        city
        state
		line1
		line2
		pincode
		country
      }
    }
  }
`;

type Props = {
	job: JobFragment$key;
};

export default function Job({ job }: Props) {
	const router = useRouter();
	const data = useFragment(JobFragment, job);

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

	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer"
			isPressable
			as="div"
			disableRipple
			onPress={() => {
				router.push(
					links.organizationJobDetail(data.organization.slug, data.slug),
				);
			}}
			shadow="none"
		>
			<CardHeader>
				<h4 className="text-lg/7 sm:text-xl/8 font-medium text-balance">
					{data.title}
				</h4>
			</CardHeader>
			<CardBody className="flex flex-col gap-10 w-full">
				<div className="flex flex-wrap gap-2 sm:gap-4 mt-2 w-full justify-start">
					{data.skills.map((skill) => (
						<Chip variant="flat" key={skill}>
							{skill}
						</Chip>
					))}
				</div>
				<div className="w-full flex flex-wrap justify-between items-center gap-4 sm:gap-8">
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">Applied</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">Shortlisted</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">Interviewed</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">On Hold</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">Offered</p>
					</div>
				</div>
			</CardBody>
			<CardFooter className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-4 sm:gap-6 w-full text-center sm:text-left">
				<p
					className="text-foreground-500 text-sm sm:text-base font-normal whitespace-nowrap"
					suppressHydrationWarning
				>
					Posted {getRelativeTimeString(data.createdAt)}
				</p>
			</CardFooter>
		</Card>
	);
}

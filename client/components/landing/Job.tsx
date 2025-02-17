import { dateFormat } from "@/lib/intl";
import links from "@/lib/links";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { Briefcase, Globe, IndianRupee, MapPin } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import JobControls from "../job-detail/JobControls";
import type { JobControlsAuthFragment$key } from "../job-detail/__generated__/JobControlsAuthFragment.graphql";
import type { JobType } from "../job-detail/__generated__/JobDetailsInternalFragment.graphql";
import type {
	JobFragment$key,
	WorkMode,
} from "./__generated__/JobFragment.graphql";

export const JobFragment = graphql`
  fragment JobFragment on Job {
	...JobControlsFragment
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
    organization {
      name
      logoUrl
      address {
        city
        state
      }
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
		<div className="flex items-center gap-2 text-xl font-medium">
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

	const experienceRange = data.hasExperienceRange
		? `${data.minExperience} - ${data.maxExperience} years`
		: "Not specified";

	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer"
			isPressable
			as="div"
			disableRipple
			onPress={() => {
				router.push(links.jobDetail(data.slug));
			}}
			shadow="none"
		>
			<CardHeader>
				<div className="flex flex-col sm:flex-row w-full justify-between gap-6 items-start sm:items-center">
					<div className="flex items-center gap-4">
						<Image
							src={data.organization?.logoUrl || ""}
							alt={data.organization?.name || ""}
							width={50}
							height={50}
						/>
						<div className="flex flex-col gap-2 items-start">
							<h4 className="text-lg sm:text-xl font-medium">{data.title}</h4>
							<p className="text-sm sm:text-base font-normal text-foreground-500">
								{data.organization?.name}
							</p>
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
					<p>{jobType(data.type)}</p>
					<div className="flex items-center gap-2">
						<MapPin size={16} /> {`${data.address.city}, ${data.address.state}`}
					</div>
					<div className="flex items-center gap-2">
						<Briefcase size={16} /> {experienceRange}
					</div>

					<div className="flex items-center gap-2">
						<Globe size={16} /> {workMode(data.workMode)}
					</div>
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

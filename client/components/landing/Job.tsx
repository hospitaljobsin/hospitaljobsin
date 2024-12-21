import { dateFormat } from "@/lib/intl";
import { useAuth } from "@/lib/use-auth";
import {
	Avatar,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
} from "@nextui-org/react";
import { Briefcase, Globe, IndianRupee, MapPin } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import JobControls from "../job-detail/JobControls";
import type { JobFragment$key } from "./__generated__/JobFragment.graphql";

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
    company {
      name
      logoUrl
      address {
        city
        state
      }
    }
  }
`;

type Props = {
	job: JobFragment$key;
};

export default function Job({ job }: Props) {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
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
			className="p-6 cursor-pointer"
			shadow="sm"
			isPressable
			as="div"
			disableRipple
			onPress={() => {
				router.push(`/jobs/${data.slug}`);
			}}
		>
			<CardHeader>
				<div className="flex w-full justify-between gap-4 items-center">
					<div className="flex items-center gap-4">
						<Avatar
							name={data.company?.name}
							src={data.company?.logoUrl || undefined}
							size="lg"
						/>
						<div className="flex flex-col gap-2 items-start">
							<h4 className="text-xl font-medium">{data.title}</h4>
							<p className="text-md font-normal text-foreground-500">
								{data.company?.name}
							</p>
						</div>
					</div>
					{salaryRange}
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-6 w-full">
				<div className="flex justify-between items-center gap-4 w-full">
					<p className="text-foreground-500 text-md font-normal">
						Posted on {formattedCreatedAt}
					</p>
				</div>
				<div className="flex flex-wrap gap-8 items-center text-foreground-600 w-full">
					<p>{data.type}</p>
					<div className="flex items-center gap-2">
						<MapPin size={16} /> {`${data.address.city}, ${data.address.state}`}
					</div>
					<div className="flex items-center gap-2">
						<Briefcase size={16} /> {experienceRange}
					</div>

					<div className="flex items-center gap-2">
						<Globe size={16} /> {data.workMode}
					</div>
				</div>
			</CardBody>
			<CardFooter className="flex items-center justify-between gap-6 w-full">
				<div className="flex flex-wrap gap-4 mt-2 w-full">
					{data.skills.map((skill, index) => (
						<Chip variant="flat" key={index}>
							{skill}
						</Chip>
					))}
				</div>
				<JobControls job={data} isAuthenticated={isAuthenticated} />
			</CardFooter>
		</Card>
	);
}

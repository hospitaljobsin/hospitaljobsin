import { dateFormat } from "@/lib/intl";
import {
	Avatar,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Divider,
	Link,
} from "@nextui-org/react";
import { Briefcase, Globe, IndianRupee, MapPin } from "lucide-react";
import NextLink from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { graphql, useFragment } from "react-relay";
import type { JobDetailsFragment$key } from "./__generated__/JobDetailsFragment.graphql";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Job {
    title
    description
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
      slug
      name
      description
      logoUrl
      address {
        city
        state
      }
    }
  }
`;

export default function JobDetails({
	job,
	children,
}: { job: JobDetailsFragment$key; children: ReactNode }) {
	const data = useFragment(JobDetailsFragment, job);

	const formattedCreatedAt = dateFormat.format(new Date(data.createdAt));

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
		<div className="flex items-center gap-2 text-md text-foreground-500">
			{currencyIcon(data.currency)}
			{"Not disclosed"}
		</div>
	);

	const experienceRange = data.hasExperienceRange
		? `${data.minExperience} - ${data.maxExperience} years`
		: "Not specified";

	return (
		<div className="w-full flex flex-col gap-6">
			{/* Job Title and Company */}
			<Card fullWidth className="p-6" shadow="sm">
				<CardHeader>
					<div className="flex w-full justify-between gap-4 items-center">
						<div className="flex flex-col gap-2 items-start">
							<h4 className="text-xl font-medium">{data.title}</h4>

							<p className="text-md font-normal text-foreground-500">
								{data.company?.name}
							</p>
						</div>
						{children}
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-6 w-full">
					<div className="flex justify-start items-center gap-8 w-full">
						<p className="text-foreground-500 text-md font-normal">
							Posted on {formattedCreatedAt}
						</p>
						{salaryRange}
					</div>
					<div className="flex flex-wrap gap-8 items-center text-foreground-600 w-full">
						<p>{data.type}</p>
						<div className="flex items-center gap-2">
							<MapPin size={16} />{" "}
							{`${data.address.city}, ${data.address.state}`}
						</div>
						<div className="flex items-center gap-2">
							<Briefcase size={16} /> {experienceRange}
						</div>

						<div className="flex items-center gap-2">
							<Globe size={16} /> {data.workMode}
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Job and Company Details */}

			<Card fullWidth className="p-6" shadow="sm">
				<CardBody className="flex items-center gap-6 flex-row w-full">
					{" "}
					<Avatar
						name={data.company?.name}
						src={data.company?.logoUrl || undefined}
						size="lg"
					/>
					<div className="w-full flex flex-col gap-2">
						<Link
							as={NextLink}
							color="foreground"
							isExternal
							showAnchorIcon
							href={`/companies/${data.company?.slug || ""}`}
						>
							{data.company?.name}
						</Link>
						<p className="text-default-500">{data.company?.description}</p>
					</div>
				</CardBody>
			</Card>

			{/* Job Description */}
			<Card className="p-6" fullWidth shadow="sm">
				<CardHeader>
					<h3 className="font-medium text-foreground-500">About the Job</h3>
				</CardHeader>
				<Divider />
				<CardBody>
					<ReactMarkdown className="prose dark:prose-invert prose-h2:text-sm">
						{data.description}
					</ReactMarkdown>
				</CardBody>
				<CardFooter>
					<div className="flex flex-wrap gap-4 mt-2 w-full">
						{data.skills.map((skill, index) => (
							<Chip variant="flat" key={`skill-${index}`}>
								{skill}
							</Chip>
						))}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

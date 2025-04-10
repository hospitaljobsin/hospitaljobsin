import type { JobDetailsFragment$key } from "@/__generated__/JobDetailsFragment.graphql";
import type { JobDetailsInternalFragment$key as JobDetailsInternalFragmentType } from "@/__generated__/JobDetailsInternalFragment.graphql";
import links from "@/lib/links";
import { Alert, Button, Card, Chip, Divider, Link } from "@heroui/react";
import { Edit2, FileText, IndianRupee } from "lucide-react";
import { useParams } from "next/navigation";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import JobControls from "./JobControls";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        ...JobDetailsInternalFragment
      }
     
    }
  }
`;

const JobDetailsInternalFragment = graphql`
  fragment JobDetailsInternalFragment on Job {
    title
    description
    slug
    skills
    minSalary
    maxSalary
	hasSalaryRange
    minExperience
    maxExperience
	hasExperienceRange
	currency
    address {
      city
      state
      country
    }
    createdAt
    updatedAt
    isActive
    applicationForm {
      __typename
      id
    }
    organization {
      isAdmin
      name
    }
	  ...JobControlsFragment
  }
`;

export default function JobDetails({
	rootQuery,
}: { rootQuery: JobDetailsFragment$key }) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const root = useFragment(JobDetailsFragment, rootQuery);
	invariant(root.job.__typename === "Job", "Expected 'Job' node type");
	const data = useFragment<JobDetailsInternalFragmentType>(
		JobDetailsInternalFragment,
		root.job,
	);

	const hasApplicationForm = data.applicationForm !== null;

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
			{!hasApplicationForm && data.organization?.isAdmin ? (
				<Alert
					color="warning"
					title="You need to set up an application form before publishing this job"
					variant="flat"
					endContent={
						<Button
							variant="flat"
							color="warning"
							as={Link}
							href={links.jobDetailApplicationForm(params.slug, params.jobSlug)}
						>
							Set up application form
						</Button>
					}
				/>
			) : null}

			{/* Job Details Card */}
			<Card className="p-6" shadow="none">
				<div className="flex justify-between items-start gap-6">
					<h2 className="text-lg font-medium w-full">{data.title}</h2>
					<div className="items-center gap-4 flex justify-end">
						{hasApplicationForm && data.organization?.isAdmin ? (
							<JobControls job={data} />
						) : null}
						<Button
							as={Link}
							href={links.jobDetailEdit(params.slug, params.jobSlug)}
							variant="bordered"
							startContent={<Edit2 className="w-4 h-4" />}
						>
							Edit Details
						</Button>
					</div>
				</div>

				<Divider className="my-4" />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="font-semibold text-lg mb-2">Job Description</h3>
						<div className="prose prose-sm max-w-none">
							<div dangerouslySetInnerHTML={{ __html: data.description }} />
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-lg mb-2">Job Details</h3>
						<dl className="space-y-2">
							{salaryRange}
							<div className="flex">
								<dt className="w-40 font-medium text-gray-600">Experience:</dt>
								<dd>
									{data.minExperience} - {data.maxExperience} years
								</dd>
							</div>
							<div className="flex">
								<dt className="w-40 font-medium text-gray-600">Location:</dt>
								<dd>{formatAddress(data.address)}</dd>
							</div>
							<div className="flex">
								<dt className="w-40 font-medium text-gray-600">Skills:</dt>
								<dd className="flex flex-wrap gap-1">
									{data.skills?.map((skill) => (
										<Chip key={skill} color="primary" variant="flat">
											{skill}
										</Chip>
									))}
								</dd>
							</div>
							<div className="flex">
								<dt className="w-40 font-medium text-gray-600">Job Slug:</dt>
								<dd>{data.slug}</dd>
							</div>
							<div className="flex">
								<dt className="w-40 font-medium text-gray-600">Created:</dt>
								<dd>{new Date(data.createdAt).toLocaleDateString()}</dd>
							</div>
							<div className="flex">
								<dt className="w-40 font-medium text-gray-600">
									Last Updated:
								</dt>
								<dd>{new Date(data.updatedAt).toLocaleDateString()}</dd>
							</div>
						</dl>
					</div>
				</div>
			</Card>

			{/* Application Form Card */}
			{hasApplicationForm && (
				<Card className="p-6" shadow="none">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<FileText className="w-5 h-5 text-primary-500" />
							<h3 className="text-md">Application Form</h3>
						</div>
						<Button
							as={Link}
							href={links.jobDetailApplicationForm(params.slug, params.jobSlug)}
							variant="bordered"
						>
							Update Application Form
						</Button>
					</div>
				</Card>
			)}

			{/* Hiring Stats Overview */}
			{/* {data.hiringStats && (
				<Card className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<ChartBarIcon className="w-5 h-5 text-primary-500" />
						<h3 className="font-semibold text-lg">Hiring Statistics</h3>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						<div className="bg-gray-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold">
								{data.hiringStats.totalApplications}
							</p>
							<p className="text-sm text-gray-600">Total Applications</p>
						</div>
						<div className="bg-blue-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-blue-600">
								{data.hiringStats.newApplications}
							</p>
							<p className="text-sm text-gray-600">New Applications</p>
						</div>
						<div className="bg-purple-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-purple-600">
								{data.hiringStats.interviewsScheduled}
							</p>
							<p className="text-sm text-gray-600">Interviews Scheduled</p>
						</div>
						<div className="bg-yellow-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-yellow-600">
								{data.hiringStats.offersExtended}
							</p>
							<p className="text-sm text-gray-600">Offers Extended</p>
						</div>
						<div className="bg-green-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-green-600">
								{data.hiringStats.hiredCount}
							</p>
							<p className="text-sm text-gray-600">Hired</p>
						</div>
						<div className="bg-red-50 p-4 rounded-lg text-center">
							<p className="text-2xl font-bold text-red-600">
								{data.hiringStats.rejectedCount}
							</p>
							<p className="text-sm text-gray-600">Rejected</p>
						</div>
					</div>
				</Card>
			)} */}
		</div>
	);
}

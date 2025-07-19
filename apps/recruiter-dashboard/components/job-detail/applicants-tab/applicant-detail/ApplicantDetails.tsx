"use client";
import type { ApplicantDetailsFragment$key } from "@/__generated__/ApplicantDetailsFragment.graphql";
import type { ApplicantDetails_job$key } from "@/__generated__/ApplicantDetails_job.graphql";
import {
	useCopilotAdditionalInstructions,
	useCopilotReadable,
} from "@copilotkit/react-core";
import { Card, CardBody, CardHeader, Link } from "@heroui/react";
import { Mail } from "lucide-react";
import Image from "next/image";
import { graphql, useFragment } from "react-relay";
import ApplicantStatusUpdater from "../shared/ApplicantStatusUpdater";

const ApplicantDetailsFragment = graphql`
  fragment ApplicantDetailsFragment on JobApplicant {
    id
    status
    applicantFields {
      fieldName
      fieldValue
    }
	profileSnapshot {
		headline
	}
    account @required(action: THROW) {
      fullName
      avatarUrl
      email
    }
	...ApplicantStatusUpdater_job
  }
`;

const ApplicantDetailsJobFragment = graphql`
  fragment ApplicantDetails_job on Job {
    id
	title
	description
	minExperience
	maxExperience
	minSalary
	maxSalary
	location
	skills
	type
	workMode
	vacancies
  }
`;

export default function ApplicantDetails({
	rootQuery,
	job,
}: {
	rootQuery: ApplicantDetailsFragment$key;
	job: ApplicantDetails_job$key;
}) {
	const data = useFragment(ApplicantDetailsFragment, rootQuery);
	const jobData = useFragment(ApplicantDetailsJobFragment, job);

	useCopilotAdditionalInstructions({
		instructions:
			"You are an AI assistant helping a human HR professional assess a job applicant. The user you are assisting is not the applicant. Do not greet, advise, or speak to the applicant. Your job is to analyze the applicant's data (provided below) in the context of the job they applied for and help the HR user decide how well the applicant fits the role. You have access to all relevant job data and applicant data. Always address the HR user directly and professionally. Provide a summary of fit, highlight relevant strengths or mismatches, and be concise.",
	});

	useCopilotReadable({
		description:
			"Job description and requirements that the applicant is being evaluated against",
		value: jobData,
	});

	useCopilotReadable({
		description: "Full name of the applicant, for reference by the HR user",
		value: data.account.fullName,
	});

	useCopilotReadable({
		description:
			"Professional headline or summary of the applicant's background, used to help assess fit for the job",
		value: data.profileSnapshot.headline,
	});

	useCopilotReadable({
		description:
			"Current application status of the applicant in the hiring pipeline (e.g., Applied, Interviewed, Shortlisted)",
		value: data.status,
	});

	useCopilotReadable({
		description:
			"The applicant's responses to the screening questions for this job, which should be evaluated for alignment with job requirements",
		value: data.applicantFields,
	});

	return (
		<div className="w-full flex flex-col gap-12">
			{/* Applicant Header Card */}
			<Card fullWidth className="p-6 " shadow="none">
				<CardHeader className="w-full flex flex-col sm:flex-row gap-6 justify-between">
					<div className="flex gap-6 sm:items-center w-full flex-col sm:flex-row">
						<div className="relative aspect-square h-20 w-20">
							<Image
								src={data.account.avatarUrl}
								alt={data.account.fullName}
								fill
								className="rounded-full object-cover"
							/>
						</div>
						<div className="flex flex-col gap-4 flex-1">
							<h2 className="text-xl font-medium">{data.account.fullName}</h2>
							<h3 className="text-foreground-600 text-medium line-clamp-2">
								{data.profileSnapshot.headline}
							</h3>
						</div>
					</div>
					<ApplicantStatusUpdater
						currentStatus={data.status}
						applicant={data}
					/>
				</CardHeader>
				<CardBody>
					<div className="flex items-center gap-2 text-foreground-600">
						<Mail size={16} />
						<Link
							href={`mailto:${data.account.email}`}
							className="text-foreground-600 text-sm"
						>
							{data.account.email}
						</Link>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

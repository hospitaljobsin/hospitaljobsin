"use client";
import type { ApplicantDetailsFragment$key } from "@/__generated__/ApplicantDetailsFragment.graphql";
import type { ApplicantDetails_job$key } from "@/__generated__/ApplicantDetails_job.graphql";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardBody, CardHeader, Divider, Link } from "@heroui/react";
import { Mail, ShieldQuestion } from "lucide-react";
import Image from "next/image";
import { graphql, useFragment } from "react-relay";
import ApplicantStatusUpdater from "./ApplicantStatusUpdater";

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
  }
`;

const ApplicantDetailsJobFragment = graphql`
  fragment ApplicantDetails_job on Job {
    id
    ...ApplicantStatusUpdater_job
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

	useCopilotReadable({
		description: "The current applicant's full name",
		value: data.account.fullName,
	});

	useCopilotReadable({
		description: "The current applicant's headline",
		value: data.profileSnapshot.headline,
	});

	return (
		<div className="w-full flex flex-col gap-12">
			{/* Applicant Header Card */}
			<Card fullWidth className="p-6 " shadow="none">
				<CardHeader className="w-full flex flex-row gap-6 justify-between">
					<div className="flex gap-6 items-center">
						<div className="relative h-20 w-20">
							<Image
								src={data.account.avatarUrl}
								alt={data.account.fullName}
								fill
								className="rounded-full object-cover"
							/>
						</div>
						<div className="flex flex-col gap-4">
							<h2 className="text-xl font-medium">{data.account.fullName}</h2>
							<h3 className="text-foreground-600 text-medium">
								{data.profileSnapshot.headline}
							</h3>
						</div>
					</div>
					<ApplicantStatusUpdater
						currentStatus={data.status}
						job={jobData}
						applicantId={data.id}
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

			{/* Application Fields */}
			{data.applicantFields && data.applicantFields.length > 0 && (
				<Card fullWidth shadow="none" className="p-6 space-y-6">
					<CardHeader>
						<h3 className="text-sm text-foreground-500">Screening Questions</h3>
					</CardHeader>
					<Divider />
					<CardBody>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{data.applicantFields.map((field, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={index} className="flex flex-col gap-4">
									<div className="w-full flex items-center gap-2">
										<ShieldQuestion className="text-foreground-500" size={20} />
										<h4 className="text-foreground-500 font-medium">
											{field.fieldName}
										</h4>
									</div>
									<p className="text-foreground">{field.fieldValue}</p>
								</div>
							))}
						</div>
					</CardBody>
				</Card>
			)}
		</div>
	);
}

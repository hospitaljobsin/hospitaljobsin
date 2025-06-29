import type { PersonalDetailsFragment$key } from "@/__generated__/PersonalDetailsFragment.graphql";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { SparklesIcon, UserIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const PersonalDetailsFragment = graphql`
  fragment PersonalDetailsFragment on JobApplicant {
	profileSnapshot {
		gender
		dateOfBirth
		maritalStatus
		category
		address
	}
	analysis {
		__typename
		... on JobApplicantAnalysis {
			analysedFields {
				gender { analysis score }
				dateOfBirth { analysis score }
				maritalStatus { analysis score }
				category { analysis score }
				address { analysis score }
			}
		}
	}
}
`;

function calculateAge(dateOfBirth: string | Date): string {
	const dob = new Date(dateOfBirth);
	const today = new Date();
	let age = today.getFullYear() - dob.getFullYear();
	const m = today.getMonth() - dob.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
		age--;
	}
	return `${age} yrs (${dob.toLocaleDateString("en-CA")})`;
}

type Props = {
	rootQuery: PersonalDetailsFragment$key;
};

export default function PersonalDetails({ rootQuery }: Props) {
	const query = useFragment(PersonalDetailsFragment, rootQuery);
	const data = query.profileSnapshot;
	const analysis =
		query.analysis?.__typename === "JobApplicantAnalysis"
			? query.analysis.analysedFields
			: undefined;

	useCopilotReadable({
		description: "The current applicant's personal details",
		value: data,
	});

	return (
		<div className="w-full">
			<Card className="w-full p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<UserIcon />
						<h1 className="w-full text-sm font-medium">Personal Details</h1>
					</div>
				</CardHeader>
				<CardBody className="grid grid-cols-1 gap-10 md:grid-cols-2">
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Gender</h1>
						{!data.gender ? (
							<h2 className="w-full text-foreground-500">No gender provided</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.gender}</h2>
						)}

						{analysis?.gender && (
							<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
								<div className="flex items-center gap-4 text-medium">
									<SparklesIcon size={18} /> {analysis.gender.score}%
								</div>
								<p>{analysis.gender.analysis}</p>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Age</h1>
						{!data.dateOfBirth ? (
							<h2 className="w-full text-foreground-500">
								No date of birth provided
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{calculateAge(data.dateOfBirth as string)}
							</h2>
						)}

						{analysis?.dateOfBirth && (
							<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
								<div className="flex items-center gap-4 text-medium">
									<SparklesIcon size={18} /> {analysis.dateOfBirth.score}%
								</div>
								<p>{analysis.dateOfBirth.analysis}</p>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Marital Status</h1>
						{!data.maritalStatus ? (
							<h2 className="w-full text-foreground-500">
								No marital status provided
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{data.maritalStatus}
							</h2>
						)}
						{analysis?.maritalStatus && (
							<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
								<div className="flex items-center gap-4 text-medium">
									<SparklesIcon size={18} /> {analysis.maritalStatus.score}%
								</div>
								<p>{analysis.maritalStatus.analysis}</p>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Category</h1>
						{!data.category ? (
							<h2 className="w-full text-foreground-500">
								No category provided
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.category}</h2>
						)}
						{analysis?.category && (
							<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
								<div className="flex items-center gap-4 text-medium">
									<SparklesIcon size={18} /> {analysis.category.score}%
								</div>
								<p>{analysis.category.analysis}</p>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Address</h1>
						{!data.address ? (
							<h2 className="w-full text-foreground-500">
								No address provided
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.address}</h2>
						)}
						{analysis?.address && (
							<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
								<div className="flex items-center gap-4 text-medium">
									<SparklesIcon size={18} /> {analysis.address.score}%
								</div>
								<p>{analysis.address.analysis}</p>
							</div>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

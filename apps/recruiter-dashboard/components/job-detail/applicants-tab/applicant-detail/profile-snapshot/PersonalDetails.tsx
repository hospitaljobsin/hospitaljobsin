import type {
	PersonalDetailsFragment$data,
	PersonalDetailsFragment$key,
} from "@/__generated__/PersonalDetailsFragment.graphql";
import { getAnalysisColor } from "@/lib/colors";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Alert, Card, CardBody, CardHeader } from "@heroui/react";
import { SparklesIcon, StarIcon, UserIcon } from "lucide-react";
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

	function calculateScore(
		analysis: PersonalDetailsFragment$data["analysis"]["analysedFields"],
	) {
		const score =
			analysis.gender.score +
			analysis.dateOfBirth.score +
			analysis.maritalStatus.score +
			analysis.category.score +
			analysis.address.score;
		return Math.round((score / 5) * 100 * 10) / 10;
	}

	return (
		<div className="w-full">
			<Card className="w-full p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<UserIcon />
						<h1 className="w-full text-sm font-medium">Personal Details</h1>
						{analysis && (
							<span className="text-primary-600 text-sm flex items-center gap-2">
								<StarIcon size={16} />
								{calculateScore(analysis)}%
							</span>
						)}
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-12">
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Gender</h1>
						{!data.gender ? (
							<h2 className="w-full text-foreground-500">No gender provided</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.gender}</h2>
						)}

						{analysis?.gender && (
							<Alert
								icon={<SparklesIcon size={18} />}
								hideIconWrapper
								color={getAnalysisColor(analysis.gender.score)}
								description={analysis.gender.analysis}
								variant="flat"
								radius="md"
							/>
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
							<Alert
								icon={<SparklesIcon size={18} />}
								hideIconWrapper
								color={getAnalysisColor(analysis.dateOfBirth.score)}
								description={analysis.dateOfBirth.analysis}
								variant="flat"
								radius="md"
							/>
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
							<Alert
								icon={<SparklesIcon size={18} />}
								hideIconWrapper
								color={getAnalysisColor(analysis.maritalStatus.score)}
								description={analysis.maritalStatus.analysis}
								variant="flat"
								radius="md"
							/>
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
							<Alert
								icon={<SparklesIcon size={18} />}
								hideIconWrapper
								color={getAnalysisColor(analysis.category.score)}
								description={analysis.category.analysis}
								variant="flat"
								radius="md"
							/>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

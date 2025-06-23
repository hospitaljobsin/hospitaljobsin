"use client";

import type { ApplicantCardFragment$key } from "@/__generated__/ApplicantCardFragment.graphql";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Checkbox,
	Chip,
	User,
} from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { useApplicantSelection } from "./ApplicantSelectionProvider";

type ApplicantCardProps = {
	applicant: ApplicantCardFragment$key;
};

const ApplicantCardFragment = graphql`
	fragment ApplicantCardFragment on JobApplicant @argumentDefinitions(showStatus: { type: "Boolean", defaultValue: true }) {
		id
		account @required(action: THROW) {
			email
			fullName
			avatarUrl
		}
		slug
		status @include(if: $showStatus)
		aiInsight {
			matchType
			score
			summary
			matchReasons
			mismatchedFields
		}
	}
`;

export default function ApplicantCard({ applicant }: ApplicantCardProps) {
	const data = useFragment(ApplicantCardFragment, applicant);
	const router = useRouter();
	const { slug } = useParams<{ slug: string }>();
	const [showDetails, setShowDetails] = useState(false);

	const { selectedApplicants, setSelectedApplicants } = useApplicantSelection();

	const isSelected = selectedApplicants.has(data.id);

	const getBadgeColor = (
		matchType: "PERFECT" | "CLOSE" | "LOW" | "%future added value",
	) => {
		switch (matchType) {
			case "PERFECT":
				return "success";
			case "CLOSE":
				return "warning";
			case "LOW":
				return "danger";
			default:
				return "default";
		}
	};

	return (
		<Card
			fullWidth
			className="p-6 cursor-pointer"
			shadow="none"
			isPressable
			onPress={() => {
				router.push(links.applicantDetail(slug, data.slug));
			}}
		>
			<CardHeader className="flex justify-start gap-4 items-center">
				<Checkbox
					isSelected={isSelected}
					onClick={(e) => {
						e.stopPropagation();
					}}
					onValueChange={(selected) => {
						if (selected)
							setSelectedApplicants(new Set([...selectedApplicants, data.id]));
						else
							setSelectedApplicants(
								new Set([...selectedApplicants].filter((id) => id !== data.id)),
							);
					}}
				/>
				<div className="flex justify-between items-start w-full">
					<div className="flex items-center gap-4 justify-between w-full">
						<User
							avatarProps={{ src: data.account.avatarUrl }}
							name={data.account.fullName}
							description={data.account.email}
						/>
						<Chip>{data.status}</Chip>
					</div>
				</div>
			</CardHeader>
			<CardBody>
				{data.aiInsight && (
					<div className="flex items-center gap-4">
						{data.aiInsight?.score && <p>{data.aiInsight.score} %</p>}
						{data.aiInsight?.matchType && (
							<Chip color={getBadgeColor(data.aiInsight.matchType)}>
								{data.aiInsight.matchType} match
							</Chip>
						)}
					</div>
				)}
				{data.aiInsight?.summary && (
					<div className="mt-4 p-4 bg-primary-50 rounded-lg">
						<p className="text-sm font-semibold text-primary-700">AI Summary</p>
						<p className="text-sm text-foreground-600">
							{data.aiInsight.summary}
						</p>
						<Button
							variant="light"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								setShowDetails(!showDetails);
							}}
							className="mt-2"
						>
							{showDetails ? "Hide Details" : "See Why"}
						</Button>
					</div>
				)}
				{showDetails && data.aiInsight && (
					<div className="mt-2 space-y-2 text-sm">
						<div>
							<p className="font-semibold text-success-600">Match Reasons:</p>
							<ul className="list-disc list-inside">
								{data.aiInsight.matchReasons.map((reason: string) => (
									<li key={reason}>{reason}</li>
								))}
							</ul>
						</div>
						<div>
							<p className="font-semibold text-danger-600">
								Mismatched Fields:
							</p>
							<ul className="list-disc list-inside">
								{data.aiInsight.mismatchedFields.map((field: string) => (
									<li key={field}>{field}</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	);
}

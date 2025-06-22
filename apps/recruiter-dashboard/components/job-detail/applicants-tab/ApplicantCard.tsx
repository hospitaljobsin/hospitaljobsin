"use client";

import type { ApplicantListFragment$data } from "@/__generated__/ApplicantListFragment.graphql";
import { Badge, Button, Card, User } from "@heroui/react";
import { useState } from "react";

type Applicant = ApplicantListFragment$data["applicants"]["edges"][0]["node"];

type ApplicantCardProps = {
	applicant: Applicant;
};

export default function ApplicantCard({ applicant }: ApplicantCardProps) {
	const [showDetails, setShowDetails] = useState(false);

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
		<Card>
			<div className="flex justify-between items-start">
				<User
					avatarProps={{ src: applicant.account.avatarUrl }}
					name={applicant.account.fullName}
					description={applicant.account.email}
				/>
				{applicant.aiInsight?.matchType && (
					<Badge color={getBadgeColor(applicant.aiInsight.matchType)}>
						{applicant.aiInsight.matchType}
					</Badge>
				)}
			</div>
			{applicant.aiInsight?.summary && (
				<div className="mt-4 p-4 bg-primary-50 rounded-lg">
					<p className="text-sm font-semibold text-primary-700">AI Summary</p>
					<p className="text-sm text-foreground-600">
						{applicant.aiInsight.summary}
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
			{showDetails && applicant.aiInsight && (
				<div className="mt-2 space-y-2 text-sm">
					<div>
						<p className="font-semibold text-success-600">Match Reasons:</p>
						<ul className="list-disc list-inside">
							{applicant.aiInsight.matchReasons.map((reason: string) => (
								<li key={reason}>{reason}</li>
							))}
						</ul>
					</div>
					<div>
						<p className="font-semibold text-danger-600">Mismatched Fields:</p>
						<ul className="list-disc list-inside">
							{applicant.aiInsight.mismatchedFields.map((field: string) => (
								<li key={field}>{field}</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</Card>
	);
}

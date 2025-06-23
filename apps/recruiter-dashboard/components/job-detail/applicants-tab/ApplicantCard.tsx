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
import {
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Info,
	Star,
	XCircle,
} from "lucide-react";
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
			fullName
			avatarUrl
		}
		slug
		status @include(if: $showStatus)
		profileSnapshot {
			headline
		}
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
			className="p-6 cursor-pointer group space-y-4"
			shadow="none"
			isPressable
			onPress={() => {
				router.push(links.applicantDetail(slug, data.slug));
			}}
		>
			<CardHeader className="flex items-center gap-6 justify-start">
				<Checkbox
					size="lg"
					isSelected={isSelected}
					aria-label={isSelected ? "Deselect applicant" : "Select applicant"}
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
				<div className="w-full sm:items-center flex gap-6 justify-between flex-1 flex-col sm:flex-row">
					<User
						classNames={{
							base: "flex gap-6 w-full justify-start",
							wrapper: "flex gap-2",
						}}
						avatarProps={{
							src: data.account.avatarUrl,
							size: "lg",
						}}
						name={
							<span className="font-medium text-lg text-foreground-900">
								{data.account.fullName}
							</span>
						}
						description={
							<span className="flex items-start justify-start w-full gap-1 text-sm text-foreground-500">
								{data.profileSnapshot.headline}
							</span>
						}
					/>
					<Chip
						variant="flat"
						color="default"
						className="text-xs px-2 py-1 font-medium capitalize"
						startContent={
							data.status === "OFFERED" ? (
								<CheckCircle2 size={14} />
							) : data.status === "ONHOLD" ? (
								<Info size={14} />
							) : data.status === "INTERVIEWED" ? (
								<Info size={14} />
							) : data.status === "SHORTLISTED" ? (
								<Star size={14} />
							) : data.status === "APPLIED" ? (
								<Info size={14} />
							) : null
						}
					>
						{data.status}
					</Chip>
				</div>
			</CardHeader>
			{data.aiInsight && (
				<CardBody className="flex flex-col gap-6">
					<div className="p-4 bg-primary-50 rounded-lg flex border border-primary-100 space-y-4 items-start flex-col sm:flex-row">
						<div className="w-full flex flex-col gap-4 items-start">
							<div className="flex items-center gap-2">
								<Info size={16} className="text-primary-500" />
								<p className="text-sm font-semibold text-primary-700">
									AI Summary
								</p>
							</div>
							<p className="text-sm text-foreground-600 leading-relaxed">
								{data.aiInsight.summary}
							</p>
							<Button
								variant="light"
								size="sm"
								onPress={() => {
									setShowDetails(!showDetails);
								}}
								className="flex items-center gap-1 text-primary-700 hover:text-primary-900"
								aria-label={
									showDetails ? "Hide match details" : "Show match details"
								}
							>
								{showDetails ? "Hide Details" : "See Why"}
								{showDetails ? (
									<ChevronUp size={16} />
								) : (
									<ChevronDown size={16} />
								)}
							</Button>
						</div>
						<div className="flex items-center gap-6">
							{typeof data.aiInsight.score === "number" && (
								<div className="flex items-center gap-2 text-lg font-semibold text-primary-700 bg-primary-50 rounded-full">
									<Star size={16} className="text-primary-500" />
									<span>{data.aiInsight.score}%</span>
								</div>
							)}
							{data.aiInsight.matchType && (
								<Chip
									color={getBadgeColor(data.aiInsight.matchType)}
									variant="flat"
									className="text-xs px-2 py-1 font-medium capitalize"
									startContent={
										data.aiInsight.matchType === "PERFECT" ? (
											<CheckCircle2 size={14} className="text-success-600" />
										) : data.aiInsight.matchType === "CLOSE" ? (
											<Info size={14} className="text-warning-600" />
										) : data.aiInsight.matchType === "LOW" ? (
											<XCircle size={14} className="text-danger-600" />
										) : null
									}
								>
									{data.aiInsight.matchType} match
								</Chip>
							)}
						</div>
					</div>

					{showDetails && data.aiInsight && (
						<div className="mt-2 space-y-2 text-sm">
							{data.aiInsight.matchReasons?.length > 0 && (
								<div className="flex flex-col items-start gap-6">
									<p className="font-semibold text-success-600 flex items-center gap-2">
										<CheckCircle2 size={14} /> Match Reasons:
									</p>
									<ul className="list-disc list-inside ml-4 space-y-4">
										{data.aiInsight.matchReasons.map((reason: string) => (
											<li key={reason}>{reason}</li>
										))}
									</ul>
								</div>
							)}
							{data.aiInsight.mismatchedFields?.length > 0 && (
								<div className="flex flex-col items-start gap-6">
									<p className="font-semibold text-danger-600 flex items-center gap-2">
										<XCircle size={14} /> Mismatched Fields:
									</p>
									<ul className="list-disc list-inside ml-4 space-y-4">
										{data.aiInsight.mismatchedFields.map((field: string) => (
											<li key={field}>{field}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}
				</CardBody>
			)}
		</Card>
	);
}

"use client";

import type { ApplicantCardFragment$key } from "@/__generated__/ApplicantCardFragment.graphql";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Checkbox,
	User,
} from "@heroui/react";
import {
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	SparklesIcon,
	Star,
	XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { useApplicantSelection } from "./ApplicantSelectionProvider";
import ApplicantStatusUpdater from "./shared/ApplicantStatusUpdater";

type ApplicantCardProps = {
	applicant: ApplicantCardFragment$key;
};

const ApplicantCardFragment = graphql`
	fragment ApplicantCardFragment on JobApplicant {
		id
		...ApplicantStatusUpdater_job
		account @required(action: THROW) {
			fullName
			avatarUrl
		}
		slug
		status
		profileSnapshot {
			headline
		}
		overallScore
		analysis {
			__typename
			... on JobApplicantAnalysisPending {
				__typename
			}
			... on JobApplicantAnalysisFailed {
				__typename
			}
			... on JobApplicantAnalysis {
				overallSummary
				strengths
				riskFlags
				createdAt
			}
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

	const atleastOneSelected = selectedApplicants.size > 0;

	return (
		<Card
			fullWidth
			className="p-6 cursor-pointer group space-y-4"
			shadow="none"
			isPressable
			as="div"
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
					{!atleastOneSelected && (
						<ApplicantStatusUpdater
							currentStatus={data.status}
							applicant={data}
						/>
					)}
				</div>
			</CardHeader>
			{data.analysis && (
				<CardBody className="flex flex-col gap-6">
					<div className="p-4 bg-primary-50 rounded-lg flex border border-primary-100 space-y-4 items-start flex-col sm:flex-row">
						<div className="w-full flex flex-col gap-4 items-start">
							<div className="flex items-center gap-2">
								<SparklesIcon size={16} className="text-primary-500" />
								<p className="text-sm font-semibold text-primary-700">
									AI Analysis
								</p>
							</div>
							{data.analysis.__typename === "JobApplicantAnalysisPending" && (
								<p className="text-sm text-foreground-600 leading-relaxed">
									Analysis is pending. Please check back later.
								</p>
							)}
							{data.analysis.__typename === "JobApplicantAnalysisFailed" && (
								<p className="text-sm text-danger-600 leading-relaxed">
									Analysis failed. Unable to generate insights for this
									applicant.
								</p>
							)}
							{data.analysis.__typename === "JobApplicantAnalysis" && (
								<>
									<p className="text-sm text-foreground-600 leading-relaxed">
										{data.analysis.overallSummary}
									</p>
									<Button
										variant="light"
										size="sm"
										onPress={() => {
											setShowDetails(!showDetails);
										}}
										className="flex items-center gap-1 text-primary-700 hover:text-primary-900"
										aria-label={
											showDetails
												? "Hide analysis details"
												: "Show analysis details"
										}
									>
										{showDetails ? "Hide Details" : "See Why"}
										{showDetails ? (
											<ChevronUp size={16} />
										) : (
											<ChevronDown size={16} />
										)}
									</Button>
								</>
							)}
						</div>
						<div className="flex items-center gap-6">
							{data.analysis.__typename === "JobApplicantAnalysis" && (
								<div className="flex items-center gap-2 text-lg font-semibold text-primary-700 bg-primary-50 rounded-full">
									<Star size={16} className="text-primary-500" />
									<span>{data.overallScore * 100}%</span>
								</div>
							)}
						</div>
					</div>

					{showDetails &&
						data.analysis.__typename === "JobApplicantAnalysis" && (
							<div className="mt-2 space-y-4 text-sm w-full">
								{Array.isArray(data.analysis.strengths) &&
									data.analysis.strengths.length > 0 && (
										<div className="flex flex-col items-start gap-2">
											<p className="font-semibold text-success-600 flex items-center gap-2">
												<CheckCircle2 size={14} /> Strengths:
											</p>
											<ul className="list-disc list-inside ml-4 space-y-1">
												{data.analysis.strengths.map((strength: string) => (
													<li key={strength}>{strength}</li>
												))}
											</ul>
										</div>
									)}
								{Array.isArray(data.analysis.riskFlags) &&
									data.analysis.riskFlags.length > 0 && (
										<div className="flex flex-col items-start gap-2">
											<p className="font-semibold text-danger-600 flex items-center gap-2">
												<XCircle size={14} /> Potential Risks:
											</p>
											<ul className="list-disc list-inside ml-4 space-y-1">
												{data.analysis.riskFlags.map((flag: string) => (
													<li key={flag}>{flag}</li>
												))}
											</ul>
										</div>
									)}

								{data.analysis.createdAt && (
									<p className="text-xs text-foreground-400 mt-2">
										Analysed on:{" "}
										{new Date(data.analysis.createdAt).toLocaleString()}
									</p>
								)}
							</div>
						)}
				</CardBody>
			)}
		</Card>
	);
}

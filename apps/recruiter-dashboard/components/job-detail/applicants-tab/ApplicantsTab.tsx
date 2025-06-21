"use client";
import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import type { ApplicantsTabFragment$key } from "@/__generated__/ApplicantsTabFragment.graphql";
import PageJobDetailApplicantsQuery, {
	type pageJobDetailApplicantsQuery,
} from "@/__generated__/pageJobDetailApplicantsQuery.graphql";
import {
	Button,
	Card,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import type { Selection } from "@react-types/shared";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	useMutation,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import ApplicantList from "./ApplicantList";
import ApplicantListController from "./ApplicantListController";

export const JOB_APPLICANT_STATUSES = [
	"APPLIED",
	"INTERVIEWED",
	"OFFERED",
	"ONHOLD",
	"SHORTLISTED",
] as JobApplicantStatus[];

const updateJobApplicantsStatusMutation = graphql`
	mutation ApplicantsTabUpdateStatusMutation(
		$jobId: ID!
		$applicantIds: [ID!]!
		$status: JobApplicantStatus!
	) {
		updateJobApplicantsStatus(
			jobId: $jobId
			jobApplicantIds: $applicantIds
			status: $status
		) {
			... on UpdateJobApplicantsStatusSuccess {
				jobApplicants {
					id
					slug
					status
					account {
						email
						fullName
						avatarUrl
					}
				}
			}
		}
	}
`;

const ApplicantsTabFragment = graphql`
	fragment ApplicantsTabFragment on Query
	@argumentDefinitions(
		slug: { type: "String!" }
		jobSlug: { type: "String!" }
		searchTerm: { type: "String", defaultValue: null }
		status: { type: "JobApplicantStatus", defaultValue: null }
		showStatus: { type: "Boolean", defaultValue: true }
	) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				job(slug: $jobSlug) {
					__typename
					... on Job {
						id
						...ApplicantListFragment
							@arguments(
								searchTerm: $searchTerm
								status: $status
								showStatus: $showStatus
							)
					}
				}
			}
		}
	}
`;

export default function ApplicantsTab(props: {
	initialQueryRef: PreloadedQuery<pageJobDetailApplicantsQuery>;
}) {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const [status, setStatus] = useState<JobApplicantStatus | null>(null);
	const data = usePreloadedQuery(
		PageJobDetailApplicantsQuery,
		props.initialQueryRef,
	);
	const query = useFragment<ApplicantsTabFragment$key>(
		ApplicantsTabFragment,
		data,
	);
	invariant(
		query.organization?.__typename === "Organization",
		"Expected 'organization' type",
	);
	invariant(
		query.organization.job?.__typename === "Job",
		"Expected 'job' type",
	);

	const [commitMutation, isInFlight] = useMutation(
		updateJobApplicantsStatusMutation,
	);

	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

	const allKeys = useMemo(
		() =>
			new Set(
				query.organization.job.applicants?.edges.map((edge) => edge.node.id) ??
					[],
			),
		[query.organization.job.applicants?.edges],
	);

	const selectedCount =
		selectedKeys === "all" ? allKeys.size : selectedKeys.size;

	const isAllSelected =
		selectedKeys !== "all" &&
		selectedKeys.size === allKeys.size &&
		selectedKeys.size > 0;

	return (
		<div className="pt-8 pl-6 w-full h-full flex flex-col items-center gap-12">
			{selectedCount > 0 ? (
				<Card
					fullWidth
					className="flex flex-row justify-between items-center p-6 w-full"
					shadow="none"
				>
					<p className="text-md font-medium">
						{selectedCount} applicant
						{selectedCount > 1 ? "s" : ""} selected
					</p>
					<Dropdown>
						<DropdownTrigger>
							<Button
								variant="flat"
								color="primary"
								endContent={<ChevronDown />}
								isLoading={isInFlight}
							>
								Change Status
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label="Change applicant status"
							onAction={(key) => {
								commitMutation({
									variables: {
										jobId: query.organization.job.id,
										applicantIds:
											selectedKeys === "all"
												? Array.from(allKeys)
												: Array.from(selectedKeys as Set<string>),
										status: key as JobApplicantStatus,
									},
									onCompleted: () => {
										setSelectedKeys(new Set());
									},
								});
							}}
						>
							{JOB_APPLICANT_STATUSES.map((status) => (
								<DropdownItem key={status}>{status}</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</Card>
			) : (
				<ApplicantListController
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					status={status}
					setStatus={setStatus}
				/>
			)}
			<ApplicantList
				rootQuery={query.organization.job}
				searchTerm={searchTerm}
				status={status}
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
				allKeys={allKeys}
				isAllSelected={isAllSelected}
			/>
		</div>
	);
}

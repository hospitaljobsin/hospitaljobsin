"use client";
import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import type { ApplicantsTabFragment$key } from "@/__generated__/ApplicantsTabFragment.graphql";
import PageJobDetailApplicantsQuery, {
	type pageJobDetailApplicantsQuery,
} from "@/__generated__/pageJobDetailApplicantsQuery.graphql";
import { useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import ApplicantList from "./ApplicantList";
import ApplicantListController from "./ApplicantListController";
import { ApplicantSelectionProvider } from "./ApplicantSelectionProvider";

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
						...ApplicantListControllerFragment
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

	return (
		<ApplicantSelectionProvider>
			<div className="pt-8 pl-6 w-full h-full flex flex-col items-center gap-12">
				<ApplicantListController
					job={query.organization.job}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					status={status}
					setStatus={setStatus}
				/>
				<ApplicantList
					rootQuery={query.organization.job}
					searchTerm={searchTerm}
					status={status}
				/>
			</div>
		</ApplicantSelectionProvider>
	);
}

"use client";
import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import type { ApplicantsTabFragment$key } from "@/__generated__/ApplicantsTabFragment.graphql";
import PageJobDetailApplicantsQuery, {
	type pageJobDetailApplicantsQuery,
} from "@/__generated__/pageJobDetailApplicantsQuery.graphql";
import JobNotFoundView from "@/components/JobNotFoundView";
import NotFoundView from "@/components/NotFoundView";
import { useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
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
	if (query.organization.__typename !== "Organization") {
		return <NotFoundView />;
	}

	if (query.organization.job.__typename !== "Job") {
		return <JobNotFoundView />;
	}

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

"use client";
import type {
	JobApplicantStatus,
	JobApplicantsSortBy,
} from "@/__generated__/ApplicantListPaginationQuery.graphql";
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
		sortBy: { type: "JobApplicantsSortBy", defaultValue: OVERALL_SCORE }
	) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				isMember
				job(slug: $jobSlug) {
					__typename
					... on Job {
						id
						...ApplicantListControllerFragment
						...ApplicantListFragment
							@arguments(
								searchTerm: $searchTerm
								status: $status
								sortBy: $sortBy
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
	const [sortBy, setSortBy] = useState<JobApplicantsSortBy>("OVERALL_SCORE");
	const [isLoading, setIsLoading] = useState(false);
	const data = usePreloadedQuery(
		PageJobDetailApplicantsQuery,
		props.initialQueryRef,
	);
	const query = useFragment<ApplicantsTabFragment$key>(
		ApplicantsTabFragment,
		data,
	);
	if (
		query.organization.__typename !== "Organization" ||
		!query.organization.isMember
	) {
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
					sortBy={sortBy}
					setSortBy={setSortBy}
					isLoading={isLoading}
				/>
				<ApplicantList
					rootQuery={query.organization.job}
					searchTerm={searchTerm}
					status={status}
					sortBy={sortBy}
					onLoadingChange={setIsLoading}
				/>
			</div>
		</ApplicantSelectionProvider>
	);
}

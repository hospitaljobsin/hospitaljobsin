/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import type { ApplicantsTabFragment$key } from "@/__generated__/ApplicantsTabFragment.graphql";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import ApplicantList from "./ApplicantList";
import ApplicantListController from "./ApplicantListController";

const ApplicantsTabFragment = graphql`
 fragment ApplicantsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: {type: "String!"}
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
						...ApplicantListFragment @arguments(searchTerm: $searchTerm, status: $status, showStatus: $showStatus)
					}     
				}
			}
		}

  }
`;

export default function ApplicantsTab(props: {
	rootQuery: ApplicantsTabFragment$key;
}) {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const [status, setStatus] = useState<JobApplicantStatus | null>(null);
	const query = useFragment(ApplicantsTabFragment, props.rootQuery);
	invariant(
		query.organization.__typename === "Organization",
		"Expected 'organization' type",
	);
	invariant(query.organization.job.__typename === "Job", "Expected 'job' type");

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<ApplicantListController
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
	);
}

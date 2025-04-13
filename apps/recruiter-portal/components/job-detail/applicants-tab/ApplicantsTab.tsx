/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { JobApplicantStatus } from "@/__generated__/ApplicantListPaginationQuery.graphql";
import type { ApplicantsTabFragment$key } from "@/__generated__/ApplicantsTabFragment.graphql";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import ApplicantController from "./ApplicantController";
import ApplicantList from "./ApplicantList";

const ApplicantsTabFragment = graphql`
 fragment ApplicantsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  searchTerm: { type: "String", defaultValue: null }
	  status: { type: "JobApplicantStatus", defaultValue: null }
    ) {
		job(slug: $slug) {
			__typename
			... on Job {
				...ApplicantListFragment @arguments(searchTerm: $searchTerm, status: $status)
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
	invariant(query.job.__typename === "Job", "Expected 'job' type");

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<ApplicantController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				status={status}
				setStatus={setStatus}
			/>
			<ApplicantList
				rootQuery={query.job}
				searchTerm={searchTerm}
				status={status}
			/>
		</div>
	);
}

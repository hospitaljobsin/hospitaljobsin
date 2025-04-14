/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { ApplicantDetailViewFragment$key } from "@/__generated__/ApplicantDetailViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import ApplicantDetails from "./ApplicantDetails";

const ApplicantDetailViewFragment = graphql`
 fragment ApplicantDetailViewFragment on Query @argumentDefinitions(
    slug: { type: "String!"}
	applicantSlug: { type: "String!"}
    ) {
        job(slug: $slug) {
            __typename
            ... on Job {
                jobApplicant(slug: $applicantSlug) {
                    __typename
                    ... on JobApplicant {
                        ...ApplicantDetailsFragment
                    }
                }
            }     
        }
  }
`;

export default function ApplicantDetailView(props: {
	rootQuery: ApplicantDetailViewFragment$key;
}) {
	const query = useFragment(ApplicantDetailViewFragment, props.rootQuery);
	invariant(
		query.job.__typename === "Job" &&
			query.job.jobApplicant.__typename === "JobApplicant",
		"`Job` and `JobApplicant` node type expected.",
	);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<ApplicantDetails rootQuery={query.job.jobApplicant} />
		</div>
	);
}

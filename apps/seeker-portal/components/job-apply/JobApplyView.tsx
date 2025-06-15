import type { JobApplyViewFragment$key } from "@/__generated__/JobApplyViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import JobApplicationDetails from "./JobApplicationDetails";
import JobApplyForm from "./JobApplyForm";

const JobApplyViewFragment = graphql`
 fragment JobApplyViewFragment on Query @argumentDefinitions(
      slug: { type: "String!"}
      jobSlug: { type: "String!"}
    ) {
      organization(slug: $slug) {
        __typename
        ... on Organization {
          job(slug: $jobSlug) {
            __typename
            ... on Job {
              ...JobApplyFormFragment
              ...JobApplicationDetailsFragment
            }

          }
        }
      }

  }
`;

export default function JobApplyView(props: {
	rootQuery: JobApplyViewFragment$key;
}) {
	const query = useFragment(JobApplyViewFragment, props.rootQuery);

	invariant(
		query.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);

	invariant(
		query.organization.job.__typename === "Job",
		"Expected 'Job' node type",
	);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-6">
			<JobApplicationDetails job={query.organization.job} />
			<JobApplyForm rootQuery={query.organization.job} />
		</div>
	);
}

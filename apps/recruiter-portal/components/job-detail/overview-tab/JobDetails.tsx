import type { JobDetailsFragment$key } from "@/__generated__/JobDetailsFragment.graphql";
import type { JobDetailsInternalFragment$key as JobDetailsInternalFragmentType } from "@/__generated__/JobDetailsInternalFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        ...JobDetailsInternalFragment
      }
     
    }
  }
`;

const JobDetailsInternalFragment = graphql`
  fragment JobDetailsInternalFragment on Job {
    title
    description
  }
`;

export default function JobDetails({
	rootQuery,
}: { rootQuery: JobDetailsFragment$key }) {
	const root = useFragment(JobDetailsFragment, rootQuery);
	invariant(root.job.__typename === "Job", "Expected 'Job' node type");
	const data = useFragment<JobDetailsInternalFragmentType>(
		JobDetailsInternalFragment,
		root.job,
	);

	return <div className="w-full flex flex-col gap-6"></div>;
}

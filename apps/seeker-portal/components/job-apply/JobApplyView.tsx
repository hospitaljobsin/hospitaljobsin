import type { JobApplyViewFragment$key } from "@/__generated__/JobApplyViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import JobApplyForm from "./JobApplyForm";

const JobApplyViewFragment = graphql`
 fragment JobApplyViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		job(slug: $slug) {
      __typename
      ... on Job {
        ...JobApplyFormFragment
      }
     
    }
  }
`;

export default function JobApplyView(props: {
	rootQuery: JobApplyViewFragment$key;
}) {
	const query = useFragment(JobApplyViewFragment, props.rootQuery);

	invariant(query.job.__typename === "Job", "Expected 'Job' node type");

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-6">
			<JobApplyForm rootQuery={query.job} />
		</div>
	);
}

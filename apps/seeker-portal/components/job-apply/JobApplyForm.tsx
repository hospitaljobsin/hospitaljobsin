import type { JobApplyFormFragment$key } from "@/__generated__/JobApplyFormFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";

const JobApplyFormFragment = graphql`
  fragment JobApplyFormFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        applicationForm {
          fields {
            fieldName
            defaultValue
            isRequired
          }
        }
      }
     
    }
  }
`;

export default function JobApplyForm({
	rootQuery,
}: {
	rootQuery: JobApplyFormFragment$key;
}) {
	const root = useFragment(JobApplyFormFragment, rootQuery);

	invariant(root.job.__typename === "Job", "Expected 'Job' node type");

	return <div className="w-full flex flex-col gap-6">job apply form</div>;
}

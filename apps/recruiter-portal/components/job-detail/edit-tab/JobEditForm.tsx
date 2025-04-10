import type { JobEditFormFragment$key } from "@/__generated__/JobEditFormFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const JobEditFormFragment = graphql`
  fragment JobEditFormFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        id
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

export default function JobEditForm({
	rootQuery,
}: {
	rootQuery: JobEditFormFragment$key;
}) {
	const root = useFragment(JobEditFormFragment, rootQuery);

	invariant(root.job.__typename === "Job", "Expected 'Job' node type");

	return <div className="w-full flex flex-col gap-6">job edit form</div>;
}

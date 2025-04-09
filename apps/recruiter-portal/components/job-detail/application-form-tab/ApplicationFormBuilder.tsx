import type { ApplicationFormBuilderFragment$key } from "@/__generated__/ApplicationFormBuilderFragment.graphql";
import { graphql, useFragment } from "react-relay";

const ApplicationFormBuilderFragment = graphql`
  fragment ApplicationFormBuilderFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        id
      }
     
    }
  }
`;

export default function ApplicationFormBuilder({
	rootQuery,
}: { rootQuery: ApplicationFormBuilderFragment$key }) {
	const root = useFragment(ApplicationFormBuilderFragment, rootQuery);

	return (
		<div className="w-full flex flex-col gap-6">application form builder</div>
	);
}

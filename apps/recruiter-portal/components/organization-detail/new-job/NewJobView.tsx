"use client";
import type { NewJobViewFragment$key } from "@/__generated__/NewJobViewFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import NewJobForm from "./NewJobForm";

const NewJobViewFragment = graphql`
 fragment NewJobViewFragment on Query @argumentDefinitions(
		slug: { type: "String!" }
	) {
        viewer {
            __typename
            ... on Account {
                ...NewJobFormAccountFragment
            }
        }

        organization(slug: $slug) {
            __typename
            ... on Organization {
                ...NewJobFormOrganizationFragment
            }
        }
  }
`;

export default function NewJobView({
	rootQuery,
}: { rootQuery: NewJobViewFragment$key }) {
	const data = useFragment(NewJobViewFragment, rootQuery);

	invariant(
		data.viewer.__typename === "Account",
		"Expected viewer to be an Account",
	);

	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' type.",
	);

	return (
		<div className="flex flex-col w-full h-full">
			<NewJobForm account={data.viewer} organization={data.organization} />
		</div>
	);
}

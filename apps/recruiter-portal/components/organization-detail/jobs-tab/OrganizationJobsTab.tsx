/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { OrganizationJobsTabFragment$key } from "@/__generated__/OrganizationJobsTabFragment.graphql";
import { graphql, useFragment } from "react-relay";
import OrganizationJobsList from "./OrganizationJobsList";

const OrganizationJobsTabFragment = graphql`
 fragment OrganizationJobsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...OrganizationJobsListFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationJobsTab(props: {
	rootQuery: OrganizationJobsTabFragment$key;
}) {
	const query = useFragment(OrganizationJobsTabFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<OrganizationJobsList rootQuery={query} />
		</div>
	);
}

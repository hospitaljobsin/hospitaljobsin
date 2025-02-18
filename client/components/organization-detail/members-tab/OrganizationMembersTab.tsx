/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import { graphql, useFragment } from "react-relay";
import type { OrganizationMembersTabFragment$key } from "./__generated__/OrganizationMembersTabFragment.graphql";

const OrganizationMembersTabFragment = graphql`
 fragment OrganizationMembersTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...OrganizationDetailsFragment @arguments(slug: $slug)
        ...OrganizationJobsListFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationMembersTab(props: {
	rootQuery: OrganizationMembersTabFragment$key;
}) {
	const query = useFragment(OrganizationMembersTabFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			organization members tab
		</div>
	);
}

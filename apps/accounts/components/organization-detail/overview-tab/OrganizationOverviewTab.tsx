/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import { graphql, useFragment } from "react-relay";
import OrganizationDetails from "./OrganizationDetails";
import OrganizationJobsList from "./OrganizationJobsList";
import type { OrganizationOverviewTabFragment$key } from "./__generated__/OrganizationOverviewTabFragment.graphql";

const OrganizationOverviewTabFragment = graphql`
 fragment OrganizationOverviewTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...OrganizationDetailsFragment @arguments(slug: $slug)
        ...OrganizationJobsListFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationOverviewTab(props: {
	rootQuery: OrganizationOverviewTabFragment$key;
}) {
	const query = useFragment(OrganizationOverviewTabFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<OrganizationDetails rootQuery={query} />
			<OrganizationJobsList rootQuery={query} />
		</div>
	);
}

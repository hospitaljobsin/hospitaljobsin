/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import { graphql, useFragment } from "react-relay";
import OrganizationDetails from "./OrganizationDetails";
import OrganizationJobsList from "./OrganizationJobsList";
import type { OrganizationDetailViewFragment$key } from "./__generated__/OrganizationDetailViewFragment.graphql";

const OrganizationDetailViewFragment = graphql`
 fragment OrganizationDetailViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		...OrganizationDetailsFragment @arguments(slug: $slug)
		...OrganizationJobsListFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationDetailView(props: {
	rootQuery: OrganizationDetailViewFragment$key;
}) {
	const query = useFragment(OrganizationDetailViewFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<OrganizationDetails rootQuery={query} />
			<OrganizationJobsList rootQuery={query} />
		</div>
	);
}

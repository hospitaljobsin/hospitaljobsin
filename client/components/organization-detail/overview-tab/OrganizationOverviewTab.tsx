/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import { Briefcase } from "lucide-react";
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
			<div className="w-full flex flex-col gap-6">
				<div className="w-full flex items-center gap-4 px-2 text-foreground-600">
					<Briefcase className="w-5 h-5" />
					<p>Posted Jobs</p>
				</div>
				<OrganizationJobsList rootQuery={query} />
			</div>
		</div>
	);
}

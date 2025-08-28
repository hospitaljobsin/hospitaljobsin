/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { OrganizationOverviewTabFragment$key } from "@/__generated__/OrganizationOverviewTabFragment.graphql";
import OrgDetailHeader from "@/components/layout/OrgDetailHeader";
import { graphql, useFragment } from "react-relay";
import OrganizationDetails from "./OrganizationDetails";
import OrganizationJobsList from "./OrganizationJobsList";

const OrganizationOverviewTabFragment = graphql`
 fragment OrganizationOverviewTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		...OrgDetailHeaderFragment @arguments(slug: $slug)
        ...OrganizationDetailsFragment @arguments(slug: $slug)
        ...OrganizationJobsListFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationOverviewTab(props: {
	rootQuery: OrganizationOverviewTabFragment$key;
}) {
	const query = useFragment(OrganizationOverviewTabFragment, props.rootQuery);

	return (
		<div className="w-full flex flex-col flex-1">
			<OrgDetailHeader root={query} />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-7xl mx-auto">
					<div className="py-8 w-full h-full flex flex-col items-center gap-12">
						<OrganizationDetails rootQuery={query} />
						<OrganizationJobsList rootQuery={query} />
					</div>
				</div>
			</div>
		</div>
	);
}

"use client";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import OrganizationTabs from "./OrganizationTabs";
import type { OrganizationDetailViewFragment$key } from "./__generated__/OrganizationDetailViewFragment.graphql";
import OrganizationOverviewTab from "./overview-tab/OrganizationOverviewTab";

const OrganizationDetailViewFragment = graphql`
 fragment OrganizationDetailViewFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
		...OrganizationTabsFragment @arguments(slug: $slug)
		...OrganizationOverviewTabFragment @arguments(slug: $slug)
	}
`;

export default function OrganizationDetailView(props: {
	rootQuery: OrganizationDetailViewFragment$key;
}) {
	const root = useFragment(OrganizationDetailViewFragment, props.rootQuery);
	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<OrganizationTabs rootQuery={root} />
			<OrganizationOverviewTab rootQuery={root} />
		</div>
	);
}

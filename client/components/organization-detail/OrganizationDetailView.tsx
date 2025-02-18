/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import OrganizationTabs from "./OrganizationTabs";
import OrganizationOverviewTab from "./overview-tab/OrganizationOverviewTab";
import type { OrganizationOverviewTabFragment$key } from "./overview-tab/__generated__/OrganizationOverviewTabFragment.graphql";

export default function OrganizationDetailView(props: {
	rootQuery: OrganizationOverviewTabFragment$key;
}) {
	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<OrganizationTabs />
			<OrganizationOverviewTab rootQuery={props.rootQuery} />
		</div>
	);
}

"use client";
import type { SidebarOrgSettingsQuery as SidebarOrgSettingsQueryType } from "@/__generated__/SidebarOrgSettingsQuery.graphql";
import useOrganization from "@/lib/hooks/useOrganization";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import OrgSettingsSidebar, { SidebarOrgSettingsQuery } from "./Sidebar";
import OrgSettingsSidebarSkeleton from "./SidebarSkeleton";

export default function SidebarClientComponent() {
	const { organizationSlug } = useOrganization();
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<SidebarOrgSettingsQueryType>(
		environment,
		SidebarOrgSettingsQuery,
		{
			slug: organizationSlug,
		},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<OrgSettingsSidebarSkeleton />}>
			<OrgSettingsSidebar queryReference={queryReference} />
		</Suspense>
	);
}

"use client";
import type { SidebarJobSettingsQuery as SidebarJobSettingsQueryType } from "@/__generated__/SidebarJobSettingsQuery.graphql";
import useOrganization from "@/lib/hooks/useOrganization";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import SettingsSidebar, { SidebarJobSettingsQuery } from "./Sidebar";

export default function SettingsSidebarClientComponent() {
	const params = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const environment = useRelayEnvironment();
	const slug = decodeURIComponent(params.slug);

	const queryReference = loadQuery<SidebarJobSettingsQueryType>(
		environment,
		SidebarJobSettingsQuery,
		{
			slug: organizationSlug,
			jobSlug: slug,
		},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<Suspense>
			<SettingsSidebar queryReference={queryReference} />
		</Suspense>
	);
}

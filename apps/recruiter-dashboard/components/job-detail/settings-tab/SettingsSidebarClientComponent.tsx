"use client";
import type { SettingsSidebarJobSettingsQuery as SettingsSidebarJobSettingsQueryType } from "@/__generated__/SettingsSidebarJobSettingsQuery.graphql";
import useOrganization from "@/lib/hooks/useOrganization";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import SettingsSidebar, {
	SettingsSidebarJobSettingsQuery,
} from "./SettingsSidebar";

export default function SettingsSidebarClientComponent() {
	const params = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const environment = useRelayEnvironment();
	const slug = decodeURIComponent(params.slug);

	const queryReference = loadQuery<SettingsSidebarJobSettingsQueryType>(
		environment,
		SettingsSidebarJobSettingsQuery,
		{
			slug: organizationSlug,
			jobSlug: slug,
		},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense>
			<SettingsSidebar queryReference={queryReference} />
		</Suspense>
	);
}

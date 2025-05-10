"use client";
import type { SidebarJobSettingsQuery as SidebarJobSettingsQueryType } from "@/__generated__/SidebarJobSettingsQuery.graphql";
import SettingsSidebar, {
    SidebarJobSettingsQuery,
} from "@/components/job-detail/settings-tab/Sidebar";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function SettingsSidebarClientComponent() {
    const params = useParams<{ slug: string; jobSlug: string }>();
    const environment = useRelayEnvironment();
    const slug = decodeURIComponent(params.slug);
    const jobSlug = decodeURIComponent(params.jobSlug);

    const queryReference = loadQuery<SidebarJobSettingsQueryType>(
        environment,
        SidebarJobSettingsQuery,
        {
            slug: slug,
            jobSlug: jobSlug,
        },
        { fetchPolicy: "store-or-network" },
    );

    return (
                        <Suspense>
                            <SettingsSidebar queryReference={queryReference} />
                        </Suspense>
    );
}

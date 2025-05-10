"use client";
import type { SidebarMembersQuery as SidebarMembersQueryType } from "@/__generated__/SidebarMembersQuery.graphql";
import MembersSidebar, { SidebarMembersQuery } from "@/components/organization-detail/members-tab/Sidebar";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function MembersSidebarClientComponent() {
    const params = useParams<{ slug: string }>();
    const environment = useRelayEnvironment();
    const slug = decodeURIComponent(params.slug);

    const queryReference = loadQuery<SidebarMembersQueryType>(
        environment,
        SidebarMembersQuery,
        {
            slug: slug,
        },
        { fetchPolicy: "store-or-network" },
    );

    return (
        <Suspense>
            <MembersSidebar queryReference={queryReference} />
        </Suspense>
    );
}

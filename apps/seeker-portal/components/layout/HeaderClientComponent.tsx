"use client";

import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import Header, { HeaderQuery } from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function HeaderClientComponent({variant} : {variant: "default" | "hero"}) {
    const environment = useRelayEnvironment();
    const queryReference = loadQuery<HeaderQueryType>(
        environment,
        HeaderQuery,
        {},
        { fetchPolicy: "store-or-network" },
    );
    return (
            <Suspense fallback={<HeaderSkeleton variant={variant} />}>
                <Header variant={variant} queryReference={queryReference} />
            </Suspense>
    );
}

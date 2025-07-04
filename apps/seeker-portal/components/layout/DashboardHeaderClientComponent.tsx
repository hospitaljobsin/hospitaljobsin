"use client";

import type { DashboardHeaderQuery as DashboardHeaderQueryType } from "@/__generated__/DashboardHeaderQuery.graphql";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import DashboardHeader, { DashboardHeaderQuery } from "./DashboardHeader";
import DashboardHeaderSkeleton from "./DashboardHeaderSkeleton";

export default function DashboardHeaderClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<DashboardHeaderQueryType>(
		environment,
		DashboardHeaderQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);
	return (
		<Suspense fallback={<DashboardHeaderSkeleton />}>
			<DashboardHeader queryReference={queryReference} />
		</Suspense>
	);
}

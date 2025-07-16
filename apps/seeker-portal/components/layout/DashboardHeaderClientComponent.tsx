"use client";

import type { DashboardHeaderClientComponentQuery as DashboardHeaderClientComponentQueryType } from "@/__generated__/DashboardHeaderClientComponentQuery.graphql";
import { Suspense } from "react";
import {
	type PreloadedQuery,
	graphql,
	loadQuery,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import DashboardHeader from "./DashboardHeader";
import DashboardHeaderSkeleton from "./DashboardHeaderSkeleton";

const DashboardHeaderClientComponentQuery = graphql`
  query DashboardHeaderClientComponentQuery {
    ...DashboardHeaderFragment
  }
`;

export default function DashboardHeaderClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<DashboardHeaderClientComponentQueryType>(
		environment,
		DashboardHeaderClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);
	return (
		<Suspense fallback={<DashboardHeaderSkeleton />}>
			<PreloadedDashboardHeader queryReference={queryReference} />
		</Suspense>
	);
}

function PreloadedDashboardHeader({
	queryReference,
}: {
	queryReference: PreloadedQuery<DashboardHeaderClientComponentQueryType>;
}) {
	const data = usePreloadedQuery(
		DashboardHeaderClientComponentQuery,
		queryReference,
	);
	return <DashboardHeader query={data} animate={false} />;
}

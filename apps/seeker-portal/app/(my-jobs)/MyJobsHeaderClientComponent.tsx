"use client";

import type { MyJobsHeaderQuery as MyJobsHeaderQueryType } from "@/__generated__/MyJobsHeaderQuery.graphql";
import MyJobsHeader, {
	MyJobsHeaderQuery,
} from "@/components/layout/MyJobsHeader";
import MyJobsHeaderSkeleton from "@/components/layout/MyJobsHeaderSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function MyJobsHeaderClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<MyJobsHeaderQueryType>(
		environment,
		MyJobsHeaderQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);
	return (
		<Suspense fallback={<MyJobsHeaderSkeleton />}>
			<MyJobsHeader queryReference={queryReference} />
		</Suspense>
	);
}

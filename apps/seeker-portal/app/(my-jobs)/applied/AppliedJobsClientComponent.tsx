"use client";
import type { AppliedJobsClientComponentQuery as AppliedJobsClientComponentQueryType } from "@/__generated__/AppliedJobsClientComponentQuery.graphql";
import AppliedJobsView from "@/components/my-jobs/applied/AppliedJobsView";
import AppliedJobsViewSkeleton from "@/components/my-jobs/applied/AppliedJobsViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const AppliedJobsClientComponentQuery = graphql`
	query AppliedJobsClientComponentQuery {
		...AppliedJobsViewFragment
	}
`;

export default function AppliedJobsClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<AppliedJobsClientComponentQueryType>(
		environment,
		AppliedJobsClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);
	return (
		<Suspense fallback={<AppliedJobsViewSkeleton />}>
			<AppliedJobsView queryReference={queryReference} />
		</Suspense>
	);
}

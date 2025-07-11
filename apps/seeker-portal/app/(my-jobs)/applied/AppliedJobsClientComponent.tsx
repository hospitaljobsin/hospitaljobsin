"use client";
import type { AppliedJobsClientComponentQuery as AppliedJobsClientComponentQueryType } from "@/__generated__/AppliedJobsClientComponentQuery.graphql";
import AppliedJobsView from "@/components/my-jobs/applied/AppliedJobsView";
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
	return <AppliedJobsView queryReference={queryReference} />;
}

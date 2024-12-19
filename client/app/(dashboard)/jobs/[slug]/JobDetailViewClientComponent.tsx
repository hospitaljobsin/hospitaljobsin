"use client";

import JobDetailView from "@/components/job-detail/JobDetailView";
import type { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import { useRelayEnvironment } from "react-relay";

import type JobDetailViewQueryNode from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import type { JobDetailViewQuery } from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";

export default function JobDetailViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof JobDetailViewQueryNode,
		JobDetailViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery(
		environment,
		props.preloadedQuery,
	);

	return <JobDetailView queryRef={queryRef} />;
}

"use client";

import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

import JobDetailView from "@/components/job-detail/JobDetailView";
import type { JobDetailViewClientComponentFragment$key } from "./__generated__/JobDetailViewClientComponentFragment.graphql";
import type JobDetailViewQueryNode from "./__generated__/pageJobDetailViewQuery.graphql";
import type { pageJobDetailViewQuery } from "./__generated__/pageJobDetailViewQuery.graphql";
import PageJobDetailViewQuery from "./__generated__/pageJobDetailViewQuery.graphql";

const JobDetailViewClientComponentFragment = graphql`
 fragment JobDetailViewClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
		...JobDetailViewFragment @arguments(slug: $slug)
  }
`;

export default function JobDetailViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof JobDetailViewQueryNode,
		pageJobDetailViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof JobDetailViewQueryNode,
		pageJobDetailViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageJobDetailViewQuery, queryRef);

	const rootQuery = useFragment<JobDetailViewClientComponentFragment$key>(
		JobDetailViewClientComponentFragment,
		data,
	);

	return <JobDetailView rootQuery={rootQuery} />;
}

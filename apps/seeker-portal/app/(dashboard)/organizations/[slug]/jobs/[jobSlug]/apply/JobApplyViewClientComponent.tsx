"use client";

import type { JobApplyViewClientComponentFragment$key } from "@/__generated__/JobApplyViewClientComponentFragment.graphql";
import type JobApplyViewQueryNode from "@/__generated__/pageJobApplyViewQuery.graphql";
import type { pageJobApplyViewQuery } from "@/__generated__/pageJobApplyViewQuery.graphql";
import PageJobApplyViewQuery from "@/__generated__/pageJobApplyViewQuery.graphql";
import JobApplyView from "@/components/job-apply/JobApplyView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const JobApplyViewClientComponentFragment = graphql`
 fragment JobApplyViewClientComponentFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
        ...JobApplyViewFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function JobApplyViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof JobApplyViewQueryNode,
		pageJobApplyViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof JobApplyViewQueryNode,
		pageJobApplyViewQuery
	>(environment, props.preloadedQuery, "store-or-network");

	const data = usePreloadedQuery(PageJobApplyViewQuery, queryRef);

	const rootQuery = useFragment<JobApplyViewClientComponentFragment$key>(
		JobApplyViewClientComponentFragment,
		data,
	);

	return <JobApplyView rootQuery={rootQuery} />;
}

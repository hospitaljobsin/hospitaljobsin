"use client";

import type { JobDetailViewClientComponentFragment$key } from "@/__generated__/JobDetailViewClientComponentFragment.graphql";
import type JobDetailViewQueryNode from "@/__generated__/pageJobDetailViewQuery.graphql";
import type { pageJobDetailViewQuery } from "@/__generated__/pageJobDetailViewQuery.graphql";
import PageJobDetailViewQuery from "@/__generated__/pageJobDetailViewQuery.graphql";
import JobOverviewTab from "@/components/job-detail/overview-tab/JobOverviewTab";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const JobDetailViewClientComponentFragment = graphql`
 fragment JobDetailViewClientComponentFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: {type: "String!"}
    ) {
        ...JobOverviewTabFragment @arguments(slug: $slug, jobSlug: $jobSlug)
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

	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<JobOverviewTab rootQuery={rootQuery} />
		</div>
	);
}

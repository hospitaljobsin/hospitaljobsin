"use client";

import type { JobEditViewClientComponentFragment$key } from "@/__generated__/JobEditViewClientComponentFragment.graphql";
import type JobEditViewQueryNode from "@/__generated__/pageJobEditViewQuery.graphql";
import type { pageJobEditViewQuery } from "@/__generated__/pageJobEditViewQuery.graphql";
import PageJobDetailViewQuery from "@/__generated__/pageJobEditViewQuery.graphql";
import JobEditTab from "@/components/job-detail/edit-tab/JobEditTab";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const JobEditViewClientComponentFragment = graphql`
 fragment JobEditViewClientComponentFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...JobEditTabFragment @arguments(slug: $slug)
  }
`;

export default function JobEditViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof JobEditViewQueryNode,
		pageJobEditViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof JobEditViewQueryNode,
		pageJobEditViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageJobDetailViewQuery, queryRef);

	const rootQuery = useFragment<JobEditViewClientComponentFragment$key>(
		JobEditViewClientComponentFragment,
		data,
	);

	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<JobEditTab rootQuery={rootQuery} />
		</div>
	);
}

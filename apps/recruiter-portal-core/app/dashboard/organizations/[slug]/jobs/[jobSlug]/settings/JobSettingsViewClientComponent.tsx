"use client";

import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import type { JobSettingsViewClientComponentFragment$key } from "@/__generated__/JobSettingsViewClientComponentFragment.graphql";
import type JobSettingsViewQueryNode from "@/__generated__/pageJobSettingsViewQuery.graphql";
import type { pageJobSettingsViewQuery } from "@/__generated__/pageJobSettingsViewQuery.graphql";
import PageJobDetailViewQuery from "@/__generated__/pageJobSettingsViewQuery.graphql";
import JobSettingsGeneralTab from "@/components/job-detail/settings-tab/general-tab/JobSettingsGeneralTab";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";

const JobSettingsViewClientComponentFragment = graphql`
 fragment JobSettingsViewClientComponentFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: {type: "String!"}
    ) {
        ...JobSettingsGeneralTabFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function JobSettingsViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof JobSettingsViewQueryNode,
		pageJobSettingsViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof JobSettingsViewQueryNode,
		pageJobSettingsViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageJobDetailViewQuery, queryRef);

	const rootQuery = useFragment<JobSettingsViewClientComponentFragment$key>(
		JobSettingsViewClientComponentFragment,
		data,
	);

	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<JobSettingsGeneralTab rootQuery={rootQuery} />
		</div>
	);
}

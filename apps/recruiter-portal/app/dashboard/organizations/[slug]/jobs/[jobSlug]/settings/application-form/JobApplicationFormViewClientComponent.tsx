"use client";

import type { JobApplicationFormViewClientComponentFragment$key } from "@/__generated__/JobApplicationFormViewClientComponentFragment.graphql";
import type JobApplicationFormViewQueryNode from "@/__generated__/pageJobApplicationFormViewQuery.graphql";
import type { pageJobApplicationFormViewQuery } from "@/__generated__/pageJobApplicationFormViewQuery.graphql";
import PageJobDetailViewQuery from "@/__generated__/pageJobApplicationFormViewQuery.graphql";
import ApplicationFormTab from "@/components/job-detail/settings-tab/application-form-tab/ApplicationFormTab";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const JobApplicationFormViewClientComponentFragment = graphql`
 fragment JobApplicationFormViewClientComponentFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...ApplicationFormTabFragment @arguments(slug: $slug)
  }
`;

export default function JobApplicationFormViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof JobApplicationFormViewQueryNode,
		pageJobApplicationFormViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof JobApplicationFormViewQueryNode,
		pageJobApplicationFormViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageJobDetailViewQuery, queryRef);

	const rootQuery =
		useFragment<JobApplicationFormViewClientComponentFragment$key>(
			JobApplicationFormViewClientComponentFragment,
			data,
		);

	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<ApplicationFormTab rootQuery={rootQuery} />
		</div>
	);
}

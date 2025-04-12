"use client";

import type { JobApplicantsViewClientComponentFragment$key } from "@/__generated__/JobApplicantsViewClientComponentFragment.graphql";
import type JobApplicantsViewQueryNode from "@/__generated__/pageJobApplicantsViewQuery.graphql";
import type { pageJobApplicantsViewQuery } from "@/__generated__/pageJobApplicantsViewQuery.graphql";
import PageJobApplicantsViewQuery from "@/__generated__/pageJobApplicantsViewQuery.graphql";
import ApplicantsTab from "@/components/job-detail/applicants-tab/ApplicantsTab";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const JobApplicantsViewClientComponentFragment = graphql`
 fragment JobApplicantsViewClientComponentFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...ApplicantsTabFragment @arguments(slug: $slug)
  }
`;

export default function JobApplicantsViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof JobApplicantsViewQueryNode,
		pageJobApplicantsViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof JobApplicantsViewQueryNode,
		pageJobApplicantsViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageJobApplicantsViewQuery, queryRef);

	const rootQuery = useFragment<JobApplicantsViewClientComponentFragment$key>(
		JobApplicantsViewClientComponentFragment,
		data,
	);

	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<ApplicantsTab rootQuery={rootQuery} />
		</div>
	);
}

"use client";

import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import type { ApplicantDetailViewClientComponentFragment$key } from "@/__generated__/ApplicantDetailViewClientComponentFragment.graphql";
import type ApplicantDetailViewQueryNode from "@/__generated__/pageApplicantDetailViewQuery.graphql";
import type { pageApplicantDetailViewQuery } from "@/__generated__/pageApplicantDetailViewQuery.graphql";
import PageApplicantDetailViewQuery from "@/__generated__/pageApplicantDetailViewQuery.graphql";
import ApplicantDetailView from "@/components/job-detail/applicants-tab/applicant-detail/ApplicantDetailView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";

const ApplicantDetailViewClientComponentFragment = graphql`
 fragment ApplicantDetailViewClientComponentFragment on Query @argumentDefinitions(
    slug: { type: "String!"}
	applicantSlug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
        ...ApplicantDetailViewFragment @arguments(slug: $slug, jobSlug: $jobSlug, applicantSlug: $applicantSlug)
  }
`;

export default function ApplicantDetailViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof ApplicantDetailViewQueryNode,
		pageApplicantDetailViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof ApplicantDetailViewQueryNode,
		pageApplicantDetailViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageApplicantDetailViewQuery, queryRef);

	const rootQuery = useFragment<ApplicantDetailViewClientComponentFragment$key>(
		ApplicantDetailViewClientComponentFragment,
		data,
	);

	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<ApplicantDetailView rootQuery={rootQuery} />
		</div>
	);
}

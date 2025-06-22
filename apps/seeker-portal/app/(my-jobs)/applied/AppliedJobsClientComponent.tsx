"use client";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import type { AppliedJobsClientComponentFragment$key } from "@/__generated__/AppliedJobsClientComponentFragment.graphql";
import type { pageAppliedJobsQuery } from "@/__generated__/pageAppliedJobsQuery.graphql";
import AppliedJobsView from "@/components/my-jobs/applied/AppliedJobsView";
import { AppliedJobsPageQuery } from "./page";

const AppliedJobsClientComponentFragment = graphql`
  fragment AppliedJobsClientComponentFragment on Query{
    ...AppliedJobsViewFragment
  }
`;

export default function AppliedJobsClientComponent({
	queryReference,
}: {
	queryReference: PreloadedQuery<pageAppliedJobsQuery>;
}) {
	const data = usePreloadedQuery(AppliedJobsPageQuery, queryReference);
	const query = useFragment<AppliedJobsClientComponentFragment$key>(
		AppliedJobsClientComponentFragment,
		data,
	);
	return <AppliedJobsView query={query} />;
}

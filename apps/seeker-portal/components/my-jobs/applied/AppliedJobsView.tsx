"use client";
import AppliedJobsClientComponentQuery, {
	type AppliedJobsClientComponentQuery as AppliedJobsClientComponentQueryType,
} from "@/__generated__/AppliedJobsClientComponentQuery.graphql";
import type { AppliedJobsViewFragment$key } from "@/__generated__/AppliedJobsViewFragment.graphql";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import AppliedJobsList from "./AppliedJobsList";

const AppliedJobsViewFragment = graphql`
  fragment AppliedJobsViewFragment on Query {
    ...AppliedJobsListFragment
  }
`;

export default function AppliedView({
	queryReference,
}: {
	queryReference: PreloadedQuery<AppliedJobsClientComponentQueryType>;
}) {
	const query = usePreloadedQuery(
		AppliedJobsClientComponentQuery,
		queryReference,
	);
	const data = useFragment<AppliedJobsViewFragment$key>(
		AppliedJobsViewFragment,
		query,
	);

	return (
		<div className="w-full flex flex-col h-full py-8">
			<AppliedJobsList rootQuery={data} />
		</div>
	);
}

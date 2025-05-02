"use client";
import type { AppliedJobsViewFragment$key } from "@/__generated__/AppliedJobsViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import AppliedJobsList from "./AppliedJobsList";

const AppliedJobsViewFragment = graphql`
  fragment AppliedJobsViewFragment on Query {
    ...AppliedJobsListFragment
  }
`;

export default function AppliedView({
	query,
}: { query: AppliedJobsViewFragment$key }) {
	const data = useFragment(AppliedJobsViewFragment, query);

	return (
		<>
			<AppliedJobsList rootQuery={data} />
		</>
	);
}

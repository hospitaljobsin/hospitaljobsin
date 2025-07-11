"use client";
import SavedJobsClientComponentQuery, {
	type SavedJobsClientComponentQuery as SavedJobsClientComponentQueryType,
} from "@/__generated__/SavedJobsClientComponentQuery.graphql";
import type { SavedJobsViewFragment$key } from "@/__generated__/SavedJobsViewFragment.graphql";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import SavedJobsList from "./SavedJobsList";

const SavedJobsViewFragment = graphql`
  fragment SavedJobsViewFragment on Query {
    ...SavedJobsListFragment
  }
`;

export default function SavedView({
	queryReference,
}: {
	queryReference: PreloadedQuery<SavedJobsClientComponentQueryType>;
}) {
	const query = usePreloadedQuery(
		SavedJobsClientComponentQuery,
		queryReference,
	);
	const data = useFragment<SavedJobsViewFragment$key>(
		SavedJobsViewFragment,
		query,
	);

	return (
		<div className="w-full flex flex-col h-full py-8">
			<SavedJobsList rootQuery={data} />
		</div>
	);
}

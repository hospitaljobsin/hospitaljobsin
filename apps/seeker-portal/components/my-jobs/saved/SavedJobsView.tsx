"use client";
import { graphql, useFragment } from "react-relay";
import type { SavedJobsViewFragment$key } from "@/__generated__/SavedJobsViewFragment.graphql";
import SavedJobsList from "./SavedJobsList";

const SavedJobsViewFragment = graphql`
  fragment SavedJobsViewFragment on Query {
    ...SavedJobsListFragment
  }
`;

export default function SavedView({
	query,
}: {
	query: SavedJobsViewFragment$key;
}) {
	const data = useFragment(SavedJobsViewFragment, query);

	return (
		<>
			<SavedJobsList rootQuery={data} />
		</>
	);
}

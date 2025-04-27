"use client";
import type { SavedViewQuery as SavedViewQueryType } from "@/__generated__/SavedViewQuery.graphql";
import { graphql, useLazyLoadQuery } from "react-relay";
import SavedJobsList from "./SavedJobsList";

const SavedViewQuery = graphql`
  query SavedViewQuery {
    ...SavedJobsListFragment
  }
`;

export default function SavedView() {
	const data = useLazyLoadQuery<SavedViewQueryType>(
		SavedViewQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<>
			<SavedJobsList rootQuery={data} />
		</>
	);
}

"use client";
import { graphql, useLazyLoadQuery } from "react-relay";
import SavedJobsList from "./SavedJobsList";
import { SavedViewQuery as SavedViewQueryType } from "./__generated__/SavedViewQuery.graphql";

const SavedViewQuery = graphql`
  query SavedViewQuery {
    ...SavedJobsListFragment
  }
`;

export default function SavedView() {
	const data = useLazyLoadQuery<SavedViewQueryType>(SavedViewQuery, {});

	return (
		<>
			<SavedJobsList rootQuery={data} />
		</>
	);
}

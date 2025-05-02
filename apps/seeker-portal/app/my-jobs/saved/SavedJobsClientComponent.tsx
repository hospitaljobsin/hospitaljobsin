"use client";
import type { SavedJobsClientComponentFragment$key } from "@/__generated__/SavedJobsClientComponentFragment.graphql";
import type { pageSavedJobsQuery } from "@/__generated__/pageSavedJobsQuery.graphql";
import SavedJobsView from "@/components/my-jobs/saved/SavedJobsView";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { SavedJobsPageQuery } from "./page";

const SavedJobsClientComponentFragment = graphql`
  fragment SavedJobsClientComponentFragment on Query{
    ...SavedJobsViewFragment
  }
`;

export default function SavedJobsClientComponent({
	queryReference,
}: { queryReference: PreloadedQuery<pageSavedJobsQuery> }) {
	const data = usePreloadedQuery(SavedJobsPageQuery, queryReference);
	const query = useFragment<SavedJobsClientComponentFragment$key>(
		SavedJobsClientComponentFragment,
		data,
	);
	return <SavedJobsView query={query} />;
}

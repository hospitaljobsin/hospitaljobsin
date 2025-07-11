"use client";
import type { SavedJobsClientComponentQuery as SavedJobsClientComponentQueryType } from "@/__generated__/SavedJobsClientComponentQuery.graphql";
import SavedJobsView from "@/components/my-jobs/saved/SavedJobsView";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const SavedJobsClientComponentQuery = graphql`
  query SavedJobsClientComponentQuery {
    ...SavedJobsViewFragment
  }
`;

export default function SavedJobsClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<SavedJobsClientComponentQueryType>(
		environment,
		SavedJobsClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);
	return <SavedJobsView queryReference={queryReference} />;
}

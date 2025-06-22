"use client";

import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import type { pageSavedJobsQuery } from "@/__generated__/pageSavedJobsQuery.graphql";
import SavedJobsClientComponent from "./SavedJobsClientComponent";

export const SavedJobsPageQuery = graphql`
	query pageSavedJobsQuery {
		...SavedJobsClientComponentFragment
	}
`;

export default function SavedJobsPage() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pageSavedJobsQuery>(
		environment,
		SavedJobsPageQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<Suspense>
				<SavedJobsClientComponent queryReference={queryReference} />
			</Suspense>
		</div>
	);
}

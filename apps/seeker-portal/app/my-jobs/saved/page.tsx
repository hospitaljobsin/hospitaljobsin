"use client";

import type { pageSavedJobsQuery } from "@/__generated__/pageSavedJobsQuery.graphql";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import SavedJobsClientComponent from "./SavedJobsClientComponent";

export const SavedJobsPageQuery = graphql`
	query pageSavedJobsQuery {
		...SavedJobsClientComponentFragment
	}
`;

export default function SavedJobsPage() {
	const queryReference = loadQuery<pageSavedJobsQuery>(
		getCurrentEnvironment(),
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

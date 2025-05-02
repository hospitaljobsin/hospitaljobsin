"use client";

import type { pageAppliedJobsQuery } from "@/__generated__/pageAppliedJobsQuery.graphql";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import AppliedJobsClientComponent from "./AppliedJobsClientComponent";

export const AppliedJobsPageQuery = graphql`
	query pageAppliedJobsQuery {
		...AppliedJobsClientComponentFragment
	}
`;

export default function AppliedJobsPage() {
	const queryReference = loadQuery<pageAppliedJobsQuery>(
		getCurrentEnvironment(),
		AppliedJobsPageQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);
	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<Suspense>
				<AppliedJobsClientComponent queryReference={queryReference} />
			</Suspense>
		</div>
	);
}

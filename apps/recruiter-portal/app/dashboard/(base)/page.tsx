"use client";
import type { pageDashboardQuery } from "@/__generated__/pageDashboardQuery.graphql";
import DashboardViewSkeleton from "@/components/dashboard/DashboardViewSkeleton";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import DashboardClientComponent from "./DashboardClientComponent";

export const DashboardPageQuery = graphql`
	query pageDashboardQuery {
		...DashboardClientComponentFragment
	}
`;

export default function DashboardPage() {
	const queryReference = loadQuery<pageDashboardQuery>(
		getCurrentEnvironment(),
		DashboardPageQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<Suspense fallback={<DashboardViewSkeleton />}>
			<DashboardClientComponent queryReference={queryReference} />
		</Suspense>
	);
}

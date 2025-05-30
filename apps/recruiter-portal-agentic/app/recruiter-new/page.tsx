"use client";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import type { pageDashboardQuery } from "@/__generated__/pageDashboardQuery.graphql";
import DashboardViewSkeleton from "@/components/dashboard/DashboardViewSkeleton";
import DashboardClientComponent from "./DashboardClientComponent";

export const DashboardPageQuery = graphql`
	query pageDashboardQuery {
		...DashboardClientComponentFragment
	}
`;

export default function DashboardPage() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pageDashboardQuery>(
		environment,
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

"use client";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import type { DashboardClientComponentFragment$key } from "@/__generated__/DashboardClientComponentFragment.graphql";
import type { pageDashboardQuery } from "@/__generated__/pageDashboardQuery.graphql";
import DashboardView from "@/components/dashboard/DashboardView";
import { DashboardPageQuery } from "./page";

const DashboardClientComponentFragment = graphql`
  fragment DashboardClientComponentFragment on Query {
    ...DashboardViewFragment
  }
`;

export default function DashboardClientComponent({
	queryReference,
}: {
	queryReference: PreloadedQuery<pageDashboardQuery>;
}) {
	const data = usePreloadedQuery(DashboardPageQuery, queryReference);
	const query = useFragment<DashboardClientComponentFragment$key>(
		DashboardClientComponentFragment,
		data,
	);
	return <DashboardView query={query} />;
}

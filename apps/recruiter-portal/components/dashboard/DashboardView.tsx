"use client";
import { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay/hooks";
import { graphql } from "relay-runtime";
import OrganizationList from "./OrganizationList";
import OrganizationListSkeleton from "./OrganizationListSkeleton";
import type { DashboardViewQuery as DashboardViewQueryType } from "./__generated__/DashboardViewQuery.graphql";

const DashboardViewQuery = graphql`
	query DashboardViewQuery {
		...OrganizationListFragment
	}`;

export default function DashboardView() {
	const root = useLazyLoadQuery<DashboardViewQueryType>(DashboardViewQuery, {});

	return (
		<div className="w-full h-full flex flex-col py-6 gap-6">
			<Suspense fallback={<OrganizationListSkeleton />}>
				<OrganizationList rootQuery={root} />
			</Suspense>
		</div>
	);
}

"use client";
import type { DashboardViewQuery as DashboardViewQueryType } from "@/__generated__/DashboardViewQuery.graphql";
import { useLazyLoadQuery } from "react-relay/hooks";
import { graphql } from "relay-runtime";
import OrganizationList from "./OrganizationList";

const DashboardViewQuery = graphql`
	query DashboardViewQuery {
		...OrganizationListFragment
	}`;

export default function DashboardView() {
	const root = useLazyLoadQuery<DashboardViewQueryType>(
		DashboardViewQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<div className="w-full h-full flex flex-col py-6 gap-6">
			<OrganizationList rootQuery={root} />
		</div>
	);
}

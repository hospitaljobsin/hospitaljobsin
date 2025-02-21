"use client";
import { useLazyLoadQuery } from "react-relay/hooks";
import { graphql } from "relay-runtime";
import OrganizationList from "./OrganizationList";
import type { DashboardViewQuery as DashboardViewQueryType } from "./__generated__/DashboardViewQuery.graphql";

const DashboardViewQuery = graphql`
	query DashboardViewQuery {
		...OrganizationListFragment
	}`;

export default function DashboardView() {
	const root = useLazyLoadQuery<DashboardViewQueryType>(DashboardViewQuery, {});

	return (
		<div className="w-full h-full flex flex-col py-6 gap-6">
			<OrganizationList rootQuery={root} />
		</div>
	);
}

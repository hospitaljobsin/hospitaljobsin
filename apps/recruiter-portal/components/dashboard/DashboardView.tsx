"use client";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { DashboardViewFragment$key } from "@/__generated__/DashboardViewFragment.graphql";
import OrganizationList from "./OrganizationList";

const DashboardViewFragment = graphql`
	fragment DashboardViewFragment on Query {
		...OrganizationListFragment
	}`;

export default function DashboardView({
	query,
}: {
	query: DashboardViewFragment$key;
}) {
	const root = useFragment(DashboardViewFragment, query);

	return (
		<div className="w-full h-full flex flex-col py-6 gap-6">
			<OrganizationList rootQuery={root} />
		</div>
	);
}

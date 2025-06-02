"use client";
import type { SelectViewFragment$key } from "@/__generated__/SelectViewFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import OrganizationList from "./OrganizationList";

const SelectViewFragment = graphql`
	fragment SelectViewFragment on Query {
		...OrganizationListFragment
	}`;

export default function SelectView({
	query,
}: {
	query: SelectViewFragment$key;
}) {
	const root = useFragment(SelectViewFragment, query);

	return (
		<div className="w-full h-full flex flex-col py-6 gap-6">
			<OrganizationList rootQuery={root} />
		</div>
	);
}

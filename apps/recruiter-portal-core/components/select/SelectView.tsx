"use client";
import type { SelectClientComponentQuery as SelectClientComponentQueryType } from "@/__generated__/SelectClientComponentQuery.graphql";
import SelectClientComponentQuery from "@/__generated__/SelectClientComponentQuery.graphql";
import type { SelectViewFragment$key } from "@/__generated__/SelectViewFragment.graphql";
import {
	type PreloadedQuery,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import { graphql } from "relay-runtime";
import OrganizationList from "./OrganizationList";

const SelectViewFragment = graphql`
	fragment SelectViewFragment on Query {
		...OrganizationListFragment
	}`;

export default function SelectView({
	queryReference,
}: {
	queryReference: PreloadedQuery<SelectClientComponentQueryType>;
}) {
	const data = usePreloadedQuery(SelectClientComponentQuery, queryReference);
	const root = useFragment<SelectViewFragment$key>(SelectViewFragment, data);

	return (
		<div className="w-full h-full flex flex-col py-6 gap-6">
			<OrganizationList rootQuery={root} />
		</div>
	);
}

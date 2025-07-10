"use client";
import type { SelectClientComponentQuery as SelectClientComponentQueryType } from "@/__generated__/SelectClientComponentQuery.graphql";
import SelectView from "@/components/select/SelectView";
import SelectViewSkeleton from "@/components/select/SelectViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const SelectClientComponentQuery = graphql`
	query SelectClientComponentQuery {
		...SelectViewFragment
	}
`;

export default function SelectClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<SelectClientComponentQueryType>(
		environment,
		SelectClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<SelectViewSkeleton />}>
			<SelectView queryReference={queryReference} />
		</Suspense>
	);
}

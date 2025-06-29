"use client";
import type { pageSelectQuery } from "@/__generated__/pageSelectQuery.graphql";
import SelectViewSkeleton from "@/components/select/SelectViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import SelectClientComponent from "./SelectClientComponent";

export const SelectPageQuery = graphql`
	query pageSelectQuery {
		...SelectClientComponentFragment
	}
`;

export default function SelectPage() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pageSelectQuery>(
		environment,
		SelectPageQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<SelectViewSkeleton />}>
			<SelectClientComponent queryReference={queryReference} />
		</Suspense>
	);
}

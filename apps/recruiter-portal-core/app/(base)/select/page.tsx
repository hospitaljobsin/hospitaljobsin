"use client";
import type { pageSelectQuery } from "@/__generated__/pageSelectQuery.graphql";
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

	return <SelectClientComponent queryReference={queryReference} />;
}

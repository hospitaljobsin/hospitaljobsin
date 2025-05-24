"use client";

import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import type { MyJobsHeaderQuery as MyJobsHeaderQueryType } from "@/__generated__/MyJobsHeaderQuery.graphql";
import MyJobsHeader, {
	MyJobsHeaderQuery,
} from "@/components/layout/MyJobsHeader";

export default function MyJobsHeaderClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<MyJobsHeaderQueryType>(
		environment,
		MyJobsHeaderQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);
	return (
		<Suspense>
			<MyJobsHeader queryReference={queryReference} />
		</Suspense>
	);
}

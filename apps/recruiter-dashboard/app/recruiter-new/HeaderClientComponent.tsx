"use client";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import Header, { HeaderQuery } from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function HeaderClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<HeaderQueryType>(
		environment,
		HeaderQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<Suspense fallback={<HeaderSkeleton />}>
			<Header queryReference={queryReference} />
		</Suspense>
	);
}

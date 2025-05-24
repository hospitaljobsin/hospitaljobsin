"use client";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import Header, { HeaderQuery } from "@/components/settings/Header";
import HeaderSkeleton from "@/components/settings/HeaderSkeleton";

export default function HeaderClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<HeaderQueryType>(
		environment,
		HeaderQuery,
		{},
	);
	return (
		<Suspense fallback={<HeaderSkeleton />}>
			<Header queryReference={queryReference} />
		</Suspense>
	);
}

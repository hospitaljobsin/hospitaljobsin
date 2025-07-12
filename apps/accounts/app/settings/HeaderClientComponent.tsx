"use client";
import HeaderQuery, {
	type HeaderQuery as HeaderQueryType,
} from "@/__generated__/HeaderQuery.graphql";
import Header from "@/components/settings/Header";
import HeaderSkeleton from "@/components/settings/HeaderSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function HeaderClientComponent() {
	const environment = useRelayEnvironment();

	const queryReference = loadQuery<HeaderQueryType>(
		environment,
		HeaderQuery,
		{
			// You can pass any variables needed for the query here
		},
		{
			fetchPolicy: "store-or-network",
			networkCacheConfig: { force: false },
		},
	);

	return (
		<Suspense fallback={<HeaderSkeleton />}>
			<Header queryReference={queryReference} />
		</Suspense>
	);
}

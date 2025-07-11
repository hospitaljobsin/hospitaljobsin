"use client";
import Header, { HeaderQuery } from "@/components/settings/Header";
import HeaderSkeleton from "@/components/settings/HeaderSkeleton";
import { Suspense, useEffect } from "react";
import { useQueryLoader } from "react-relay";

export default function HeaderClientComponent() {
	console.log("rendering header server side...");
	// const environment = useRelayEnvironment();

	// // TODO: fix pre-rendering this

	// const queryReference = loadQuery<HeaderQueryType>(
	// 	environment,
	// 	HeaderQuery,
	// 	{
	// 		// You can pass any variables needed for the query here
	// 	},
	// 	{
	// 		fetchPolicy: "store-or-network",
	// 		networkCacheConfig: { force: false },
	// 	},
	// );

	const [queryReference, loadQuery] = useQueryLoader(HeaderQuery);

	useEffect(() => {
		loadQuery({}, { fetchPolicy: "store-or-network" });
	}, [loadQuery]);

	if (!queryReference) return <HeaderSkeleton />;

	return (
		<Suspense fallback={<HeaderSkeleton />}>
			<Header queryReference={queryReference} />
		</Suspense>
	);
}

"use client";

import type { MyJobsHeaderQuery as MyJobsHeaderQueryType } from "@/__generated__/MyJobsHeaderQuery.graphql";
import MyJobsHeader, {
	MyJobsHeaderQuery,
} from "@/components/layout/MyJobsHeader";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function MyJobsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<MyJobsHeaderQueryType>(
		environment,
		MyJobsHeaderQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);
	return (
		<div className="w-full h-full flex flex-col">
			<Suspense>
				<MyJobsHeader queryReference={queryReference} />
			</Suspense>
			<div className="w-full mx-auto bg-background-600 h-full">
				<div className="w-full px-5 max-w-5xl mx-auto h-full">{children}</div>
			</div>
		</div>
	);
}

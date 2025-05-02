"use client";

import type { MyJobsHeaderQuery as MyJobsHeaderQueryType } from "@/__generated__/MyJobsHeaderQuery.graphql";
import MyJobsHeader, {
	MyJobsHeaderQuery,
} from "@/components/layout/MyJobsHeader";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";

export default function MyJobsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryReference = loadQuery<MyJobsHeaderQueryType>(
		getCurrentEnvironment(),
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

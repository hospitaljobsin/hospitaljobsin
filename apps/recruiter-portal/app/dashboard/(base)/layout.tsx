"use client";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import Header, { HeaderQuery } from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryReference = loadQuery<HeaderQueryType>(
		getCurrentEnvironment(),
		HeaderQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<>
			<Suspense fallback={<HeaderSkeleton />}>
				<Header queryReference={queryReference} />
			</Suspense>
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-5xl mx-auto">{children}</div>
			</div>
		</>
	);
}

"use client";

import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import Header, { HeaderQuery } from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";

export default function LandingLayout({
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
		<div className="w-full h-full flex flex-col">
			<Suspense fallback={<HeaderSkeleton variant="hero" />}>
				<Header variant="hero" queryReference={queryReference} />
			</Suspense>
			<div className="w-full mx-auto bg-background-600 h-full">{children}</div>
		</div>
	);
}

"use client";

import type { notFoundQuery as NotFoundQueryType } from "@/__generated__/notFoundQuery.graphql";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardHeaderSkeleton from "@/components/layout/DashboardHeaderSkeleton";
import links from "@/lib/links";
import { Button } from "@heroui/react";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { loadQuery, usePreloadedQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const notFoundQuery = graphql`
	query notFoundQuery {
		...DashboardHeaderFragment
	}
`;

export default function NotFoundPage() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<NotFoundQueryType>(
		environment,
		notFoundQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	const data = usePreloadedQuery(notFoundQuery, queryReference);

	return (
		<>
			<Suspense fallback={<DashboardHeaderSkeleton />}>
				<DashboardHeader query={data} animate={false} />
			</Suspense>
			<div className="flex flex-col items-center justify-center w-full h-full py-32 px-4 text-center gap-6">
				<div className="flex items-center justify-center w-20 h-20 rounded-full bg-danger-50 dark:bg-danger-900/20 mb-2">
					<SearchX className="w-10 h-10 text-danger-500 dark:text-danger-400" />
				</div>
				<h1 className="text-2xl font-medium text-foreground-900">
					404 Page Not Found
				</h1>
				<p className="text-foreground-600 max-w-md mx-auto">
					Sorry, we couldn't find the page you're looking for. It may have been
					removed or you may not be authorized.
				</p>
				<Link href={links.landing} passHref>
					<Button variant="solid" className="mt-4">
						Back to Home
					</Button>
				</Link>
			</div>
		</>
	);
}

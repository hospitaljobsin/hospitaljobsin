"use client";
import type { JobDetailHeaderQuery as JobDetailHeaderQueryType } from "@/__generated__/JobDetailHeaderQuery.graphql";
import JobDetailHeader, {
	JobDetailHeaderQuery,
} from "@/components/layout/JobDetailHeader";
import { useParams } from "next/navigation";
import { loadQuery, useRelayEnvironment } from "react-relay";

export default function JobRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const environment = useRelayEnvironment();
	const slug = decodeURIComponent(params.slug);
	const jobSlug = decodeURIComponent(params.jobSlug);
	const queryReference = loadQuery<JobDetailHeaderQueryType>(
		environment,
		JobDetailHeaderQuery,
		{
			slug: slug,
			jobSlug: jobSlug,
		},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<>
			<JobDetailHeader queryReference={queryReference} />
			<div className="w-full mx-auto bg-background-600">{children}</div>
		</>
	);
}

"use client";
import type { JobDetailHeaderQuery as JobDetailHeaderQueryType } from "@/__generated__/JobDetailHeaderQuery.graphql";
import JobDetailHeader, {
	JobDetailHeaderQuery,
} from "@/components/layout/JobDetailHeader";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { useParams } from "next/navigation";
import { loadQuery } from "react-relay";

export default function JobRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const slug = decodeURIComponent(params.slug);
	const jobSlug = decodeURIComponent(params.jobSlug);
	const queryReference = loadQuery<JobDetailHeaderQueryType>(
		getCurrentEnvironment(),
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

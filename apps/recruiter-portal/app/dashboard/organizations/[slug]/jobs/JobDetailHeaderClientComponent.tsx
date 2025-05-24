"use client";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import type { JobDetailHeaderQuery as JobDetailHeaderQueryType } from "@/__generated__/JobDetailHeaderQuery.graphql";
import JobDetailHeader, {
	JobDetailHeaderQuery,
} from "@/components/layout/JobDetailHeader";

export default function JobDetailHeaderClientComponent() {
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
		<Suspense>
			<JobDetailHeader queryReference={queryReference} />
		</Suspense>
	);
}

"use client";
import type { pageJobDetailQuery } from "@/__generated__/pageJobDetailQuery.graphql";
import JobOverviewTab from "@/components/job-detail/analytics-tab/JobAnalyticsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobDetailQuery = graphql`
  query pageJobDetailQuery($orgSlug: String!, $jobSlug: String!) {
    ...JobAnalyticsTabFragment @arguments(slug: $orgSlug, jobSlug: $jobSlug)
  }
`;

export default function JobDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const relayEnvironment = useRelayEnvironment();
	const preloadedQuery = loadQuery<pageJobDetailQuery>(
		relayEnvironment,
		JobDetailQuery,
		{ orgSlug: organizationSlug, jobSlug: slug },
		{ fetchPolicy: "store-and-network" },
	);

	return (
		<Suspense
			fallback={
				<div className="w-full h-full flex items-center justify-center">
					<Spinner size="lg" />
				</div>
			}
		>
			<JobOverviewTab initialQueryRef={preloadedQuery} />
		</Suspense>
	);
}

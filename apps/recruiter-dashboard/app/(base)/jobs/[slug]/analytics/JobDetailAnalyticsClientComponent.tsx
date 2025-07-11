"use client";
import type { JobDetailAnalyticsClientComponentQuery as JobDetailAnalyticsClientComponentQueryType } from "@/__generated__/JobDetailAnalyticsClientComponentQuery.graphql";
import JobOverviewTab from "@/components/job-detail/analytics-tab/JobAnalyticsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobDetailAnalyticsClientComponentQuery = graphql`
  query JobDetailAnalyticsClientComponentQuery($orgSlug: String!, $jobSlug: String!) {
    ...JobAnalyticsTabFragment @arguments(slug: $orgSlug, jobSlug: $jobSlug)
  }
`;

export default function JobDetailAnalyticsClientComponent() {
	const { slug } = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const relayEnvironment = useRelayEnvironment();
	const preloadedQuery = loadQuery<JobDetailAnalyticsClientComponentQueryType>(
		relayEnvironment,
		JobDetailAnalyticsClientComponentQuery,
		{ orgSlug: organizationSlug, jobSlug: slug },
		{ fetchPolicy: "store-and-network", networkCacheConfig: { force: false } },
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

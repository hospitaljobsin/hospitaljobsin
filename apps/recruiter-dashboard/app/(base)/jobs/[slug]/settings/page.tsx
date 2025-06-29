"use client";
import type { pageJobGeneralSettingsQuery } from "@/__generated__/pageJobGeneralSettingsQuery.graphql";
import JobSettingsGeneralTab from "@/components/job-detail/settings-tab/general-tab/JobSettingsGeneralTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobGeneralSettingsQuery = graphql`
  query pageJobGeneralSettingsQuery($orgSlug: String!, $jobSlug: String!) {
    ...JobSettingsGeneralTabFragment @arguments(slug: $orgSlug, jobSlug: $jobSlug)
  }
`;

export default function JobGeneralSettingsPage() {
	const { slug } = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const relayEnvironment = useRelayEnvironment();
	const preloadedQuery = loadQuery<pageJobGeneralSettingsQuery>(
		relayEnvironment,
		JobGeneralSettingsQuery,
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
			<JobSettingsGeneralTab initialQueryRef={preloadedQuery} />
		</Suspense>
	);
}

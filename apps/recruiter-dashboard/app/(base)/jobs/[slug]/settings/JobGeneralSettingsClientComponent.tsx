"use client";
import type { JobGeneralSettingsClientComponentQuery as JobGeneralSettingsClientComponentQueryType } from "@/__generated__/JobGeneralSettingsClientComponentQuery.graphql";
import JobSettingsGeneralTab from "@/components/job-detail/settings-tab/general-tab/JobSettingsGeneralTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobGeneralSettingsClientComponentQuery = graphql`
  query JobGeneralSettingsClientComponentQuery($orgSlug: String!, $jobSlug: String!) {
    ...JobSettingsGeneralTabFragment @arguments(slug: $orgSlug, jobSlug: $jobSlug)
  }
`;

export default function JobGeneralSettingsClientComponent() {
	const { slug } = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const relayEnvironment = useRelayEnvironment();
	const preloadedQuery = loadQuery<JobGeneralSettingsClientComponentQueryType>(
		relayEnvironment,
		JobGeneralSettingsClientComponentQuery,
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

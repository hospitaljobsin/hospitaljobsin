"use client";
import type { pageJobApplicationFormSettingsQuery } from "@/__generated__/pageJobApplicationFormSettingsQuery.graphql";
import ApplicationFormTab from "@/components/job-detail/settings-tab/application-form-tab/ApplicationFormTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobApplicationFormSettingsQuery = graphql`
  query pageJobApplicationFormSettingsQuery($orgSlug: String!, $jobSlug: String!) {
    ...ApplicationFormTabFragment @arguments(slug: $orgSlug, jobSlug: $jobSlug)
  }
`;

export default function JobApplicationFormSettingsPage() {
	const { slug } = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const relayEnvironment = useRelayEnvironment();
	const preloadedQuery = loadQuery<pageJobApplicationFormSettingsQuery>(
		relayEnvironment,
		JobApplicationFormSettingsQuery,
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
			<ApplicationFormTab initialQueryRef={preloadedQuery} />
		</Suspense>
	);
}

"use client";
import { pageJobDetailQuery } from "@/__generated__/pageJobDetailQuery.graphql";
import JobDetailView from "@/components/job-detail/JobDetailView";
import useOrganization from "@/lib/hooks/useOrganization";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobDetailQuery = graphql`
  query pageJobDetailQuery($orgSlug: String!, $jobSlug: String!) {
    ...JobDetailViewFragment @arguments(orgSlug: $orgSlug, jobSlug: $jobSlug)
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
			fallback={<div className="p-8 text-center">Loading job details...</div>}
		>
			<JobDetailView preloadedQuery={preloadedQuery} />
		</Suspense>
	);
}

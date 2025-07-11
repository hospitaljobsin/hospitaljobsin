"use client";
import type { JobDetailApplicantsClientComponentQuery as JobDetailApplicantsClientComponentQueryType } from "@/__generated__/JobDetailApplicantsClientComponentQuery.graphql";
import ApplicantsTab from "@/components/job-detail/applicants-tab/ApplicantsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobDetailApplicantsClientComponentQuery = graphql`
  query JobDetailApplicantsClientComponentQuery($orgSlug: String!, $jobSlug: String!, $searchTerm: String, $status: JobApplicantStatus, $sortBy: JobApplicantsSortBy!) {
    ...ApplicantsTabFragment @arguments(slug: $orgSlug, jobSlug: $jobSlug, searchTerm: $searchTerm, status: $status, sortBy: $sortBy)
  }
`;

export default function JobDetailApplicantsClientComponent() {
	const { slug } = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const relayEnvironment = useRelayEnvironment();
	const preloadedQuery = loadQuery<JobDetailApplicantsClientComponentQueryType>(
		relayEnvironment,
		JobDetailApplicantsClientComponentQuery,
		{ orgSlug: organizationSlug, jobSlug: slug, sortBy: "OVERALL_SCORE" },
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
			<ApplicantsTab initialQueryRef={preloadedQuery} />
		</Suspense>
	);
}

"use client";
import type { pageJobDetailApplicantsQuery } from "@/__generated__/pageJobDetailApplicantsQuery.graphql";
import ApplicantsTab from "@/components/job-detail/applicants-tab/ApplicantsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobDetailApplicantsQuery = graphql`
  query pageJobDetailApplicantsQuery($orgSlug: String!, $jobSlug: String!, $searchTerm: String, $status: JobApplicantStatus) {
    ...ApplicantsTabFragment @arguments(slug: $orgSlug, jobSlug: $jobSlug, searchTerm: $searchTerm, status: $status)
  }
`;

export default function JobDetailApplicantsPage() {
	const { slug } = useParams<{ slug: string }>();
	const { organizationSlug } = useOrganization();
	const relayEnvironment = useRelayEnvironment();
	const preloadedQuery = loadQuery<pageJobDetailApplicantsQuery>(
		relayEnvironment,
		JobDetailApplicantsQuery,
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
			<ApplicantsTab initialQueryRef={preloadedQuery} />
		</Suspense>
	);
}

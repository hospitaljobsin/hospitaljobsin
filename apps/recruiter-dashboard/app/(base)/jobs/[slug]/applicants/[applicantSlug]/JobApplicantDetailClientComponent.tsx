"use client";
import type { JobApplicantDetailClientComponentQuery as JobApplicantDetailClientComponentQueryType } from "@/__generated__/JobApplicantDetailClientComponentQuery.graphql";
import ApplicantDetailView from "@/components/job-detail/applicants-tab/applicant-detail/ApplicantDetailView";
import useOrganization from "@/lib/hooks/useOrganization";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { graphql, loadQuery, useRelayEnvironment } from "react-relay";

export const JobApplicantDetailClientComponentQuery = graphql`
  query JobApplicantDetailClientComponentQuery($orgSlug: String!, $jobSlug: String!, $applicantSlug: String!) {
    ...ApplicantDetailViewFragment @arguments(slug: $orgSlug, jobSlug: $jobSlug, applicantSlug: $applicantSlug)
  }
`;

export default function JobApplicantDetailClientComponent() {
	const { slug, applicantSlug } = useParams<{
		slug: string;
		applicantSlug: string;
	}>();
	const { organizationSlug } = useOrganization();
	const relayEnvironment = useRelayEnvironment();
	const preloadedQuery = loadQuery<JobApplicantDetailClientComponentQueryType>(
		relayEnvironment,
		JobApplicantDetailClientComponentQuery,
		{ orgSlug: organizationSlug, jobSlug: slug, applicantSlug: applicantSlug },
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
			<ApplicantDetailView initialQueryRef={preloadedQuery} />
		</Suspense>
	);
}

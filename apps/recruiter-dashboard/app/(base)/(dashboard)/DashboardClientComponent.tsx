"use client";
import type { DashboardClientComponentQuery as DashboardClientComponentQueryType } from "@/__generated__/DashboardClientComponentQuery.graphql";
import DashboardView from "@/components/dashboard/DashboardView";
import DashboardViewSkeleton from "@/components/dashboard/DashboardViewSkeleton";
import useOrganization from "@/lib/hooks/useOrganization";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const DashboardClientComponentQuery = graphql`
  query DashboardClientComponentQuery($slug: String!, $searchTerm: String, $sortBy: JobSortBy!) {
	...DashboardViewFragment @arguments(slug: $slug, searchTerm: $searchTerm, sortBy: $sortBy)
  }
`;

export default function DashboardClientComponent() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef = loadQuery<DashboardClientComponentQueryType>(
		environment,
		DashboardClientComponentQuery,
		{
			slug: organizationSlug,
			sortBy: "LAST_APPLICANT_APPLIED_AT",
		},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<DashboardViewSkeleton />}>
			<DashboardView initialQueryRef={initialQueryRef} />
		</Suspense>
	);
}

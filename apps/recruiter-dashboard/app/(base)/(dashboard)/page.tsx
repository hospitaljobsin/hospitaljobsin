"use client";
import type { pageDashboardViewQuery } from "@/__generated__/pageDashboardViewQuery.graphql";
import DashboardView from "@/components/dashboard/DashboardView";
import useOrganization from "@/lib/hooks/useOrganization";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

export const PageDashboardViewQuery = graphql`
  query pageDashboardViewQuery($slug: String!, $searchTerm: String) {
	...DashboardViewFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function DashboardPage() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef = loadQuery<pageDashboardViewQuery>(
		environment,
		PageDashboardViewQuery,
		{
			slug: organizationSlug,
		},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return <DashboardView initialQueryRef={initialQueryRef} />;
}

"use client";
import type { pageOrganizationMemberSettingsQuery } from "@/__generated__/pageOrganizationMemberSettingsQuery.graphql";
import MemberSettingsTab from "@/components/org-settings/members-tab/MemberSettingsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

export const PageOrganizationMemberSettingsQuery = graphql`
  query pageOrganizationMemberSettingsQuery($slug: String!, $searchTerm: String) {
	...MemberSettingsTabFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function OrganizationMemberSettingsPage() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef = loadQuery<pageOrganizationMemberSettingsQuery>(
		environment,
		PageOrganizationMemberSettingsQuery,
		{
			slug: organizationSlug,
		},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return <MemberSettingsTab initialQueryRef={initialQueryRef} />;
}

"use client";
import type { pageOrganizationInviteSettingsQuery } from "@/__generated__/pageOrganizationInviteSettingsQuery.graphql";
import InviteSettingsTab from "@/components/org-settings/invites-tab/InviteSettingsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

export const PageOrganizationInviteSettingsQuery = graphql`
  query pageOrganizationInviteSettingsQuery($slug: String!, $searchTerm: String) {
	...InviteSettingsTabFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function OrganizationInviteSettingsPage() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef = loadQuery<pageOrganizationInviteSettingsQuery>(
		environment,
		PageOrganizationInviteSettingsQuery,
		{
			slug: organizationSlug,
		},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return <InviteSettingsTab initialQueryRef={initialQueryRef} />;
}

"use client";
import type { OrganizationInviteSettingsClientComponentQuery as OrganizationInviteSettingsClientComponentQueryType } from "@/__generated__/OrganizationInviteSettingsClientComponentQuery.graphql";
import InviteSettingsTab from "@/components/org-settings/invites-tab/InviteSettingsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

export const OrganizationInviteSettingsClientComponentQuery = graphql`
  query OrganizationInviteSettingsClientComponentQuery($slug: String!, $searchTerm: String) {
	...InviteSettingsTabFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function OrganizationInviteSettingsClientComponent() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef =
		loadQuery<OrganizationInviteSettingsClientComponentQueryType>(
			environment,
			OrganizationInviteSettingsClientComponentQuery,
			{
				slug: organizationSlug,
			},
			{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
		);

	return <InviteSettingsTab initialQueryRef={initialQueryRef} />;
}

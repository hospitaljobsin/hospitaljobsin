"use client";
import type { OrganizationMemberSettingsClientComponentQuery as OrganizationMemberSettingsClientComponentQueryType } from "@/__generated__/OrganizationMemberSettingsClientComponentQuery.graphql";
import MemberSettingsTab from "@/components/org-settings/members-tab/MemberSettingsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

export const OrganizationMemberSettingsClientComponentQuery = graphql`
  query OrganizationMemberSettingsClientComponentQuery($slug: String!, $searchTerm: String) {
	...MemberSettingsTabFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function OrganizationMemberSettingsClientComponent() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef =
		loadQuery<OrganizationMemberSettingsClientComponentQueryType>(
			environment,
			OrganizationMemberSettingsClientComponentQuery,
			{
				slug: organizationSlug,
			},
			{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
		);

	return <MemberSettingsTab initialQueryRef={initialQueryRef} />;
}

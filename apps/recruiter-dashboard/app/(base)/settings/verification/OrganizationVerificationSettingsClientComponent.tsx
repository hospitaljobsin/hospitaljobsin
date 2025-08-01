"use client";
import type { OrganizationVerificationSettingsClientComponentQuery as OrganizationVerificationSettingsClientComponentQueryType } from "@/__generated__/OrganizationVerificationSettingsClientComponentQuery.graphql";
import VerificationSettingsTab from "@/components/org-settings/verification-tab/VerificationSettingsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

export const OrganizationVerificationSettingsClientComponentQuery = graphql`
  query OrganizationVerificationSettingsClientComponentQuery($slug: String!) {
	...VerificationSettingsTabFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationVerificationSettingsClientComponent() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef =
		loadQuery<OrganizationVerificationSettingsClientComponentQueryType>(
			environment,
			OrganizationVerificationSettingsClientComponentQuery,
			{
				slug: organizationSlug,
			},
			{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
		);

	return <VerificationSettingsTab initialQueryRef={initialQueryRef} />;
}

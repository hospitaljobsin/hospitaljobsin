"use client";
import type { OrganizationGeneralSettingsClientComponentQuery as OrganizationGeneralSettingsClientComponentQueryType } from "@/__generated__/OrganizationGeneralSettingsClientComponentQuery.graphql";
import GeneralSettingsTab from "@/components/org-settings/general-tab/GeneralSettingsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

export const OrganizationGeneralSettingsClientComponentQuery = graphql`
  query OrganizationGeneralSettingsClientComponentQuery($slug: String!) {
	...GeneralSettingsTabFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationGeneralSettingsClientComponent() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef =
		loadQuery<OrganizationGeneralSettingsClientComponentQueryType>(
			environment,
			OrganizationGeneralSettingsClientComponentQuery,
			{
				slug: organizationSlug,
			},
			{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
		);

	return <GeneralSettingsTab initialQueryRef={initialQueryRef} />;
}

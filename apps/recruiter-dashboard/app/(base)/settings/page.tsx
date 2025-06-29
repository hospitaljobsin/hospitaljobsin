"use client";
import type { pageOrganizationGeneralSettingsQuery } from "@/__generated__/pageOrganizationGeneralSettingsQuery.graphql";
import GeneralSettingsTab from "@/components/org-settings/general-tab/GeneralSettingsTab";
import useOrganization from "@/lib/hooks/useOrganization";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

export const PageOrganizationGeneralSettingsQuery = graphql`
  query pageOrganizationGeneralSettingsQuery($slug: String!) {
	...GeneralSettingsTabFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationGeneralSettingsPage() {
	const environment = useRelayEnvironment();
	const { organizationSlug } = useOrganization();

	invariant(organizationSlug, "Organization slug is required in headers");

	const initialQueryRef = loadQuery<pageOrganizationGeneralSettingsQuery>(
		environment,
		PageOrganizationGeneralSettingsQuery,
		{
			slug: organizationSlug,
		},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return <GeneralSettingsTab initialQueryRef={initialQueryRef} />;
}

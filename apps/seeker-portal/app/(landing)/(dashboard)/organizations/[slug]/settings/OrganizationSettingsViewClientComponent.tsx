"use client";

import OrganizationSettingsTab from "@/components/organization-detail/settings-tab/OrganizationSettingsTab";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import type { OrganizationSettingsViewClientComponentFragment$key } from "./__generated__/OrganizationSettingsViewClientComponentFragment.graphql";
import type OrganizationSettingsViewQueryNode from "./__generated__/pageOrganizationSettingsViewQuery.graphql";
import type { pageOrganizationSettingsViewQuery } from "./__generated__/pageOrganizationSettingsViewQuery.graphql";
import PageOrganizationSettingsViewQuery from "./__generated__/pageOrganizationSettingsViewQuery.graphql";

const OrganizationSettingsViewClientComponentFragment = graphql`
 fragment OrganizationSettingsViewClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
		...OrganizationSettingsTabFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationSettingsViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof OrganizationSettingsViewQueryNode,
		pageOrganizationSettingsViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof OrganizationSettingsViewQueryNode,
		pageOrganizationSettingsViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageOrganizationSettingsViewQuery, queryRef);

	const rootQuery =
		useFragment<OrganizationSettingsViewClientComponentFragment$key>(
			OrganizationSettingsViewClientComponentFragment,
			data,
		);

	return <OrganizationSettingsTab rootQuery={rootQuery} />;
}

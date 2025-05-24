"use client";

import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import type { OrganizationInvitesViewClientComponentFragment$key } from "@/__generated__/OrganizationInvitesViewClientComponentFragment.graphql";
import type OrganizationInvitesViewQueryNode from "@/__generated__/pageOrganizationInvitesViewQuery.graphql";
import type { pageOrganizationInvitesViewQuery } from "@/__generated__/pageOrganizationInvitesViewQuery.graphql";
import PageOrganizationInvitesViewQuery from "@/__generated__/pageOrganizationInvitesViewQuery.graphql";
import OrganizationInvitesView from "@/components/organization-detail/members-tab/invites/OrganizationInvitesView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";

const OrganizationInvitesViewClientComponentFragment = graphql`
 fragment OrganizationInvitesViewClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  },
	  searchTerm: { type: "String", defaultValue: null }
	) {
		...OrganizationInvitesViewFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function OrganizationInvitesViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof OrganizationInvitesViewQueryNode,
		pageOrganizationInvitesViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof OrganizationInvitesViewQueryNode,
		pageOrganizationInvitesViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageOrganizationInvitesViewQuery, queryRef);

	const rootQuery =
		useFragment<OrganizationInvitesViewClientComponentFragment$key>(
			OrganizationInvitesViewClientComponentFragment,
			data,
		);

	return <OrganizationInvitesView rootQuery={rootQuery} />;
}

"use client";

import OrganizationMembersTab from "@/components/organization-detail/members-tab/OrganizationMembersTab";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import type { OrganizationMembersViewClientComponentFragment$key } from "./__generated__/OrganizationMembersViewClientComponentFragment.graphql";
import type OrganizationMembersViewQueryNode from "./__generated__/pageOrganizationMembersViewQuery.graphql";
import type { pageOrganizationMembersViewQuery } from "./__generated__/pageOrganizationMembersViewQuery.graphql";
import PageOrganizationMembersViewQuery from "./__generated__/pageOrganizationMembersViewQuery.graphql";

const OrganizationMembersViewClientComponentFragment = graphql`
 fragment OrganizationMembersViewClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
		...OrganizationMembersTabFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationMembersViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof OrganizationMembersViewQueryNode,
		pageOrganizationMembersViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof OrganizationMembersViewQueryNode,
		pageOrganizationMembersViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageOrganizationMembersViewQuery, queryRef);

	const rootQuery =
		useFragment<OrganizationMembersViewClientComponentFragment$key>(
			OrganizationMembersViewClientComponentFragment,
			data,
		);

	return <OrganizationMembersTab rootQuery={rootQuery} />;
}

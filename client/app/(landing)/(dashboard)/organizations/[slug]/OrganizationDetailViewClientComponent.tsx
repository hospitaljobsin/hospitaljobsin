"use client";

import OrganizationDetailView from "@/components/organization-detail/OrganizationDetailView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import type { OrganizationDetailViewClientComponentFragment$key } from "./__generated__/OrganizationDetailViewClientComponentFragment.graphql";
import type OrganizationDetailViewQueryNode from "./__generated__/pageOrganizationDetailViewQuery.graphql";
import type { pageOrganizationDetailViewQuery } from "./__generated__/pageOrganizationDetailViewQuery.graphql";
import PageOrganizationDetailViewQuery from "./__generated__/pageOrganizationDetailViewQuery.graphql";

const OrganizationDetailViewClientComponentFragment = graphql`
 fragment OrganizationDetailViewClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
		...OrganizationOverviewTabFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationDetailViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof OrganizationDetailViewQueryNode,
		pageOrganizationDetailViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof OrganizationDetailViewQueryNode,
		pageOrganizationDetailViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageOrganizationDetailViewQuery, queryRef);

	const rootQuery =
		useFragment<OrganizationDetailViewClientComponentFragment$key>(
			OrganizationDetailViewClientComponentFragment,
			data,
		);

	return <OrganizationDetailView rootQuery={rootQuery} />;
}

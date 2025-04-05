"use client";

import type { OrganizationJobsViewClientComponentFragment$key } from "@/__generated__/OrganizationJobsViewClientComponentFragment.graphql";
import type OrganizationJobsViewQueryNode from "@/__generated__/pageOrganizationJobsViewQuery.graphql";
import type { pageOrganizationJobsViewQuery } from "@/__generated__/pageOrganizationJobsViewQuery.graphql";
import PageOrganizationJobsViewQuery from "@/__generated__/pageOrganizationJobsViewQuery.graphql";
import OrganizationJobsTab from "@/components/organization-detail/jobs-tab/OrganizationJobsTab";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const OrganizationJobsViewClientComponentFragment = graphql`
 fragment OrganizationJobsViewClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	  searchTerm: { type: "String", defaultValue: null }
	) {
		...OrganizationJobsTabFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function OrganizationJobsViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof OrganizationJobsViewQueryNode,
		pageOrganizationJobsViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof OrganizationJobsViewQueryNode,
		pageOrganizationJobsViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageOrganizationJobsViewQuery, queryRef);

	const rootQuery =
		useFragment<OrganizationJobsViewClientComponentFragment$key>(
			OrganizationJobsViewClientComponentFragment,
			data,
		);

	return <OrganizationJobsTab rootQuery={rootQuery} />;
}

"use client";

import type { DashboardClientComponentFragment$key } from "@/__generated__/DashboardClientComponentFragment.graphql";
import type DashboardViewQueryNode from "@/__generated__/pageDashboardViewQuery.graphql";
import type { pageDashboardViewQuery } from "@/__generated__/pageDashboardViewQuery.graphql";
import PageOrganizationJobsViewQuery from "@/__generated__/pageDashboardViewQuery.graphql";
import DashboardView from "@/components/dashboard/DashboardView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const DashboardClientComponentFragment = graphql`
 fragment DashboardClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	  searchTerm: { type: "String", defaultValue: null }
	) {
		...DashboardViewFragment @arguments(slug: $slug, searchTerm: $searchTerm)
  }
`;

export default function DashboardClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof DashboardViewQueryNode,
		pageDashboardViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof DashboardViewQueryNode,
		pageDashboardViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageOrganizationJobsViewQuery, queryRef);

	const rootQuery = useFragment<DashboardClientComponentFragment$key>(
		DashboardClientComponentFragment,
		data,
	);

	return <DashboardView rootQuery={rootQuery} />;
}

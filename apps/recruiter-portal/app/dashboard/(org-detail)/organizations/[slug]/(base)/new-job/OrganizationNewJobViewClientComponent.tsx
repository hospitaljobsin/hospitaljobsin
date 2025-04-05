"use client";

import type { OrganizationNewJobViewClientComponentFragment$key } from "@/__generated__/OrganizationNewJobViewClientComponentFragment.graphql";
import type NewJobViewQueryNode from "@/__generated__/pageOrganizationNewJobViewQuery.graphql";
import type { pageOrganizationNewJobViewQuery } from "@/__generated__/pageOrganizationNewJobViewQuery.graphql";
import PageNewJobViewQuery from "@/__generated__/pageOrganizationNewJobViewQuery.graphql";
import NewJobView from "@/components/organization-detail/new-job/NewJobView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const OrganizationNewJobViewClientComponentFragment = graphql`
 fragment OrganizationNewJobViewClientComponentFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...NewJobViewFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationNewJobViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof NewJobViewQueryNode,
		pageOrganizationNewJobViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof NewJobViewQueryNode,
		pageOrganizationNewJobViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageNewJobViewQuery, queryRef);

	const rootQuery =
		useFragment<OrganizationNewJobViewClientComponentFragment$key>(
			OrganizationNewJobViewClientComponentFragment,
			data,
		);

	return <NewJobView rootQuery={rootQuery} />;
}

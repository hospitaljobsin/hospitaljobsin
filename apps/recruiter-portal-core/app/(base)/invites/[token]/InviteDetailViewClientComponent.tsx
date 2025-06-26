"use client";

import type { InviteDetailViewClientComponentFragment$key } from "@/__generated__/InviteDetailViewClientComponentFragment.graphql";
import type InviteDetailViewQueryNode from "@/__generated__/pageInviteDetailViewQuery.graphql";
import type { pageInviteDetailViewQuery } from "@/__generated__/pageInviteDetailViewQuery.graphql";
import PageInviteDetailViewQuery from "@/__generated__/pageInviteDetailViewQuery.graphql";
import InviteDetailView from "@/components/invite-detail/InviteDetailView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const InviteDetailViewClientComponentFragment = graphql`
 fragment InviteDetailViewClientComponentFragment on Query @argumentDefinitions(
	  inviteToken: {
		type: "String!",
	  }
	) {
		...InviteDetailViewFragment @arguments(inviteToken: $inviteToken)
  }
`;

export default function InviteDetailViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof InviteDetailViewQueryNode,
		pageInviteDetailViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof InviteDetailViewQueryNode,
		pageInviteDetailViewQuery
	>(environment, props.preloadedQuery, "store-or-network");

	const data = usePreloadedQuery(PageInviteDetailViewQuery, queryRef);

	const rootQuery = useFragment<InviteDetailViewClientComponentFragment$key>(
		InviteDetailViewClientComponentFragment,
		data,
	);

	return <InviteDetailView rootQuery={rootQuery} />;
}

"use client";

import type { RequestSudoModeViewClientComponentFragment$key } from "@/__generated__/RequestSudoModeViewClientComponentFragment.graphql";
import type RequestSudoModeViewQueryNode from "@/__generated__/pageRequestSudoModeViewQuery.graphql";
import type { pageRequestSudoModeViewQuery } from "@/__generated__/pageRequestSudoModeViewQuery.graphql";
import PageRequestSudoModeViewQuery from "@/__generated__/pageRequestSudoModeViewQuery.graphql";
import RequestSudoView from "@/components/request-sudo/RequestSudoView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const RequestSudoModeViewClientComponentFragment = graphql`
 fragment RequestSudoModeViewClientComponentFragment on Query {
    ...RequestSudoViewFragment
  }
`;

export default function RequestSudoModeViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof RequestSudoModeViewQueryNode,
		pageRequestSudoModeViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof RequestSudoModeViewQueryNode,
		pageRequestSudoModeViewQuery
	>(environment, props.preloadedQuery, "store-or-network");

	const data = usePreloadedQuery(PageRequestSudoModeViewQuery, queryRef);

	const rootQuery = useFragment<RequestSudoModeViewClientComponentFragment$key>(
		RequestSudoModeViewClientComponentFragment,
		data,
	);

	return (
		<div className="w-full mx-auto max-w-5xl h-full min-h-screen bg-background lg:bg-background-600">
			<RequestSudoView rootQuery={rootQuery} />
		</div>
	);
}

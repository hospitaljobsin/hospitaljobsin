"use client";

import CompanyDetailView from "@/components/company-detail/CompanyDetailView";
import type { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import { useRelayEnvironment } from "react-relay";

import type CompanyDetailViewQueryNode from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import type { CompanyDetailViewQuery } from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";

export default function CompanyDetailViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof CompanyDetailViewQueryNode,
		CompanyDetailViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery(
		environment,
		props.preloadedQuery,
	);

	return <CompanyDetailView queryRef={queryRef} />;
}

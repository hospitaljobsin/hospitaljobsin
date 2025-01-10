"use client";

import CompanyDetailView from "@/components/company-detail/CompanyDetailView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import type { CompanyDetailViewClientComponentFragment$key } from "./__generated__/CompanyDetailViewClientComponentFragment.graphql";
import type CompanyDetailViewQueryNode from "./__generated__/pageCompanyDetailViewQuery.graphql";
import type { pageCompanyDetailViewQuery } from "./__generated__/pageCompanyDetailViewQuery.graphql";
import PageCompanyDetailViewQuery from "./__generated__/pageCompanyDetailViewQuery.graphql";

const CompanyDetailViewClientComponentFragment = graphql`
 fragment CompanyDetailViewClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
		...CompanyDetailViewFragment @arguments(slug: $slug)
  }
`;

export default function CompanyDetailViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof CompanyDetailViewQueryNode,
		pageCompanyDetailViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof CompanyDetailViewQueryNode,
		pageCompanyDetailViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageCompanyDetailViewQuery, queryRef);

	const rootQuery = useFragment<CompanyDetailViewClientComponentFragment$key>(
		CompanyDetailViewClientComponentFragment,
		data,
	);

	return <CompanyDetailView rootQuery={rootQuery} />;
}

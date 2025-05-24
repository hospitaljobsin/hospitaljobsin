"use client";

import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import type { GeneralSettingsViewClientComponentFragment$key } from "@/__generated__/GeneralSettingsViewClientComponentFragment.graphql";
import type GeneralSettingsViewQueryNode from "@/__generated__/pageGeneralSettingsViewQuery.graphql";
import type { pageGeneralSettingsViewQuery } from "@/__generated__/pageGeneralSettingsViewQuery.graphql";
import PageGeneralSettingsViewQuery from "@/__generated__/pageGeneralSettingsViewQuery.graphql";
import GeneralSettingsView from "@/components/organization-detail/settings-tab/general/GeneralSettingsView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";

const GeneralSettingsClientViewComponentFragment = graphql`
 fragment GeneralSettingsViewClientComponentFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
		...GeneralSettingsViewFragment @arguments(slug: $slug)
  }
`;

export default function GeneralSettingsClientViewComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof GeneralSettingsViewQueryNode,
		pageGeneralSettingsViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof GeneralSettingsViewQueryNode,
		pageGeneralSettingsViewQuery
	>(environment, props.preloadedQuery);

	const data = usePreloadedQuery(PageGeneralSettingsViewQuery, queryRef);

	const rootQuery = useFragment<GeneralSettingsViewClientComponentFragment$key>(
		GeneralSettingsClientViewComponentFragment,
		data,
	);

	return <GeneralSettingsView rootQuery={rootQuery} />;
}

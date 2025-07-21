"use client";
import type { OrgDetailHeaderClientComponentFragment$key } from "@/__generated__/OrgDetailHeaderClientComponentFragment.graphql";
import type LayoutOrgDetailQueryNode from "@/__generated__/layoutOrgDetailQuery.graphql";
import type { layoutOrgDetailQuery } from "@/__generated__/layoutOrgDetailQuery.graphql";
import LayoutOrgDetailQuery from "@/__generated__/layoutOrgDetailQuery.graphql";
import OrgDetailHeader from "@/components/layout/OrgDetailHeader";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import { Suspense } from "react";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";

const OrgDetailHeaderClientComponentFragment = graphql`
fragment OrgDetailHeaderClientComponentFragment on Query   @argumentDefinitions(
    slug: { type: "String!" }
  ) {
	...OrgDetailHeaderFragment @arguments(slug: $slug)
}`;

export default function OrgDetailHeaderClientComponent({
	preloadedQuery,
}: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof LayoutOrgDetailQueryNode,
		layoutOrgDetailQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof LayoutOrgDetailQueryNode,
		layoutOrgDetailQuery
	>(environment, preloadedQuery, "store-or-network");

	const root = usePreloadedQuery(LayoutOrgDetailQuery, queryRef);
	const data = useFragment<OrgDetailHeaderClientComponentFragment$key>(
		OrgDetailHeaderClientComponentFragment,
		root,
	);
	return (
		<Suspense>
			<OrgDetailHeader root={data} />
		</Suspense>
	);
}

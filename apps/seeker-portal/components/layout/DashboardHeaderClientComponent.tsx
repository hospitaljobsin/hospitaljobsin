"use client";

import type { DashboardHeaderClientComponentFragment$key } from "@/__generated__/DashboardHeaderClientComponentFragment.graphql";
import type LayoutDashboardQueryNode from "@/__generated__/layoutDashboardQuery.graphql";
import type { layoutDashboardQuery } from "@/__generated__/layoutDashboardQuery.graphql";
import LayoutDashboardQuery from "@/__generated__/layoutDashboardQuery.graphql";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import DashboardHeader from "./DashboardHeader";

const DashboardHeaderClientComponentFragment = graphql`
  fragment DashboardHeaderClientComponentFragment on Query {
    ...DashboardHeaderFragment
  }
`;

export default function DashboardHeaderClientComponent({
	preloadedQuery,
}: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof LayoutDashboardQueryNode,
		layoutDashboardQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof LayoutDashboardQueryNode,
		layoutDashboardQuery
	>(environment, preloadedQuery, "store-or-network");

	const root = usePreloadedQuery(LayoutDashboardQuery, queryRef);
	const data = useFragment<DashboardHeaderClientComponentFragment$key>(
		DashboardHeaderClientComponentFragment,
		root,
	);
	return <DashboardHeader query={data} animate={false} />;
}

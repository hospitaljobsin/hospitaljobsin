"use client";
import type { pageAccountSettingsQuery } from "@/__generated__/pageAccountSettingsQuery.graphql";
import AccountSettingsViewSkeleton from "@/components/settings/account/AccountSettingsViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import AccountClientComponent from "./AccountClientComponent";

export const AccountSettingsPageQuery = graphql`
	query pageAccountSettingsQuery {
		...AccountClientComponentFragment
	}
`;

export default function AccountSettingsPage() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pageAccountSettingsQuery>(
		environment,
		AccountSettingsPageQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<AccountSettingsViewSkeleton />}>
			<AccountClientComponent queryReference={queryReference} />
		</Suspense>
	);
}

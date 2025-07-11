"use client";
import type { AccountClientComponentQuery as AccountClientComponentQueryType } from "@/__generated__/AccountClientComponentQuery.graphql";
import AccountSettingsView from "@/components/settings/account/AccountSettingsView";
import AccountSettingsViewSkeleton from "@/components/settings/account/AccountSettingsViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const AccountClientComponentQuery = graphql`
  query AccountClientComponentQuery {
    ...AccountSettingsViewFragment
  }
`;

export default function AccountClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<AccountClientComponentQueryType>(
		environment,
		AccountClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<AccountSettingsViewSkeleton />}>
			<AccountSettingsView queryReference={queryReference} />
		</Suspense>
	);
}

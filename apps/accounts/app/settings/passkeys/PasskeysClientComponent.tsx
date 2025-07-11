"use client";
import type { PasskeysClientComponentQuery as PasskeysClientComponentQueryType } from "@/__generated__/PasskeysClientComponentQuery.graphql";
import PasskeysSettingsView from "@/components/settings/passkeys/PasskeysSettingsView";
import PasskeysSettingsViewSkeleton from "@/components/settings/passkeys/PasskeysSettingsViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const PasskeysClientComponentQuery = graphql`
  query PasskeysClientComponentQuery {
    ...PasskeysSettingsViewFragment
  }
`;

export default function PasskeysClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<PasskeysClientComponentQueryType>(
		environment,
		PasskeysClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<PasskeysSettingsViewSkeleton />}>
			<PasskeysSettingsView queryReference={queryReference} />
		</Suspense>
	);
}

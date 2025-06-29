"use client";
import type { pagePasskeysSettingsQuery } from "@/__generated__/pagePasskeysSettingsQuery.graphql";
import PasskeysSettingsViewSkeleton from "@/components/settings/passkeys/PasskeysSettingsViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import PasskeysClientComponent from "./PasskeysClientComponent";

export const PasskeysSettingsPageQuery = graphql`
  query pagePasskeysSettingsQuery {
	...PasskeysClientComponentFragment
  }
`;

export default function PasskeysSettingsPage() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pagePasskeysSettingsQuery>(
		environment,
		PasskeysSettingsPageQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<PasskeysSettingsViewSkeleton />}>
			<PasskeysClientComponent queryReference={queryReference} />
		</Suspense>
	);
}

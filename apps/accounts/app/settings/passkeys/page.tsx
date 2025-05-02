"use client";
import type { pagePasskeysSettingsQuery } from "@/__generated__/pagePasskeysSettingsQuery.graphql";
import PasskeysSettingsViewSkeleton from "@/components/settings/passkeys/PasskeysSettingsViewSkeleton";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import PasskeysClientComponent from "./PasskeysClientComponent";

export const PasskeysSettingsPageQuery = graphql`
  query pagePasskeysSettingsQuery {
	...PasskeysClientComponentFragment
  }
`;

export default function PasskeysSettingsPage() {
	const queryReference = loadQuery<pagePasskeysSettingsQuery>(
		getCurrentEnvironment(),
		PasskeysSettingsPageQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<Suspense fallback={<PasskeysSettingsViewSkeleton />}>
			<PasskeysClientComponent queryReference={queryReference} />
		</Suspense>
	);
}

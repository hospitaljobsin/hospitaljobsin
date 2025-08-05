"use client";
import type { PrivacyClientComponentQuery as PrivacyClientComponentQueryType } from "@/__generated__/PrivacyClientComponentQuery.graphql";
import PrivacySettingsView from "@/components/settings/privacy/PrivacySettingsView";
import PrivacySettingsViewSkeleton from "@/components/settings/privacy/PrivacySettingsViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const PrivacyClientComponentQuery = graphql`
  query PrivacyClientComponentQuery {
    ...PrivacySettingsViewFragment
  }
`;

export default function PrivacyClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<PrivacyClientComponentQueryType>(
		environment,
		PrivacyClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<PrivacySettingsViewSkeleton />}>
			<PrivacySettingsView queryReference={queryReference} />
		</Suspense>
	);
}

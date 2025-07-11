"use client";
import type { SessionsClientComponentQuery as SessionsClientComponentQueryType } from "@/__generated__/SessionsClientComponentQuery.graphql";
import SessionsSettingsView from "@/components/settings/sessions/SessionsSettingsView";
import SessionsSettingsViewSkeleton from "@/components/settings/sessions/SessionsSettingsViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const SessionsClientComponentQuery = graphql`
  query SessionsClientComponentQuery {
    ...SessionsSettingsViewFragment
  }
`;

export default function SessionsClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<SessionsClientComponentQueryType>(
		environment,
		SessionsClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<SessionsSettingsViewSkeleton />}>
			<SessionsSettingsView queryReference={queryReference} />
		</Suspense>
	);
}

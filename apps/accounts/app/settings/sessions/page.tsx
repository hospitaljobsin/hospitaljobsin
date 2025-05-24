"use client";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import type { pageSessionsSettingsQuery } from "@/__generated__/pageSessionsSettingsQuery.graphql";
import SessionsSettingsViewSkeleton from "@/components/settings/sessions/SessionsSettingsViewSkeleton";
import SessionsClientComponent from "./SessionsClientComponent";

export const SessionsSettingsPageQuery = graphql`
  query pageSessionsSettingsQuery {
	...SessionsClientComponentFragment
  }
`;

export default function SessionsSettingsPage() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pageSessionsSettingsQuery>(
		environment,
		SessionsSettingsPageQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<Suspense fallback={<SessionsSettingsViewSkeleton />}>
			<SessionsClientComponent queryReference={queryReference} />
		</Suspense>
	);
}

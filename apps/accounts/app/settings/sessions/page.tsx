"use client";
import type { pageSessionsSettingsQuery } from "@/__generated__/pageSessionsSettingsQuery.graphql";
import SessionsSettingsViewSkeleton from "@/components/settings/sessions/SessionsSettingsViewSkeleton";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import SessionsClientComponent from "./SessionsClientComponent";

export const SessionsSettingsPageQuery = graphql`
  query pageSessionsSettingsQuery {
	...SessionsClientComponentFragment
  }
`;

export default function SessionsSettingsPage() {
	const queryReference = loadQuery<pageSessionsSettingsQuery>(
		getCurrentEnvironment(),
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

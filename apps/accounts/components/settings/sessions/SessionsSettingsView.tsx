"use client";
import type { SessionsSettingsViewQuery as SessionsSettingsViewQueryType } from "@/__generated__/SessionsSettingsViewQuery.graphql";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import SessionsList from "./SessionsList";

const SessionsSettingsViewQuery = graphql`
  query SessionsSettingsViewQuery {
    viewer {
      __typename
      ... on Account {
        ...SessionsListFragment
      }
    }
  }
`;

export default function SessionsSettingsView() {
	const environment = getCurrentEnvironment();
	// TODO: use usePreloadedQuery here instead- this will avoid timing issues and hence invariant blowing up like this
	const data = useLazyLoadQuery<SessionsSettingsViewQueryType>(
		SessionsSettingsViewQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);
	// TODO: the invariant here might fire because of invalid cached data-
	// cached data might have viewer type as NotAuthenticated. I hit the error last time immediately after login- when the store wasnt reset
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-6">
			<SessionsList root={data.viewer} />
		</div>
	);
}

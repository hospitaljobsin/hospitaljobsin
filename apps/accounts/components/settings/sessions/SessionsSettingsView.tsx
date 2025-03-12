"use client";
import type { SessionsSettingsViewQuery as SessionsSettingsViewQueryType } from "@/__generated__/SessionsSettingsViewQuery.graphql";
import { Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import SessionsList from "./SessionsList";
import SessionsListSkeleton from "./SessionsListSkeleton";

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
	const data = useLazyLoadQuery<SessionsSettingsViewQueryType>(
		SessionsSettingsViewQuery,
		{},
	);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-6">
			<Suspense fallback={<SessionsListSkeleton />}>
				<SessionsList root={data.viewer} />
			</Suspense>
		</div>
	);
}

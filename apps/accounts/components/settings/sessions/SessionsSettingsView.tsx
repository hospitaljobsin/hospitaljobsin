"use client";
import { Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import SessionsController from "./SessionsController";
import SessionsList from "./SessionsList";
import SessionsListSkeleton from "./SessionsListSkeleton";
import type { SessionsSettingsViewQuery as SessionsSettingsViewQueryType } from "./__generated__/SessionsSettingsViewQuery.graphql";

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
			<div className="flex w-full items-center justify-between gap-6">
				<p className="text-foreground-600">My Sessions</p>
				<SessionsController />
			</div>
			<Suspense fallback={<SessionsListSkeleton />}>
				<SessionsList root={data.viewer} />
			</Suspense>
		</div>
	);
}

"use client";
import type { SessionsClientComponentQuery as SessionsClientComponentQueryType } from "@/__generated__/SessionsClientComponentQuery.graphql";
import SessionsClientComponentQuery from "@/__generated__/SessionsClientComponentQuery.graphql";
import type { SessionsSettingsViewFragment$key } from "@/__generated__/SessionsSettingsViewFragment.graphql";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import SessionsList from "./SessionsList";

const SessionsSettingsViewFragment = graphql`
  fragment SessionsSettingsViewFragment on Query {
    viewer {
      __typename
      ... on Account {
        ...SessionsListFragment
      }
    }
  }
`;

export default function SessionsSettingsView({
	queryReference,
}: {
	queryReference: PreloadedQuery<SessionsClientComponentQueryType>;
}) {
	const query = usePreloadedQuery(SessionsClientComponentQuery, queryReference);
	const data = useFragment<SessionsSettingsViewFragment$key>(
		SessionsSettingsViewFragment,
		query,
	);
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

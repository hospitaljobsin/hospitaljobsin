"use client";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import type { SessionsSettingsViewFragment$key } from "@/__generated__/SessionsSettingsViewFragment.graphql";
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
	query,
}: {
	query: SessionsSettingsViewFragment$key;
}) {
	const data = useFragment(SessionsSettingsViewFragment, query);
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

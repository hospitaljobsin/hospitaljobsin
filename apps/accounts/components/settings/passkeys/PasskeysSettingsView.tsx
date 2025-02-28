"use client";
import { Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import PasskeysList from "./PasskeysList";
import PasskeysListSkeleton from "./PasskeysListSkeleton";
import type { PasskeysSettingsViewQuery as PasskeysSettingsViewQueryType } from "./__generated__/PasskeysSettingsViewQuery.graphql";

const PasskeysSettingsViewQuery = graphql`
  query PasskeysSettingsViewQuery {
    viewer {
      __typename
      ... on Account {
        ...PasskeysListFragment
      }
    }
  }
`;

export default function PasskeysSettingsView() {
	const data = useLazyLoadQuery<PasskeysSettingsViewQueryType>(
		PasskeysSettingsViewQuery,
		{},
	);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-6">
			<Suspense fallback={<PasskeysListSkeleton />}>
				<PasskeysList root={data.viewer} />
			</Suspense>
		</div>
	);
}

"use client";
import type { pageProfileQuery } from "@/__generated__/pageProfileQuery.graphql";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import ProfileClientComponent from "./ProfileClientComponent";

export const ProfilePageQuery = graphql`
	query pageProfileQuery {
		...ProfileClientComponentFragment
	}
`;

export default function Profile() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pageProfileQuery>(
		environment,
		ProfilePageQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);
	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<Suspense>
				<ProfileClientComponent queryReference={queryReference} />
			</Suspense>
		</div>
	);
}

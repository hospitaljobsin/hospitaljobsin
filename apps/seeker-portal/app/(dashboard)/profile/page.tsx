"use client";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import type { pageProfileQuery } from "@/__generated__/pageProfileQuery.graphql";
import ProfileClientComponent from "./ProfileClientComponent";

export const ProfilePageQuery = graphql`
	query pageProfileQuery {
		...ProfileClientComponentFragment
	}
`;

export const dynamic = "force-dynamic";

export default function Profile() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pageProfileQuery>(
		environment,
		ProfilePageQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);
	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<Suspense>
				<ProfileClientComponent queryReference={queryReference} />
			</Suspense>
		</div>
	);
}

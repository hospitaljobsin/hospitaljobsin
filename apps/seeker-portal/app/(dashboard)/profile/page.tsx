"use client";
import type { pageProfileQuery } from "@/__generated__/pageProfileQuery.graphql";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import ProfileClientComponent from "./ProfileClientComponent";

export const ProfilePageQuery = graphql`
	query pageProfileQuery {
		...ProfileClientComponentFragment
	}
`;

export default function Profile() {
	const queryReference = loadQuery<pageProfileQuery>(
		getCurrentEnvironment(),
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

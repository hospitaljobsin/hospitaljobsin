"use client";
import type { ProfileClientComponentQuery as ProfileClientComponentQueryType } from "@/__generated__/ProfileClientComponentQuery.graphql";
import ProfileView from "@/components/profile/ProfileView";
import ProfileViewSkeleton from "@/components/profile/ProfileViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const ProfileClientComponentQuery = graphql`
	query ProfileClientComponentQuery {
		...ProfileViewFragment
	}
`;

export default function ProfileClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<ProfileClientComponentQueryType>(
		environment,
		ProfileClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<ProfileViewSkeleton />}>
			<ProfileView queryReference={queryReference} />
		</Suspense>
	);
}

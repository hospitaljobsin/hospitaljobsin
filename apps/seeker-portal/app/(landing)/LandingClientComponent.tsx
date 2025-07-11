"use client";
import type { LandingClientComponentQuery as LandingClientComponentQueryType } from "@/__generated__/LandingClientComponentQuery.graphql";
import LandingView from "@/components/landing/LandingView";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";

const LandingClientComponentQuery = graphql`
query LandingClientComponentQuery($searchTerm: String, $coordinates: CoordinatesInput, $proximityKm: Float) {
		...LandingViewFragment @arguments(searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm)
	}
`;

export default function LandingClientComponent() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<LandingClientComponentQueryType>(
		environment,
		LandingClientComponentQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return (
		<Suspense fallback={<LandingViewSkeleton />}>
			<LandingView queryReference={queryReference} />
		</Suspense>
	);
}

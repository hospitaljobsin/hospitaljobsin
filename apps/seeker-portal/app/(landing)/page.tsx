"use client";
import type { pageLandingQuery } from "@/__generated__/pageLandingQuery.graphql";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import LandingClientComponent from "./LandingClientComponent";

export const LandingPageQuery = graphql`
	query pageLandingQuery($searchTerm: String, $coordinates: CoordinatesInput, $proximityKm: Float) {
		...LandingClientComponentFragment @arguments(searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm)
	}
`;

export default function Landing() {
	const environment = useRelayEnvironment();
	const queryReference = loadQuery<pageLandingQuery>(
		environment,
		LandingPageQuery,
		{},
		{ fetchPolicy: "store-or-network", networkCacheConfig: { force: false } },
	);

	return <LandingClientComponent queryReference={queryReference} />;
}

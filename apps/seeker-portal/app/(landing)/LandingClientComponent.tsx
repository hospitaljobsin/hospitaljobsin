"use client";
import type { LandingClientComponentFragment$key } from "@/__generated__/LandingClientComponentFragment.graphql";
import type { pageLandingQuery } from "@/__generated__/pageLandingQuery.graphql";
import LandingView from "@/components/landing/LandingView";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { LandingPageQuery } from "./page";

const LandingClientComponentFragment = graphql`
  fragment LandingClientComponentFragment on Query   @argumentDefinitions(
    searchTerm: { type: "String" }
    coordinates: { type: "CoordinatesInput"}
	proximityKm: { type: "Float" }
  )  {
    ...LandingViewFragment @arguments(searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm)
  }
`;

export default function LandingClientComponent({
	queryReference,
}: {
	queryReference: PreloadedQuery<pageLandingQuery>;
}) {
	const data = usePreloadedQuery(LandingPageQuery, queryReference);
	const query = useFragment<LandingClientComponentFragment$key>(
		LandingClientComponentFragment,
		data,
	);
	return <LandingView query={query} />;
}

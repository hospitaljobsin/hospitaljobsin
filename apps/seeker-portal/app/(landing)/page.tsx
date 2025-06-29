"use client";
import type { pageLandingQuery } from "@/__generated__/pageLandingQuery.graphql";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";
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

	return (
		<>
			<div className="bg-primary-400 relative">
				{/* Desktop/Tablet Hero */}
				<div className="hidden sm:flex pt-20 sm:pt-28 pb-20 sm:pb-48 px-4 sm:px-5 w-full h-full flex-col gap-4 sm:gap-8 text-center max-w-xl sm:max-w-7xl mx-auto">
					<h1 className="text-4xl sm:text-6xl font-medium tracking-tighter text-balance text-primary-foreground z-10">
						Connecting Healthcare Heroes with Their Next Opportunity
					</h1>
				</div>
				{/* Mobile Hero (minimal) */}
				<div className="flex sm:hidden pt-6 pb-4 px-4 w-full flex-col items-center text-center">
					<h1 className="text-xl font-medium text-primary-foreground z-10">
						Find your next healthcare job
					</h1>
				</div>
			</div>

			<div className="py-4 sm:py-8 flex flex-col gap-4 sm:gap-8 max-w-7xl px-4 sm:px-5 mx-auto">
				<Suspense fallback={<LandingViewSkeleton />}>
					<LandingClientComponent queryReference={queryReference} />
				</Suspense>
			</div>
		</>
	);
}

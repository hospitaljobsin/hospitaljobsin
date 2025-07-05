"use client";
import type { LandingViewFragment$key } from "@/__generated__/LandingViewFragment.graphql";
import { TrendingUpIcon } from "lucide-react";
import { Suspense } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import JobList from "./JobList";
import JobListSkeleton from "./JobListSkeleton";
import { LandingSearchController } from "./LandingSearchController";

const LandingViewFragment = graphql`
  fragment LandingViewFragment on Query   @argumentDefinitions(
    searchTerm: { type: "String" }
    coordinates: { type: "CoordinatesInput"}
	proximityKm: { type: "Float" }
  ) {
    ...JobListFragment @arguments(searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm)
  }
`;

export default function LandingView({
	query,
}: {
	query: LandingViewFragment$key;
}) {
	const data = useFragment(LandingViewFragment, query);

	return (
		<>
			<div className="bg-primary-400 relative">
				{/* Desktop/Tablet Hero */}
				<div className="hidden sm:flex pt-20 sm:pt-28 pb-20 sm:pb-48 px-4 sm:px-5 w-full h-full flex-col gap-6 sm:gap-16 text-center max-w-xl sm:max-w-7xl mx-auto">
					<h1 className="text-4xl sm:text-6xl font-medium tracking-tighter text-balance text-primary-foreground z-10">
						Connecting Healthcare Heroes with Their Next Opportunity
					</h1>
					<LandingSearchController />
				</div>
				{/* Mobile Hero (minimal) */}
				<div className="flex sm:hidden pt-6 pb-4 px-4 w-full flex-col gap-4 items-center text-center">
					<h1 className="text-xl font-medium text-primary-foreground z-10">
						Find your next healthcare job
					</h1>
					<LandingSearchController />
				</div>
			</div>

			<div className="py-4 sm:py-8 flex flex-col gap-4 sm:gap-8 max-w-7xl px-4 sm:px-5 mx-auto bg-background-600">
				<div className="w-full h-full flex flex-col gap-4 sm:gap-8 items-center justify-center">
					<div className="flex items-center gap-4">
						<TrendingUpIcon />
						<h2 className="text-lg sm:text-2xl font-medium text-foreground-600">
							Trending Jobs
						</h2>
					</div>
					<Suspense fallback={<JobListSkeleton />}>
						<JobList rootQuery={data} />
					</Suspense>
				</div>
			</div>
		</>
	);
}

"use client";
import type { LandingViewFragment$key } from "@/__generated__/LandingViewFragment.graphql";
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
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 items-center justify-center">
			<LandingSearchController />
			Trending Jobs
			<Suspense fallback={<JobListSkeleton />}>
				<JobList rootQuery={data} />
			</Suspense>
		</div>
	);
}

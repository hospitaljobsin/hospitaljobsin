"use client";
import type { LandingViewFragment$key } from "@/__generated__/LandingViewFragment.graphql";
import { Suspense, useState } from "react";
import { graphql, useFragment } from "react-relay";
import { useDebounce } from "use-debounce";
import type { CoordinatesInput } from "../../__generated__/JobListRefetchQuery.graphql";
import JobList from "./JobList";
import JobListController from "./JobListController";
import JobListSkeleton from "./JobListSkeleton";

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
}: { query: LandingViewFragment$key }) {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const [coordinates, setCoordinates] = useState<CoordinatesInput | null>(null);

	const [proximityKm, setProximityKm] = useState<number | null>(null);

	const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
	const [debouncedCoordinates] = useDebounce(coordinates, 1000);
	const [debouncedProximityKm] = useDebounce(proximityKm, 1000);

	const data = useFragment(LandingViewFragment, query);

	return (
		<div className="w-full h-full flex flex-col mt-4 sm:-mt-20 gap-4 sm:gap-8">
			<JobListController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				coordinates={coordinates}
				setCoordinates={setCoordinates}
				proximityKm={proximityKm}
				setProximityKm={setProximityKm}
			/>
			<Suspense fallback={<JobListSkeleton />}>
				<JobList
					searchTerm={debouncedSearchTerm}
					rootQuery={data}
					coordinates={debouncedCoordinates}
					proximityKm={debouncedProximityKm}
				/>
			</Suspense>
		</div>
	);
}

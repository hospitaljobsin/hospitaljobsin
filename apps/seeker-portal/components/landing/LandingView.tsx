"use client";
import type {
	CoordinatesInput,
	LandingViewQuery as LandingViewQueryType,
} from "@/__generated__/LandingViewQuery.graphql";
import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useDebounce } from "use-debounce";
import JobList from "./JobList";
import JobListController from "./JobListController";

const LandingViewQuery = graphql`
  query LandingViewQuery($searchTerm: String, $coordinates: CoordinatesInput, $proximityKm: Float) {
    ...JobListFragment @arguments(searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm)
  }
`;

export default function LandingView() {

	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const [coordinates, setCoordinates] = useState<CoordinatesInput | null>(null);

	const [proximityKm, setProximityKm] = useState<number | null>(null);

	const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
	const [debouncedCoordinates] = useDebounce(coordinates, 1000);
	const [debouncedProximityKm] = useDebounce(proximityKm, 1000);

	const data = useLazyLoadQuery<LandingViewQueryType>(
		LandingViewQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

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
			<JobList
				searchTerm={debouncedSearchTerm}
				rootQuery={data}
				coordinates={debouncedCoordinates}
				proximityKm={debouncedProximityKm}
			/>
		</div>
	);
}

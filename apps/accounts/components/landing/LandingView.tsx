"use client";
import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useDebounce } from "use-debounce";
import JobList from "./JobList";
import JobListController from "./JobListController";
import type { LandingViewQuery as LandingViewQueryType } from "./__generated__/LandingViewQuery.graphql";

const LandingViewQuery = graphql`
  query LandingViewQuery {
    ...JobListFragment
  }
`;

export default function LandingView() {
	const data = useLazyLoadQuery<LandingViewQueryType>(LandingViewQuery, {});
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

	return (
		<div className="w-full h-full flex flex-col mt-4 sm:-mt-20 gap-4 sm:gap-8">
			<JobListController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			<JobList searchTerm={debouncedSearchTerm} rootQuery={data} />
		</div>
	);
}

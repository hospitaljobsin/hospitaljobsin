/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { JobOverviewTabFragment$key } from "@/__generated__/JobOverviewTabFragment.graphql";
import { graphql, useFragment } from "react-relay";
import JobDetails from "./JobDetails";

const JobOverviewTabFragment = graphql`
 fragment JobOverviewTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...JobDetailsFragment @arguments(slug: $slug)
  }
`;

export default function JobOverviewTab(props: {
	rootQuery: JobOverviewTabFragment$key;
}) {
	const query = useFragment(JobOverviewTabFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<JobDetails rootQuery={query} />
		</div>
	);
}

/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { JobOverviewTabFragment$key } from "@/__generated__/JobOverviewTabFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import JobDetails from "./JobDetails";

const JobOverviewTabFragment = graphql`
 fragment JobOverviewTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		job(slug: $slug) {
			__typename
			... on Job {
				...JobDetailsFragment
			}     
    	}
  }
`;

export default function JobOverviewTab(props: {
	rootQuery: JobOverviewTabFragment$key;
}) {
	const query = useFragment(JobOverviewTabFragment, props.rootQuery);
	invariant(query.job.__typename === "Job", "`Job` node type expected.");

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<JobDetails rootQuery={query.job} />
		</div>
	);
}

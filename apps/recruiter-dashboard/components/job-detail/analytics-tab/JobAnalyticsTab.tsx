"use client";
import type { JobAnalyticsTabFragment$key } from "@/__generated__/JobAnalyticsTabFragment.graphql";
import PageJobDetailQuery, {
	type pageJobDetailQuery,
} from "@/__generated__/pageJobDetailQuery.graphql";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import JobDetails from "./JobDetails";

const JobAnalyticsTabFragment = graphql`
 fragment JobAnalyticsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: {type: "String!"}
    ) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				job(slug: $jobSlug) {
			__typename
			... on Job {
				...JobDetailsFragment
			}
    	}
			}
		}

  }
`;

export default function JobAnalyticsTab(props: {
	initialQueryRef: PreloadedQuery<pageJobDetailQuery>;
}) {
	const data = usePreloadedQuery(PageJobDetailQuery, props.initialQueryRef);
	const query = useFragment<JobAnalyticsTabFragment$key>(
		JobAnalyticsTabFragment,
		data,
	);
	invariant(
		query.organization.__typename === "Organization",
		"`Organization` node type expected.",
	);
	invariant(
		query.organization.job.__typename === "Job",
		"`Job` node type expected.",
	);

	return (
		<div className="pt-8 pl-6 pb-16 w-full h-full flex flex-col items-center gap-12">
			<JobDetails rootQuery={query.organization.job} />
		</div>
	);
}

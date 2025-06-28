"use client";
import type { JobAnalyticsTabFragment$key } from "@/__generated__/JobAnalyticsTabFragment.graphql";
import PageJobDetailQuery, {
	type pageJobDetailQuery,
} from "@/__generated__/pageJobDetailQuery.graphql";
import JobNotFoundView from "@/components/JobNotFoundView";
import NotFoundView from "@/components/NotFoundView";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
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
				isMember
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

	if (
		query.organization.__typename !== "Organization" ||
		!query.organization.isMember
	) {
		return <NotFoundView />;
	}

	if (query.organization.job.__typename !== "Job") {
		return <JobNotFoundView />;
	}

	return (
		<div className="pt-8 pl-6 pb-16 w-full h-full flex flex-col items-center gap-12">
			<JobDetails rootQuery={query.organization.job} />
		</div>
	);
}

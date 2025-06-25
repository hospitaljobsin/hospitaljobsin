import type { JobDetailViewFragment$key } from "@/__generated__/JobDetailViewFragment.graphql";
import useJobImpressionTracker from "@/lib/hooks/useJobImpressionTracker";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import JobDetails from "./JobDetails";
import RelatedJobsList from "./RelatedJobsList";

const JobDetailViewFragment = graphql`
 fragment JobDetailViewFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
		...JobDetailsFragment @arguments(slug: $slug, jobSlug: $jobSlug)
		organization(slug: $slug) {
		__typename
		... on Organization {
			job(slug: $jobSlug) {
				__typename
				... on Job {
					id
					...RelatedJobsListFragment
				}
			}
		}
	}
  }
`;

export default function JobDetailView(props: {
	rootQuery: JobDetailViewFragment$key;
}) {
	const query = useFragment(JobDetailViewFragment, props.rootQuery);

	invariant(
		query.organization.__typename === "Organization",
		"Expected 'Organization' node type.",
	);
	invariant(
		query.organization.job.__typename === "Job",
		"Expected 'Job' node type.",
	);

	useJobImpressionTracker(query.organization.job.id);

	return (
		<div className="py-8 w-full h-full flex flex-col lg:flex-row items-start gap-6">
			<JobDetails rootQuery={query} />
			<RelatedJobsList job={query.organization.job} />
		</div>
	);
}

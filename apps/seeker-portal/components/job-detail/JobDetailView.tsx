import type { JobDetailViewFragment$key } from "@/__generated__/JobDetailViewFragment.graphql";
import useJobImpressionTracker from "@/lib/hooks/useJobImpressionTracker";
import { useParams } from "next/navigation";
import { graphql, useFragment } from "react-relay";
import JobDetails from "./JobDetails";
import RelatedJobsList from "./RelatedJobsList";

const JobDetailViewFragment = graphql`
 fragment JobDetailViewFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
		...JobDetailsFragment @arguments(slug: $slug, jobSlug: $jobSlug)
		...RelatedJobsListFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

export default function JobDetailView(props: {
	rootQuery: JobDetailViewFragment$key;
}) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const slug = decodeURIComponent(params.slug);
	const jobSlug = decodeURIComponent(params.jobSlug);
	const query = useFragment(JobDetailViewFragment, props.rootQuery);

	useJobImpressionTracker(slug, jobSlug);

	return (
		<div className="py-8 w-full h-full flex flex-col lg:flex-row items-start gap-6">
			<JobDetails rootQuery={query} />
			<RelatedJobsList rootQuery={query} />
		</div>
	);
}

import type { JobDetailViewFragment$key } from "@/__generated__/JobDetailViewFragment.graphql";
import PageJobDetailQuery, {
	pageJobDetailQuery,
} from "@/__generated__/pageJobDetailQuery.graphql";
import { PreloadedQuery, useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import JobDetail from "./JobDetail";

export const JobDetailViewFragment = graphql`
  fragment JobDetailViewFragment on Query @argumentDefinitions(
    orgSlug: { type: "String!" }
    jobSlug: { type: "String!" }
  ) {
    organization(slug: $orgSlug) {
      __typename
      ... on Organization {
        job(slug: $jobSlug) {
          __typename
          ... on Job {
            ...JobDetailFragment
          }
          # handle other job union types here if needed
        }
      }
      # handle other organization union types here if needed
    }
  }
`;

export default function JobDetailView({
	preloadedQuery,
}: { preloadedQuery: PreloadedQuery<pageJobDetailQuery> }) {
	const rootData = usePreloadedQuery(PageJobDetailQuery, preloadedQuery);
	const data = useFragment<JobDetailViewFragment$key>(
		JobDetailViewFragment,
		rootData,
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected organization to be of type Organization",
	);
	const job = data.organization.job;
	invariant(job.__typename === "Job", "Expected job to be of type Job");

	return <JobDetail job={job} />;
}

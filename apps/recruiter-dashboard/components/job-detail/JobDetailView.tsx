import type { JobDetailViewFragment$key } from "@/__generated__/JobDetailViewFragment.graphql";
import PageJobDetailQuery, {
	type pageJobDetailQuery,
} from "@/__generated__/pageJobDetailQuery.graphql";
import links from "@/lib/links";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
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
            title
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

	return (
		<div className="p-8 w-full h-full max-w-7xl mx-auto overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-w-2.5 scrollbar-thumb-[hsl(var(--heroui-foreground-300))] scrollbar-track-transparent">
			<Breadcrumbs className="mb-6">
				<BreadcrumbItem href={links.dashboard}>Jobs</BreadcrumbItem>
				<BreadcrumbItem isCurrent>{job.title}</BreadcrumbItem>
			</Breadcrumbs>
			<JobDetail job={job} />
		</div>
	);
}

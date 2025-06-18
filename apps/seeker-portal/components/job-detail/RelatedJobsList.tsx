import type { RelatedJobsListFragment$key } from "@/__generated__/RelatedJobsListFragment.graphql";
import type { RelatedJobsListInternalFragment$key } from "@/__generated__/RelatedJobsListInternalFragment.graphql";
import type { pageJobDetailViewQuery } from "@/__generated__/pageJobDetailViewQuery.graphql";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import RelatedJob from "./RelatedJob";
import RelatedJobsListSkeleton from "./RelatedJobsListSkeleton";
const RelatedJobsListFragment = graphql`
  fragment RelatedJobsListFragment on Query @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
		organization(slug: $slug) {
		__typename
		... on Organization {
			job(slug: $jobSlug) {
				__typename
				... on Job {
					...RelatedJobsListInternalFragment
				}
			}
		}
	}
  }
`;

const RelatedJobsListInternalFragment = graphql`
  fragment RelatedJobsListInternalFragment on Job
  @refetchable(queryName: "RelatedJobsListInternalRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  ){
    relatedJobs(after: $cursor, first: $count)
      @connection(key: "RelatedJobsListInternalFragment_relatedJobs") {
      edges {
        node {
          id
          ...RelatedJobFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export default function RelatedJobsList({
	rootQuery,
}: {
	rootQuery: RelatedJobsListFragment$key;
}) {
	const root = useFragment(RelatedJobsListFragment, rootQuery);
	invariant(
		root.organization.__typename === "Organization",
		"Expected 'Organization' node type.",
	);
	invariant(
		root.organization.job.__typename === "Job",
		"Expected 'Job' node type.",
	);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		pageJobDetailViewQuery,
		RelatedJobsListInternalFragment$key
	>(RelatedJobsListInternalFragment, root.organization.job);

	const observerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.relatedJobs.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(25);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.relatedJobs.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	if (
		data.relatedJobs.edges.length === 0 &&
		!data.relatedJobs.pageInfo.hasNextPage
	) {
		return null;
	}

	return (
		<div className="h-full flex flex-col gap-4 shrink w-full lg:w-auto">
			<h2 className="font-medium text-foreground-600 flex items-center gap-2">
				<SearchIcon size={16} /> Related Jobs
			</h2>
			<div className="h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
				{data.relatedJobs.edges.map((jobEdge) => (
					<RelatedJob job={jobEdge.node} key={jobEdge.node.id} />
				))}
				<div ref={observerRef} className="h-10" />
				{isLoadingNext && <RelatedJobsListSkeleton />}
			</div>
		</div>
	);
}

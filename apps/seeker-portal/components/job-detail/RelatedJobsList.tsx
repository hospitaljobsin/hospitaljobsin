import type { RelatedJobsListFragment$key } from "@/__generated__/RelatedJobsListFragment.graphql";
import type { RelatedJobsListInternalFragment$key } from "@/__generated__/RelatedJobsListInternalFragment.graphql";
import type { pageJobDetailViewQuery } from "@/__generated__/pageJobDetailViewQuery.graphql";
import Job from "@/components/landing/Job";
import JobListSkeleton from "@/components/landing/JobListSkeleton";
import { Card, CardBody } from "@heroui/react";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
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
	}	viewer {
		__typename
		...JobControlsAuthFragment
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
          ...JobFragment
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
		return (
			<Card
				className="p-6"
				fullWidth
				shadow="none"
				style={{ background: "transparent" }}
			>
				<CardBody className="flex flex-col gap-6 w-full items-center">
					<div className="flex flex-col items-center">
						{/* Simple monochrome icon (e.g., magnifying glass) */}
						<Search className="text-foreground-800" size={35} />
					</div>
					<div className="w-full flex flex-col gap-2 items-center">
						<h2 className="font-medium text-muted-foreground text-base">
							No jobs found
						</h2>
						<p className="text-muted-foreground text-sm text-center max-w-xs">
							Try adjusting your search or filters to see more results.
						</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6 shrink">
			{data.relatedJobs.edges.map((jobEdge) => (
				<Job
					job={jobEdge.node}
					key={jobEdge.node.id}
					authQueryRef={root.viewer}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <JobListSkeleton />}
		</div>
	);
}

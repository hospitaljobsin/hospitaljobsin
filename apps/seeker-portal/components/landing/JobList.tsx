import type { JobListFragment$key } from "@/__generated__/JobListFragment.graphql";
import type { JobListInternalFragment$key } from "@/__generated__/JobListInternalFragment.graphql";
import type { pageLandingQuery } from "@/__generated__/pageLandingQuery.graphql";
import { Card, CardBody } from "@heroui/react";
import { Search } from "lucide-react";
import { useEffect, useRef, useTransition } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Job from "./Job";
import JobListSkeleton from "./JobListSkeleton";

const JobListFragment = graphql`
fragment JobListFragment on Query @argumentDefinitions(
	proximityKm: { type: "Float", defaultValue: null }
	searchTerm: { type: "String", defaultValue: null }
	coordinates: { type: "CoordinatesInput", defaultValue: null }
) {
	...JobListInternalFragment @arguments(searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm)
	viewer {
		...JobControlsAuthFragment
	}
}
`;

const JobListInternalFragment = graphql`
  fragment JobListInternalFragment on Query
  @refetchable(queryName: "JobListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
	proximityKm: { type: "Float", defaultValue: null }
    searchTerm: { type: "String", defaultValue: null }
	coordinates: { type: "CoordinatesInput", defaultValue: null }
    count: { type: "Int", defaultValue: 10 }
  ){
    jobs(after: $cursor, first: $count, searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm)
      @connection(key: "JobListFragment_jobs", filters: ["searchTerm", "coordinates", "proximityKm"]) {
      edges {
        node {
          id
          ...JobFragment
		  ...JobControlsFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: JobListFragment$key;
};

export default function JobList({ rootQuery }: Props) {
	const [_isPending, startTransition] = useTransition();
	const root = useFragment(JobListFragment, rootQuery);
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageLandingQuery,
		JobListInternalFragment$key
	>(JobListInternalFragment, root);

	const observerRef = useRef<HTMLDivElement | null>(null);

	const hasMountedRef = useRef(false);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.jobs.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(25);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.jobs.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	if (data.jobs.edges.length === 0 && !data.jobs.pageInfo.hasNextPage) {
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
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
			{data.jobs.edges.map((jobEdge) => (
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

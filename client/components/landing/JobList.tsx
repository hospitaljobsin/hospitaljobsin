import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { useEffect, useRef, useTransition } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Job from "./Job";
import JobListSkeleton from "./JobListSkeleton";
import type { JobListFragment$key } from "./__generated__/JobListFragment.graphql";
import type { JobListInternalFragment$key } from "./__generated__/JobListInternalFragment.graphql";
import type { LandingViewQuery } from "./__generated__/LandingViewQuery.graphql";

const JobListFragment = graphql`
fragment JobListFragment on Query {
	...JobListInternalFragment
	viewer {
		...JobControlsAuthFragment
	}
}
`;

const JobListInternalFragment = graphql`
  fragment JobListInternalFragment on Query
  @argumentDefinitions(
    cursor: { type: "ID" }
    searchTerm: { type: "String", defaultValue: null }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "JobListPaginationQuery") {
    jobs(after: $cursor, first: $count, searchTerm: $searchTerm)
      @connection(key: "JobListFragment_jobs", filters: ["searchTerm"]) {
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
	searchTerm: string | null;
};

export default function JobList({ rootQuery, searchTerm }: Props) {
	const [_isPending, startTransition] = useTransition();
	const root = useFragment(JobListFragment, rootQuery);
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		LandingViewQuery,
		JobListInternalFragment$key
	>(JobListInternalFragment, root);

	const observerRef = useRef<HTMLDivElement | null>(null);

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
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.jobs.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	// Debounced search term refetch
	useEffect(() => {
		const debounceTimeout = setTimeout(() => {
			startTransition(() => {
				refetch({ first: 10, searchTerm }, { fetchPolicy: "store-or-network" });
			});
		}, 300); // Adjust debounce delay as needed

		return () => clearTimeout(debounceTimeout);
	}, [searchTerm, refetch]);

	if (data.jobs.edges.length === 0 && !data.jobs.pageInfo.hasNextPage) {
		return (
			<Card className="p-6 space-y-6" fullWidth>
				<CardBody className="flex flex-col gap-8 w-full items-center">
					<Image
						src="/images/not-found.svg" // Add an illustration asset here
						alt="Not Found Illustration"
						width={350}
						height={350}
					/>
					<div className="w-full flex flex-col gap-4 items-center">
						<h2 className="font-medium text-muted-foreground text-lg">
							Oops! No results found
						</h2>
						<p className="text-muted-foreground text-md">
							Modify search criteria and try again
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

import { usePaginationFragment } from "react-relay";
import Job from "../landing/Job";

import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import SavedJobsListSkeleton from "../landing/JobListSkeleton";
import type { SavedJobsListFragment$key } from "./__generated__/SavedJobsListFragment.graphql";

const SavedJobsListFragment = graphql`
  fragment SavedJobsListFragment on Query
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "SavedJobsListPaginationQuery") {
    savedJobs(after: $cursor, first: $count)
      @connection(key: "SavedJobsListFragment_savedJobs") {
      __id
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

type Props = {
	rootQuery: SavedJobsListFragment$key;
};

export default function SavedJobsList({ rootQuery }: Props) {
	const { data, loadNext, isLoadingNext } = usePaginationFragment(
		SavedJobsListFragment,
		rootQuery,
	);

	const observerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.savedJobs.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.savedJobs.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	if (
		data.savedJobs.edges.length === 0 &&
		!data.savedJobs.pageInfo.hasNextPage
	) {
		return (
			<div className="flex grow flex-col gap-8 px-4 items-center h-full">
				<p className="font-medium text-muted-foreground">
					Hmm, no jobs could be found
				</p>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.savedJobs.edges.map((jobEdge) => (
				<Job
					job={jobEdge.node}
					connectionId={data.savedJobs.__id}
					key={jobEdge.node.id}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <SavedJobsListSkeleton />}
		</div>
	);
}

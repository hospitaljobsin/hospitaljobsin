import { BriefcaseBusiness } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { pageSavedJobsQuery } from "@/__generated__/pageSavedJobsQuery.graphql";
import type { SavedJobsListFragment$key } from "@/__generated__/SavedJobsListFragment.graphql";
import type { SavedJobsListInternalFragment$key } from "@/__generated__/SavedJobsListInternalFragment.graphql";
import Job from "@/components/landing/Job";
import SavedJobsListSkeleton from "@/components/landing/JobListSkeleton";

const SavedJobsListFragment = graphql`
fragment SavedJobsListFragment on Query {
		...SavedJobsListInternalFragment
	viewer {
		...JobControlsAuthFragment
	}
}
`;

const SavedJobsListInternalFragment = graphql`
  fragment SavedJobsListInternalFragment on Query
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "SavedJobsListPaginationQuery") {
    savedJobs(after: $cursor, first: $count)
      @connection(key: "SavedJobListFragment_savedJobs") {
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
	const root = useFragment(SavedJobsListFragment, rootQuery);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		pageSavedJobsQuery,
		SavedJobsListInternalFragment$key
	>(SavedJobsListInternalFragment, root);

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
					loadNext(25);
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
			<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6 border-2 border-dashed border-foreground-300 rounded-md p-6 items-center justify-center">
				<div className="flex flex-col gap-4 items-center text-foreground-600">
					<BriefcaseBusiness size={48} />
					<h2 className="text-lg font-medium">No saved jobs Yet</h2>
					<p className="text-sm text-foreground-500 text-center">
						Your saved jobs will appear here.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.savedJobs.edges.map((jobEdge) => (
				<Job
					job={jobEdge.node}
					key={jobEdge.node.id}
					authQueryRef={root.viewer}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <SavedJobsListSkeleton />}
		</div>
	);
}

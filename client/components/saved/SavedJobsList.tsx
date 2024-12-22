import { useFragment, usePaginationFragment } from "react-relay";
import Job from "../landing/Job";

import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import SavedJobsListSkeleton from "../landing/JobListSkeleton";
import type { SavedJobsListFragment$key } from "./__generated__/SavedJobsListFragment.graphql";
import type {
	SavedJobsListInternalFragment$key,
	SavedJobsListInternalFragment as SavedJobsListInternalFragmentType,
} from "./__generated__/SavedJobsListInternalFragment.graphql";

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
		SavedJobsListInternalFragmentType,
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
			<Card className="p-6 space-y-6" fullWidth shadow="sm">
				<CardBody className="flex flex-col gap-8 w-full items-center">
					<Image
						src="/images/bookmark.svg" // Add an illustration asset here
						alt="Not Found Illustration"
						width={350}
						height={350}
					/>
					<div className="w-full flex flex-col gap-4 items-center">
						<h2 className="font-medium text-muted-foreground text-lg">
							No saved jobs found
						</h2>
						<p className="text-muted-foreground text-md">
							Your saved jobs will appear here
						</p>
					</div>
				</CardBody>
			</Card>
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

import Job from "@/components/landing/Job";
import { useFragment, usePaginationFragment } from "react-relay";

import type { AppliedJobsListFragment$key } from "@/__generated__/AppliedJobsListFragment.graphql";

import type { AppliedJobsListInternalFragment$key } from "@/__generated__/AppliedJobsListInternalFragment.graphql";
import type { AppliedViewQuery } from "@/__generated__/AppliedViewQuery.graphql";
import AppliedJobsListSkeleton from "@/components/landing/JobListSkeleton";
import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";

const AppliedJobsListFragment = graphql`
fragment AppliedJobsListFragment on Query {
	...AppliedJobsListInternalFragment
	viewer {
		...JobControlsAuthFragment
	}
}
`;

const AppliedJobsListInternalFragment = graphql`
  fragment AppliedJobsListInternalFragment on Query
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "AppliedJobsListPaginationQuery") {
    appliedJobs(after: $cursor, first: $count)
      @connection(key: "AppliedJobListFragment_appliedJobs") {
      edges {
        node {
          id
		  job @required(action: THROW) {
          	...JobFragment
		  }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: AppliedJobsListFragment$key;
};

export default function AppliedJobsList({ rootQuery }: Props) {
	const root = useFragment(AppliedJobsListFragment, rootQuery);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		AppliedViewQuery,
		AppliedJobsListInternalFragment$key
	>(AppliedJobsListInternalFragment, root);

	const observerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.appliedJobs.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.appliedJobs.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	if (
		data.appliedJobs.edges.length === 0 &&
		!data.appliedJobs.pageInfo.hasNextPage
	) {
		return (
			<Card className="p-6 space-y-6" fullWidth shadow="none">
				<CardBody className="flex flex-col gap-8 w-full items-center">
					<Image
						src="/images/bookmark.svg" // Add an illustration asset here
						alt="Not Found Illustration"
						width={350}
						height={350}
					/>
					<div className="w-full flex flex-col gap-4 items-center">
						<h2 className="font-medium text-muted-foreground text-lg">
							No applied jobs found
						</h2>
						<p className="text-muted-foreground text-md">
							Your applied jobs will appear here
						</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.appliedJobs.edges.map((jobEdge) => (
				<Job
					job={jobEdge.node.job}
					key={jobEdge.node.id}
					authQueryRef={root.viewer}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <AppliedJobsListSkeleton />}
		</div>
	);
}

import Job from "@/components/landing/Job";
import { useFragment, usePaginationFragment } from "react-relay";

import type { AppliedJobsListFragment$key } from "@/__generated__/AppliedJobsListFragment.graphql";

import type { AppliedJobsListInternalFragment$key } from "@/__generated__/AppliedJobsListInternalFragment.graphql";
import type { pageAppliedJobsQuery } from "@/__generated__/pageAppliedJobsQuery.graphql";
import AppliedJobsListSkeleton from "@/components/landing/JobListSkeleton";
import { BriefcaseBusiness } from "lucide-react";
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
		pageAppliedJobsQuery,
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
					loadNext(25);
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
			<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6 border-2 border-dashed border-foreground-300 rounded-md p-6 items-center justify-center">
				<div className="flex flex-col gap-4 items-center text-foreground-600">
					<BriefcaseBusiness size={48} />
					<h2 className="text-lg font-medium">No applied jobs Yet</h2>
					<p className="text-sm text-foreground-500 text-center">
						Jobs you applied to will appear here.
					</p>
				</div>
			</div>
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

import { usePaginationFragment } from "react-relay";
import Job from "../landing/Job";

import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import JobListSkeleton from "../landing/JobListSkeleton";
import type { CompanyJobsListFragment$key } from "./__generated__/CompanyJobsListFragment.graphql";

const CompanyJobsListFragment = graphql`
  fragment CompanyJobsListFragment on Company
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "CompanyJobsListPaginationQuery") {
    jobs(after: $cursor, first: $count)
      @connection(key: "CompanyJobsListFragment_jobs") {
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
	rootQuery: CompanyJobsListFragment$key;
};

export default function CompanyJobsList({ rootQuery }: Props) {
	const { data, loadNext, isLoadingNext } = usePaginationFragment(
		CompanyJobsListFragment,
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

	if (data.jobs.edges.length === 0 && !data.jobs.pageInfo.hasNextPage) {
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
			{data.jobs.edges.map((jobEdge) => (
				<Job
					job={jobEdge.node}
					connectionId={data.jobs.__id}
					key={jobEdge.node.id}
				/>
			))}
			<div ref={observerRef} className="h-10"></div>
			{isLoadingNext && <JobListSkeleton />}
		</div>
	);
}

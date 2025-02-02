import { useFragment, usePaginationFragment } from "react-relay";
import Job from "../landing/Job";

import type { pageCompanyDetailViewQuery } from "@/app/(landing)/(dashboard)/companies/[slug]/__generated__/pageCompanyDetailViewQuery.graphql";
import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import JobListSkeleton from "../landing/JobListSkeleton";
import type { CompanyJobsListFragment$key } from "./__generated__/CompanyJobsListFragment.graphql";
import type { CompanyJobsListInternalFragment$key } from "./__generated__/CompanyJobsListInternalFragment.graphql";

const CompanyJobsListFragment = graphql`
fragment CompanyJobsListFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    )  {
		company(slug: $slug) {
			__typename
			... on Company {
				...CompanyJobsListInternalFragment
			}
		}
	...JobListInternalFragment
	viewer {
		...JobControlsAuthFragment
	}
}
`;

const CompanyJobsListInternalFragment = graphql`
  fragment CompanyJobsListInternalFragment on Company
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "CompanyJobsListPaginationQuery") {
    jobs(after: $cursor, first: $count)
      @connection(key: "CompanyJobsListInternalFragment_jobs") {
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
	const root = useFragment(CompanyJobsListFragment, rootQuery);
	invariant(
		root.company.__typename === "Company",
		"Expected 'Company' node type",
	);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		pageCompanyDetailViewQuery,
		CompanyJobsListInternalFragment$key
	>(CompanyJobsListInternalFragment, root.company);

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
					key={jobEdge.node.id}
					authQueryRef={root.viewer}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <JobListSkeleton />}
		</div>
	);
}

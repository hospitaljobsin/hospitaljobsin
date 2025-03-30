import { useFragment, usePaginationFragment } from "react-relay";

import type { OrganizationJobsListFragment$key } from "@/__generated__/OrganizationJobsListFragment.graphql";
import type { OrganizationJobsListInternalFragment$key } from "@/__generated__/OrganizationJobsListInternalFragment.graphql";
import type { pageOrganizationDetailViewQuery } from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Job from "./Job";
import OrganizationJobsListSkeleton from "./OrganizationJobsListSkeleton";

const OrganizationJobsListFragment = graphql`
fragment OrganizationJobsListFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    )  {
        organization(slug: $slug) {
            __typename
            ... on Organization {
            ...OrganizationJobsListInternalFragment
            }
        }
}
`;

const OrganizationJobsListInternalFragment = graphql`
  fragment OrganizationJobsListInternalFragment on Organization
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "OrganizationJobsListPaginationQuery") {
    jobs(after: $cursor, first: $count)
      @connection(key: "OrganizationJobsListInternalFragment_jobs") {
      edges {
		node {
			id
		}
        ...JobFragment
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: OrganizationJobsListFragment$key;
};

export default function OrganizationJobsList({ rootQuery }: Props) {
	const root = useFragment(OrganizationJobsListFragment, rootQuery);
	invariant(
		root.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		pageOrganizationDetailViewQuery,
		OrganizationJobsListInternalFragment$key
	>(OrganizationJobsListInternalFragment, root.organization);

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
					Hmm, no Jobs could be found
				</p>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.jobs.edges.map((jobEdge) => (
				<Job job={jobEdge} key={jobEdge.node.id} />
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <OrganizationJobsListSkeleton />}
		</div>
	);
}

import { useFragment, usePaginationFragment } from "react-relay";
import Job from "./Job";

import type { OrganizationJobsListFragment$key } from "@/__generated__/OrganizationJobsListFragment.graphql";
import type { OrganizationJobsListInternalFragment$key } from "@/__generated__/OrganizationJobsListInternalFragment.graphql";
import type { pageOrganizationDetailViewQuery } from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import JobListSkeleton from "./JobListSkeleton";

const OrganizationJobsListFragment = graphql`
fragment OrganizationJobsListFragment on Query @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
      searchTerm: { type: "String", defaultValue: null }
	)  {
		organization(slug: $slug) {
			__typename
			... on Organization {
				...OrganizationJobsListInternalFragment  @arguments(searchTerm: $searchTerm)
			}
		}
}
`;

const OrganizationJobsListInternalFragment = graphql`
  fragment OrganizationJobsListInternalFragment on Organization
  @argumentDefinitions(
	cursor: { type: "ID" }
	count: { type: "Int", defaultValue: 10 }
	searchTerm: { type: "String", defaultValue: null }
  )
  @refetchable(queryName: "OrganizationJobsListPaginationQuery") {
	jobs(after: $cursor, first: $count, searchTerm: $searchTerm)
	  @connection(key: "OrganizationJobsListInternalFragment_jobs", filters: ["searchTerm"]) {
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
	rootQuery: OrganizationJobsListFragment$key;
	searchTerm: string | null;
};

export default function OrganizationJobsList({ rootQuery, searchTerm }: Props) {
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
		return null;
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.jobs.edges.map((jobEdge) => (
				<Job job={jobEdge.node} key={jobEdge.node.id} />
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <JobListSkeleton />}
		</div>
	);
}

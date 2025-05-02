import { useFragment, usePaginationFragment } from "react-relay";
import Job from "../../landing/Job";

import type { OrganizationJobsListFragment$key } from "@/__generated__/OrganizationJobsListFragment.graphql";
import type { OrganizationJobsListInternalFragment$key } from "@/__generated__/OrganizationJobsListInternalFragment.graphql";
import type { pageOrganizationDetailViewQuery } from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
import { Briefcase } from "lucide-react";
import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import JobListSkeleton from "../../landing/JobListSkeleton";

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
	viewer {
		...JobControlsAuthFragment
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
          ...JobFragment @arguments(showOrganization: false)
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
					loadNext(25);
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
		<div className="w-full flex flex-col gap-6">
			<div className="w-full flex items-center gap-4 px-2 text-foreground-600">
				<Briefcase className="w-5 h-5" />
				<p>Posted Jobs</p>
			</div>
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
		</div>
	);
}

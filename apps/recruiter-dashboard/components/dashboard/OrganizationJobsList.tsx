import type { OrganizationJobsListFragment$key } from "@/__generated__/OrganizationJobsListFragment.graphql";
import type { OrganizationJobsListInternalFragment$key } from "@/__generated__/OrganizationJobsListInternalFragment.graphql";
import type { pageDashboardViewQuery } from "@/__generated__/pageDashboardViewQuery.graphql";
import links from "@/lib/links";
import { Button, Link } from "@heroui/react";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { startTransition, useEffect, useRef } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Job from "./Job";
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
	const { slug } = useParams<{ slug: string }>();
	const root = useFragment(OrganizationJobsListFragment, rootQuery);
	invariant(
		root.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageDashboardViewQuery,
		OrganizationJobsListInternalFragment$key
	>(OrganizationJobsListInternalFragment, root.organization);

	const observerRef = useRef<HTMLDivElement | null>(null);

	const hasMountedRef = useRef(false);

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

	// Debounced search term refetch
	useEffect(() => {
		if (!hasMountedRef.current) {
			// don't refetch on first render
			hasMountedRef.current = true;
			return;
		}
		const debounceTimeout = setTimeout(() => {
			startTransition(() => {
				refetch(
					{ searchTerm: searchTerm },
					{ fetchPolicy: "store-or-network" },
				);
			});
		}, 300); // Adjust debounce delay as needed

		return () => clearTimeout(debounceTimeout);
	}, [refetch, searchTerm]);

	if (data.jobs.edges.length === 0 && !data.jobs.pageInfo.hasNextPage) {
		return (
			<div className="w-full flex flex-col items-center justify-center gap-8 py-12 px-6 border-dashed border-foreground-300 border-2 rounded-lg">
				<div className="p-4 rounded-full bg-primary/10">
					<BriefcaseBusiness className="w-8 h-8 text-primary" />
				</div>
				<div className="flex flex-col items-center gap-4">
					<h3 className="font-medium text-lg">No jobs found</h3>
					<Button
						as={Link}
						href={links.organizationCreateJob(slug)}
						color="primary"
						startContent={<Plus size={25} />}
						className="w-full sm:w-auto"
					>
						Add a job
					</Button>
				</div>
			</div>
		);
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

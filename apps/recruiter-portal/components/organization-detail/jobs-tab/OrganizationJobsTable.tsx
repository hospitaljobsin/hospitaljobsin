import { useFragment, usePaginationFragment } from "react-relay";

import type { OrganizationJobsTableFragment$key } from "@/__generated__/OrganizationJobsTableFragment.graphql";
import type { OrganizationJobsTableInternalFragment$key } from "@/__generated__/OrganizationJobsTableInternalFragment.graphql";
import type { pageOrganizationJobsViewQuery } from "@/__generated__/pageOrganizationJobsViewQuery.graphql";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	getKeyValue,
} from "@heroui/react";
import { startTransition, useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const OrganizationJobsTableFragment = graphql`
fragment OrganizationJobsTableFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
      searchTerm: { type: "String", defaultValue: null }
    )  {
        organization(slug: $slug) {
            __typename
            ... on Organization {
            ...OrganizationJobsTableInternalFragment @arguments(searchTerm: $searchTerm)
            }
        }
}
`;

const OrganizationJobsTableInternalFragment = graphql`
  fragment OrganizationJobsTableInternalFragment on Organization
  @argumentDefinitions(
    cursor: { type: "ID" }
	searchTerm: { type: "String", defaultValue: null }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "OrganizationJobsTablePaginationQuery") {
    jobs(after: $cursor, first: $count, searchTerm: $searchTerm)
      @connection(key: "OrganizationJobsTableInternalFragment_jobs", filters: ["searchTerm"]) {
      edges {
		node {
			id
			title
		}
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: OrganizationJobsTableFragment$key;
	searchTerm: string | null;
};

const columns = [
	{
		key: "title",
		label: "Title",
	},
];

export default function OrganizationJobsTable({
	rootQuery,
	searchTerm,
}: Props) {
	const root = useFragment(OrganizationJobsTableFragment, rootQuery);
	invariant(
		root.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageOrganizationJobsViewQuery,
		OrganizationJobsTableInternalFragment$key
	>(OrganizationJobsTableInternalFragment, root.organization);

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

	// Debounced search term refetch
	useEffect(() => {
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

	return (
		<Table
			bottomContent={<div ref={observerRef} className="h-10" />}
			shadow="none"
		>
			<TableHeader columns={columns}>
				{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
			</TableHeader>
			<TableBody items={data.jobs.edges} emptyContent={<p>No jobs found</p>}>
				{(jobEdge) => (
					<TableRow key={jobEdge.node.id}>
						{(columnKey) => (
							<TableCell>{getKeyValue(jobEdge.node, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

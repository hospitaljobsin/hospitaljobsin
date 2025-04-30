import { useFragment, usePaginationFragment } from "react-relay";

import type { OrganizationMembersListFragment$key } from "@/__generated__/OrganizationMembersListFragment.graphql";
import type { OrganizationMembersListInternalFragment$key } from "@/__generated__/OrganizationMembersListInternalFragment.graphql";
import type { pageOrganizationMembersViewQuery } from "@/__generated__/pageOrganizationMembersViewQuery.graphql";
import { startTransition, useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Member from "./Member";
import OrganizationMembersListSkeleton from "./OrganizationMembersListSkeleton";

const OrganizationMembersListFragment = graphql`
fragment OrganizationMembersListFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  searchTerm: { type: "String", defaultValue: null }
    )  {
        organization(slug: $slug) {
            __typename
            ... on Organization {
            ...OrganizationMembersListInternalFragment @arguments(searchTerm: $searchTerm)
			...MemberOrganizationFragment
            }
        }
		viewer {
			__typename
			... on Account {
				...MemberAccountFragment
			}
		}
}
`;

const OrganizationMembersListInternalFragment = graphql`
  fragment OrganizationMembersListInternalFragment on Organization
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
	searchTerm: { type: "String", defaultValue: null }
  )
  @refetchable(queryName: "OrganizationMembersListPaginationQuery") {
	  members(after: $cursor, first: $count, searchTerm: $searchTerm)
      @connection(key: "OrganizationMembersListInternalFragment_members", filters: ["searchTerm"]) {
		__id
      edges {
		node {
			id
		}
        ...MemberFragment
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: OrganizationMembersListFragment$key;
	searchTerm: string | null;
};

export default function OrganizationMembersList({
	rootQuery,
	searchTerm,
}: Props) {
	const root = useFragment(OrganizationMembersListFragment, rootQuery);
	const organization = root.organization;
	invariant(
		organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);

	const account = root.viewer;

	invariant(account.__typename === "Account", "Expected 'Account' node type");

	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageOrganizationMembersViewQuery,
		OrganizationMembersListInternalFragment$key
	>(OrganizationMembersListInternalFragment, organization);

	const observerRef = useRef<HTMLDivElement | null>(null);

	const hasMountedRef = useRef(false);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.members.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.members.pageInfo.hasNextPage, isLoadingNext, loadNext]);

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

	if (data.members.edges.length === 0 && !data.members.pageInfo.hasNextPage) {
		return (
			<div className="flex grow flex-col gap-8 px-4 items-center h-full">
				<p className="font-medium text-muted-foreground">
					Hmm, no members could be found
				</p>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.members.edges.map((memberEdge) => (
				<Member
					member={memberEdge}
					organization={organization}
					key={memberEdge.node.id}
					membersConnectionId={data.members.__id}
					account={account}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <OrganizationMembersListSkeleton />}
		</div>
	);
}

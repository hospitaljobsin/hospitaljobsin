import { useFragment, usePaginationFragment } from "react-relay";

import type { OrganizationInvitesListFragment$key } from "@/__generated__/OrganizationInvitesListFragment.graphql";
import type { OrganizationInvitesListInternalFragment$key } from "@/__generated__/OrganizationInvitesListInternalFragment.graphql";
import type { pageOrganizationInvitesViewQuery } from "@/__generated__/pageOrganizationInvitesViewQuery.graphql";
import { startTransition, useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Invite from "./Invite";
import OrganizationInvitesListSkeleton from "./OrganizationInvitesListSkeleton";

const OrganizationInvitesListFragment = graphql`
fragment OrganizationInvitesListFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  searchTerm: { type: "String", defaultValue: null }
    )  {
        organization(slug: $slug) {
            __typename
            ... on Organization {
            ...OrganizationInvitesListInternalFragment @arguments(searchTerm: $searchTerm)
			...InviteOrganizationFragment
            }
        }
}
`;

const OrganizationInvitesListInternalFragment = graphql`
  fragment OrganizationInvitesListInternalFragment on Organization
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
	searchTerm: { type: "String", defaultValue: null }
  )
  @refetchable(queryName: "OrganizationInvitesListPaginationQuery") {
	  invites(after: $cursor, first: $count, searchTerm: $searchTerm)
      @connection(key: "OrganizationInvitesListInternalFragment_invites", filters: ["searchTerm"]) {
	  __id
      edges {
		node {
			id
			...InviteFragment
		}

      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: OrganizationInvitesListFragment$key;
	searchTerm: string | null;
};

export default function OrganizationInvitesList({
	rootQuery,
	searchTerm,
}: Props) {
	const root = useFragment(OrganizationInvitesListFragment, rootQuery);
	invariant(
		root.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageOrganizationInvitesViewQuery,
		OrganizationInvitesListInternalFragment$key
	>(OrganizationInvitesListInternalFragment, root.organization);

	const observerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.invites.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.invites.pageInfo.hasNextPage, isLoadingNext, loadNext]);

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

	if (data.invites.edges.length === 0 && !data.invites.pageInfo.hasNextPage) {
		return (
			<div className="flex grow flex-col gap-8 px-4 items-center h-full">
				<p className="font-medium text-muted-foreground">
					Hmm, no invites could be found
				</p>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.invites.edges.map((inviteEdge) => (
				<Invite
					invite={inviteEdge.node}
					key={inviteEdge.node.id}
					organization={root.organization}
					invitesConnectionId={data.invites.__id}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <OrganizationInvitesListSkeleton />}
		</div>
	);
}

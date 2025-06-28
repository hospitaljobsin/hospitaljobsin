import { useFragment, usePaginationFragment } from "react-relay";

import type { OrganizationInvitesListFragment$key } from "@/__generated__/OrganizationInvitesListFragment.graphql";
import type { OrganizationInvitesListInternalFragment$key } from "@/__generated__/OrganizationInvitesListInternalFragment.graphql";
import type { pageOrganizationInviteSettingsQuery } from "@/__generated__/pageOrganizationInviteSettingsQuery.graphql";
import { BriefcaseBusiness } from "lucide-react";
import { startTransition, useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import Invite from "./Invite";
import OrganizationInvitesListSkeleton from "./OrganizationInvitesListSkeleton";

const OrganizationInvitesListFragment = graphql`
fragment OrganizationInvitesListFragment on Organization @argumentDefinitions(searchTerm: { type: "String", defaultValue: null }) {
	...OrganizationInvitesListInternalFragment @arguments(searchTerm: $searchTerm)
	...InviteOrganizationFragment
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
	organization: OrganizationInvitesListFragment$key;
	searchTerm: string | null;
};

export default function OrganizationInvitesList({
	organization,
	searchTerm,
}: Props) {
	const root = useFragment(OrganizationInvitesListFragment, organization);

	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageOrganizationInviteSettingsQuery,
		OrganizationInvitesListInternalFragment$key
	>(OrganizationInvitesListInternalFragment, root);

	const observerRef = useRef<HTMLDivElement | null>(null);

	const hasMountedRef = useRef(false);

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
					loadNext(25);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.invites.pageInfo.hasNextPage, isLoadingNext, loadNext]);

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

	if (data.invites.edges.length === 0 && !data.invites.pageInfo.hasNextPage) {
		return (
			<div className="w-full flex flex-col items-center justify-center gap-8 border-dashed border-foreground-300 border-2 rounded-lg py-8">
				<div className="p-4 rounded-full bg-primary/10">
					<BriefcaseBusiness className="w-8 h-8 text-primary" />
				</div>
				<div className="flex flex-col items-center gap-4">
					<h3 className="font-medium text-lg">No invites found</h3>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{data.invites.edges.map((inviteEdge) => (
				<Invite
					invite={inviteEdge.node}
					key={inviteEdge.node.id}
					organization={root}
					invitesConnectionId={data.invites.__id}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <OrganizationInvitesListSkeleton />}
		</div>
	);
}

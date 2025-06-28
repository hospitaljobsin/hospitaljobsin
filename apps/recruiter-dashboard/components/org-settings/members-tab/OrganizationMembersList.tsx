import { useFragment, usePaginationFragment } from "react-relay";

import type { OrganizationMembersListAccountFragment$key } from "@/__generated__/OrganizationMembersListAccountFragment.graphql";
import type { OrganizationMembersListFragment$key } from "@/__generated__/OrganizationMembersListFragment.graphql";
import type { OrganizationMembersListInternalFragment$key } from "@/__generated__/OrganizationMembersListInternalFragment.graphql";
import type { pageOrganizationMemberSettingsQuery } from "@/__generated__/pageOrganizationMemberSettingsQuery.graphql";
import { startTransition, useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import Member from "./Member";
import OrganizationMembersListSkeleton from "./OrganizationMembersListSkeleton";

const OrganizationMembersListAccountFragment = graphql`
fragment OrganizationMembersListAccountFragment on Account {
	...MemberAccountFragment
}
`;

const OrganizationMembersListFragment = graphql`
fragment OrganizationMembersListFragment on Organization @argumentDefinitions(searchTerm: { type: "String", defaultValue: null }) {
	...OrganizationMembersListInternalFragment @arguments(searchTerm: $searchTerm)
	...MemberOrganizationFragment
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
	organization: OrganizationMembersListFragment$key;
	account: OrganizationMembersListAccountFragment$key;
	searchTerm: string | null;
};

export default function OrganizationMembersList({
	organization,
	account,
	searchTerm,
}: Props) {
	const organizationData = useFragment(
		OrganizationMembersListInternalFragment,
		organization,
	);

	const accountData = useFragment(
		OrganizationMembersListAccountFragment,
		account,
	);

	const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment<
		pageOrganizationMemberSettingsQuery,
		OrganizationMembersListInternalFragment$key
	>(OrganizationMembersListInternalFragment, organizationData);

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
					loadNext(25);
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
					organization={organizationData}
					key={memberEdge.node.id}
					membersConnectionId={data.members.__id}
					account={accountData}
				/>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <OrganizationMembersListSkeleton />}
		</div>
	);
}

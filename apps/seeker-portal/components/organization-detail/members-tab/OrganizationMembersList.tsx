import { useFragment, usePaginationFragment } from "react-relay";

import type { OrganizationMembersListFragment$key } from "@/__generated__/OrganizationMembersListFragment.graphql";
import type { OrganizationMembersListInternalFragment$key } from "@/__generated__/OrganizationMembersListInternalFragment.graphql";
import type { pageOrganizationDetailViewQuery } from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
import { useEffect, useRef } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Member from "./Member";
import OrganizationMembersListSkeleton from "./OrganizationMembersListSkeleton";

const OrganizationMembersListFragment = graphql`
fragment OrganizationMembersListFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    )  {
        organization(slug: $slug) {
            __typename
            ... on Organization {
            ...OrganizationMembersListInternalFragment
            }
        }
}
`;

const OrganizationMembersListInternalFragment = graphql`
  fragment OrganizationMembersListInternalFragment on Organization
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "OrganizationMembersListPaginationQuery") {
    members(after: $cursor, first: $count)
      @connection(key: "OrganizationMembersListInternalFragment_members") {
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
};

export default function OrganizationMembersList({ rootQuery }: Props) {
	const root = useFragment(OrganizationMembersListFragment, rootQuery);
	invariant(
		root.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		pageOrganizationDetailViewQuery,
		OrganizationMembersListInternalFragment$key
	>(OrganizationMembersListInternalFragment, root.organization);

	const observerRef = useRef<HTMLDivElement | null>(null);

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
				<Member member={memberEdge} key={memberEdge.node.id} />
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <OrganizationMembersListSkeleton />}
		</div>
	);
}

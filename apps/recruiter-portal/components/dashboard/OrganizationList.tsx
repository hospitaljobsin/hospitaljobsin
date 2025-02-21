import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { useEffect, useRef, useTransition } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Organization from "./Organization";
import OrganizationListSkeleton from "./OrganizationListSkeleton";
import type { DashboardViewQuery } from "./__generated__/DashboardViewQuery.graphql";
import type { OrganizationListFragment$key } from "./__generated__/OrganizationListFragment.graphql";
import type { OrganizationListInternalFragment$key } from "./__generated__/OrganizationListInternalFragment.graphql";

const OrganizationListFragment = graphql`
fragment OrganizationListFragment on Query {
	viewer {
		__typename
		... on Account {
			...OrganizationListInternalFragment
		}
	}
}
`;

const OrganizationListInternalFragment = graphql`
  fragment OrganizationListInternalFragment on Account
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "OrganizationListPaginationQuery") {
    organizations(after: $cursor, first: $count)
      @connection(key: "OrganizationListFragment_organizations") {
      edges {
        node {
          id
          ...OrganizationFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: OrganizationListFragment$key;
};

export default function OrganizationList({ rootQuery }: Props) {
	const [_isPending, startTransition] = useTransition();
	const root = useFragment(OrganizationListFragment, rootQuery);
	invariant(root.viewer.__typename === "Account", "Expected Account type");

	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		DashboardViewQuery,
		OrganizationListInternalFragment$key
	>(OrganizationListInternalFragment, root.viewer);

	const observerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (
					entry.isIntersecting &&
					data.organizations.pageInfo.hasNextPage &&
					!isLoadingNext
				) {
					loadNext(5);
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.organizations.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	if (
		data.organizations.edges.length === 0 &&
		!data.organizations.pageInfo.hasNextPage
	) {
		return (
			<Card className="p-6 space-y-6" fullWidth shadow="none">
				<CardBody className="flex flex-col gap-8 w-full items-center">
					<Image
						src="/images/not-found.svg" // Add an illustration asset here
						alt="Not Found Illustration"
						width={350}
						height={350}
					/>
					<div className="w-full flex flex-col gap-4 items-center">
						<h2 className="font-medium text-muted-foreground text-lg">
							Oops! No results found
						</h2>
						<p className="text-muted-foreground text-md">
							Modify search criteria and try again
						</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
			{data.organizations.edges.map((jobEdge) => (
				<Organization organization={jobEdge.node} key={jobEdge.node.id} />
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <OrganizationListSkeleton />}
		</div>
	);
}

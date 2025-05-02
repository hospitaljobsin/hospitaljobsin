import type { DashboardViewQuery } from "@/__generated__/DashboardViewQuery.graphql";
import type { OrganizationListFragment$key } from "@/__generated__/OrganizationListFragment.graphql";
import type { OrganizationListInternalFragment$key } from "@/__generated__/OrganizationListInternalFragment.graphql";
import links from "@/lib/links";
import { Button, Link } from "@heroui/react";
import { Building, PlusIcon } from "lucide-react";
import { useEffect, useRef, useTransition } from "react";
import { useFragment, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Organization from "./Organization";
import OrganizationListSkeleton from "./OrganizationListSkeleton";

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
					loadNext(25);
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
			<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6 border-2 border-dashed border-foreground-300 rounded-md p-6 items-center justify-center">
				<div className="flex flex-col gap-4 items-center text-foreground-600">
					<Building size={48} />
					<h2 className="text-lg font-medium">No Organizations Yet</h2>
					<p className="text-sm text-foreground-500 text-center">
						Get started by creating your first organization.
					</p>
				</div>
				<Button
					as={Link}
					href={links.createOrganization}
					startContent={<PlusIcon className="h-4 w-4" />}
				>
					Create Organization
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
			<div className="flex w-full gap-6 justify-between items-center">
				<div className="flex gap-4 items-center text-foreground-600">
					<Building size={24} />
					<h2 className="text-base font-medium">Your Organizations</h2>
				</div>
				<Button
					as={Link}
					href={links.createOrganization}
					startContent={<PlusIcon className="h-4 w-4" />}
				>
					Create Organization
				</Button>
			</div>
			{data.organizations.edges.map((jobEdge) => (
				<Organization organization={jobEdge.node} key={jobEdge.node.id} />
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <OrganizationListSkeleton />}
		</div>
	);
}

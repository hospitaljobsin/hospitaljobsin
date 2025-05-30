import type { HeaderOrganizationListFragment$key } from "@/__generated__/HeaderOrganizationListFragment.graphql";
import type { pageDashboardQuery } from "@/__generated__/pageDashboardQuery.graphql";
import { DropdownItem, DropdownSection } from "@heroui/react";
import Image from "next/image";
import { useEffect, useRef, useTransition } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import HeaderOrganizationListSkeleton from "./HeaderOrganizationListSkeleton";

const HeaderOrganizationListFragment = graphql`
  fragment HeaderOrganizationListFragment on Account
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "HeaderOrganizationListPaginationQuery") {
    organizations(after: $cursor, first: $count)
      @connection(key: "HeaderOrganizationListFragment_organizations") {
      edges {
        node {
          id
          name
          logoUrl
          slug
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	account: HeaderOrganizationListFragment$key;
};

export default function HeaderOrganizationList({ account }: Props) {
	const [_isPending, startTransition] = useTransition();
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		pageDashboardQuery,
		HeaderOrganizationListFragment$key
	>(HeaderOrganizationListFragment, account);

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
		return null;
	}

	// TODO: remove this implementation
	// dynamic items need to be implemented like this: https://www.heroui.com/docs/components/dropdown#dynamic-items
	return (
		<DropdownSection showDivider>
			{data.organizations.edges.map((jobEdge) => (
				<DropdownItem
					key={jobEdge.node.id}
					startContent={
						<div className="relative h-8 w-8">
							<Image
								src={jobEdge.node.logoUrl}
								alt="Organization Logo"
								fill
								className="rounded-md object-cover"
								sizes="20vw"
							/>
						</div>
					}
				>
					{jobEdge.node.name}
				</DropdownItem>
			))}
			<div ref={observerRef} className="h-10" />
			{isLoadingNext && <HeaderOrganizationListSkeleton />}
		</DropdownSection>
	);
}

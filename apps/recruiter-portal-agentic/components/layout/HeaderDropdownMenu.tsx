import type { HeaderDropdownMenuFragment$key } from "@/__generated__/HeaderDropdownMenuFragment.graphql";
import type { pageDashboardQuery } from "@/__generated__/pageDashboardQuery.graphql";
import links from "@/lib/links";
import { DropdownItem, DropdownMenu, DropdownSection } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useTransition } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import HeaderOrganizationListSkeleton from "./HeaderOrganizationListSkeleton";

const HeaderDropdownMenuFragment = graphql`
  fragment HeaderDropdownMenuFragment on Account
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "HeaderDropdownMenuPaginationQuery") {
    organizations(after: $cursor, first: $count)
      @connection(key: "HeaderDropdownMenuFragment_organizations") {
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
	account: HeaderDropdownMenuFragment$key;
};

export default function HeaderDropdownMenu({ account }: Props) {
	const [_isPending, startTransition] = useTransition();
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		pageDashboardQuery,
		HeaderDropdownMenuFragment$key
	>(HeaderDropdownMenuFragment, account);

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

	const items = data.organizations.edges.map((edge) => ({
		id: edge.node.id,
		name: edge.node.name,
		logoUrl: edge.node.logoUrl,
		slug: edge.node.slug,
	}));

	return (
		<DropdownMenu
			aria-label="ACME features"
			itemClasses={{
				base: "gap-4",
			}}
		>
			<DropdownSection showDivider items={items}>
				{(item) => {
					const isLast = item === items[items.length - 1];

					return (
						<DropdownItem
							key={item.slug}
							href={links.organizationDetail(item.slug)}
							startContent={
								<div className="relative h-8 w-8">
									<Image
										src={item.logoUrl}
										alt="Organization Logo"
										fill
										className="rounded-md object-cover"
										sizes="20vw"
									/>
								</div>
							}
						>
							<p ref={isLast ? observerRef : undefined}>{item.name}</p>
						</DropdownItem>
					);
				}}
			</DropdownSection>
			{isLoadingNext ? <HeaderOrganizationListSkeleton /> : null}
			<DropdownSection>
				<DropdownItem
					key="new_organization"
					description="Create or join an organization"
					startContent={<PlusIcon />}
				>
					New organization
				</DropdownItem>
			</DropdownSection>
		</DropdownMenu>
	);
}

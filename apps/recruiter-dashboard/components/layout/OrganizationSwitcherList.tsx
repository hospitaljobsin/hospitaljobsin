import type { HeaderQuery } from "@/__generated__/HeaderQuery.graphql";
import type { OrganizationSwitcherListFragment$key } from "@/__generated__/OrganizationSwitcherListFragment.graphql";
import links from "@/lib/links";
import { Divider } from "@heroui/react";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import HeaderOrganizationListSkeleton from "./HeaderOrganizationListSkeleton";

const OrganizationSwitcherListFragment = graphql`
  fragment OrganizationSwitcherListFragment on Account
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "OrganizationSwitcherListPaginationQuery") {
    organizations(after: $cursor, first: $count)
      @connection(key: "OrganizationSwitcherListFragment_organizations") {
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
	account: OrganizationSwitcherListFragment$key;
	currentSlug: string;
	onSwitch?: () => void; // Optional callback for closing drawer after switch
};

export default function OrganizationSwitcherList({
	account,
	currentSlug,
	onSwitch,
}: Props) {
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		HeaderQuery,
		OrganizationSwitcherListFragment$key
	>(OrganizationSwitcherListFragment, account);

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
		<div className="flex flex-col gap-2">
			{items.map((item, idx) => {
				const isCurrent = item.slug === currentSlug;
				const isLast = idx === items.length - 1;
				return (
					<a
						key={item.slug}
						href={links.organizationDetail(item.slug)}
						className={clsx(
							"flex items-center gap-3 px-3 py-2 rounded-md font-medium",
							isCurrent ? "bg-background-600" : "hover:bg-background-700",
						)}
						onClick={onSwitch}
					>
						<div className="relative h-8 w-8">
							<Image
								src={item.logoUrl}
								alt="Organization Logo"
								fill
								className="rounded-md object-cover"
								sizes="20vw"
							/>
						</div>
						<span className="truncate">{item.name}</span>
						{/* Infinite scroll observer */}
						{isLast ? <div ref={observerRef} /> : null}
					</a>
				);
			})}
			{isLoadingNext ? <HeaderOrganizationListSkeleton /> : null}
			<Divider />
			<a
				href={links.createOrganization}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background-700 transition-colors"
			>
				<PlusIcon className="w-5 h-5" />
				<span>New organization</span>
			</a>
		</div>
	);
}

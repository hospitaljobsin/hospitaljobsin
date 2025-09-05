import type { HeaderQuery } from "@/__generated__/HeaderQuery.graphql";
import type { OrganizationSwitcherListFragment$key } from "@/__generated__/OrganizationSwitcherListFragment.graphql";
import links from "@/lib/links";
import { Divider } from "@heroui/react";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
	showScrollIndicators?: boolean; // Whether to show scroll indicators for mobile
};

export default function OrganizationSwitcherList({
	account,
	currentSlug,
	onSwitch,
	showScrollIndicators = false,
}: Props) {
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		HeaderQuery,
		OrganizationSwitcherListFragment$key
	>(OrganizationSwitcherListFragment, account);

	const observerRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [showBottomGradient, setShowBottomGradient] = useState(false);
	const [showTopGradient, setShowTopGradient] = useState(false);

	// Handle scroll indicators
	useEffect(() => {
		if (!showScrollIndicators || !containerRef.current) return;

		const container = containerRef.current;

		const checkScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			setShowTopGradient(scrollTop > 0);
			setShowBottomGradient(scrollTop < scrollHeight - clientHeight - 5);
		};

		// Initial check
		checkScroll();

		container.addEventListener("scroll", checkScroll);
		return () => container.removeEventListener("scroll", checkScroll);
	}, [showScrollIndicators]);

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

	// Filter out the current organization
	const items = data.organizations.edges
		.map((edge) => ({
			id: edge.node.id,
			name: edge.node.name,
			logoUrl: edge.node.logoUrl,
			slug: edge.node.slug,
		}))
		.filter((item) => item.slug !== currentSlug);

	const hasOtherOrganizations = items.length > 0;

	// Scrollable organization list content
	const scrollableContent = (
		<div className="flex flex-col gap-2">
			{items.map((item, idx) => {
				const isLast = idx === items.length - 1;
				return (
					<a
						key={item.slug}
						href={links.organizationDetail(item.slug)}
						className={clsx(
							"flex items-center gap-3 px-3 py-2 rounded-md font-medium",
							"hover:bg-background-700",
						)}
						onClick={onSwitch}
					>
						<div className="relative aspect-square h-8 w-8">
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
		</div>
	);

	// Always visible create organization button
	const createOrgButton = (
		<a
			href={links.createOrganization}
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background-700 transition-colors"
		>
			<PlusIcon className="w-5 h-5" />
			<span>New organization</span>
		</a>
	);

	if (!showScrollIndicators) {
		return (
			<div className="flex flex-col gap-2">
				{scrollableContent}
				{/* Only show divider if there are other organizations */}
				{hasOtherOrganizations && <Divider />}
				{createOrgButton}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{/* Scrollable area with indicators */}
			<div className="relative">
				<div ref={containerRef} className="relative max-h-48 overflow-y-auto">
					{scrollableContent}
				</div>
				{/* Top gradient fade */}
				{showTopGradient && (
					<div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background-600 to-transparent pointer-events-none z-10" />
				)}
				{/* Bottom gradient fade */}
				{showBottomGradient && (
					<div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background-600 to-transparent pointer-events-none z-10" />
				)}
			</div>
			{/* Always visible divider and create button */}
			{hasOtherOrganizations && <Divider />}
			{createOrgButton}
		</div>
	);
}

"use client";
import type { SidebarQuery as SidebarQueryType } from "@/__generated__/SidebarQuery.graphql";
import links from "@/lib/links";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	Dropdown,
	DropdownTrigger,
} from "@heroui/react";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import AuthNavigation from "./AuthNavigation";
import HeaderOrganizationList from "./HeaderDropdownMenu";

export const SidebarQuery = graphql`
  query SidebarQuery($organizationSlug: String!) {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
        ...HeaderDropdownMenuFragment
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
    organization(slug: $organizationSlug) {
      __typename
      ... on Organization {
        name
        slug
        logoUrl
      }
    }
  }
`;

type Props = {
	queryReference: PreloadedQuery<SidebarQueryType>;
};

export default function Sidebar({ queryReference }: Props) {
	const data = usePreloadedQuery<SidebarQueryType>(
		SidebarQuery,
		queryReference,
	);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	const [mobileOpen, setMobileOpen] = useState(false);

	// Example navigation items (customize as needed)
	const navItems = [
		{ label: "Dashboard", href: links.dashboard },
		{
			label: "Jobs",
			href: links.organizationDetailJobs(data.organization.slug),
		},
		{
			label: "Members",
			href: links.organizationDetailMembers(data.organization.slug),
		},
		{
			label: "Settings",
			href: links.organizationDetailSettings(data.organization.slug),
		},
	];

	return (
		<>
			{/* Mobile top bar */}
			<div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-foreground-300">
				<div className="flex items-center gap-2">
					<button onClick={() => setMobileOpen(true)} aria-label="Open sidebar">
						<Menu className="w-6 h-6" />
					</button>
					<div className="relative h-8 w-8">
						<Image
							src={data.organization.logoUrl}
							alt="Organization Logo"
							fill
							className="rounded-md object-cover"
							sizes="20vw"
						/>
					</div>
					<span className="text-md">{data.organization.name}</span>
				</div>
				<AuthNavigation rootQuery={data.viewer} isMobile={true} />
			</div>
			{/* Sidebar for desktop */}
			<aside className="hidden md:flex flex-col w-64 min-w-64 h-full bg-background-900 border-r border-foreground-300 px-4 py-6 gap-8">
				{/* Organization switcher */}
				<div className="flex items-center gap-4 mb-6">
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<div className="flex items-center gap-4 cursor-pointer">
								<div className="relative h-8 w-8">
									<Image
										src={data.organization.logoUrl}
										alt="Organization Logo"
										fill
										className="rounded-md object-cover"
										sizes="20vw"
									/>
								</div>
								<span className="text-md">{data.organization.name}</span>
								<ChevronDown strokeWidth={1} />
							</div>
						</DropdownTrigger>
						<HeaderOrganizationList account={data.viewer} />
					</Dropdown>
				</div>
				{/* Navigation links */}
				<nav className="flex flex-col gap-2">
					{navItems.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="px-3 py-2 rounded-md text-foreground-900 hover:bg-background-700 font-medium transition-colors"
						>
							{item.label}
						</a>
					))}
				</nav>
				<div className="mt-auto">
					<AuthNavigation rootQuery={data.viewer} isMobile={false} />
				</div>
			</aside>
			{/* Mobile drawer using HeroUI Drawer */}
			<Drawer
				isOpen={mobileOpen}
				onClose={() => setMobileOpen(false)}
				placement="left"
			>
				<DrawerContent className="p-0 bg-background h-full">
					<DrawerHeader className="flex items-center gap-4 mb-6 border-b border-foreground-300 px-4 py-4">
						<div className="relative h-8 w-8">
							<Image
								src={data.organization.logoUrl}
								alt="Organization Logo"
								fill
								className="rounded-md object-cover"
								sizes="20vw"
							/>
						</div>
						<span className="text-md">{data.organization.name}</span>
					</DrawerHeader>
					<DrawerBody className="flex flex-col gap-8 px-4 py-6 h-full">
						<nav className="flex flex-col gap-2">
							{navItems.map((item) => (
								<a
									key={item.href}
									href={item.href}
									className="px-3 py-2 rounded-md text-foreground-900 hover:bg-background-700 font-medium transition-colors"
									onClick={() => setMobileOpen(false)}
								>
									{item.label}
								</a>
							))}
						</nav>
						<div className="mt-auto">
							<AuthNavigation rootQuery={data.viewer} isMobile={true} />
						</div>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}

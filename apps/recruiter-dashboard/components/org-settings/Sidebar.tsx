"use client";

import type { SidebarOrgSettingsQuery as SidebarOrgSettingsQueryType } from "@/__generated__/SidebarOrgSettingsQuery.graphql";
import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { Mail, Settings, Users, VerifiedIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { type PreloadedQuery, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";

const items = [
	{
		icon: Settings,
		label: "General",
		href: links.organizationDetailSettings,
	},
	{
		icon: Users,
		label: "Members",
		href: links.organizationDetailMembers,
	},
	{
		icon: Mail,
		label: "Invites",
		href: links.organizationDetailMemberInvites,
	},
	{
		icon: VerifiedIcon,
		label: "Verification",
		href: links.organizationDetailVerification,
	},
];

export const SidebarOrgSettingsQuery = graphql`
	query SidebarOrgSettingsQuery($slug: String!) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				isMember
			}
		}

	}
`;

export default function OrgSettingsSidebar({
	queryReference,
}: { queryReference: PreloadedQuery<SidebarOrgSettingsQueryType> }) {
	const pathname = usePathname();
	const data = usePreloadedQuery(SidebarOrgSettingsQuery, queryReference);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isMember
	) {
		return null;
	}

	return (
		<>
			<div className="w-64 p-4 bg-background-700 justify-start hidden lg:flex lg:sticky top-0 self-stretch max-h-screen">
				<Tabs
					aria-label="Settings Navigation"
					isVertical
					variant="light"
					selectedKey={pathname}
					classNames={{
						tabWrapper: "w-full",
						base: "w-full",
						tabContent: "w-full",
						tabList: "w-full",
						panel: "h-full",
						tab: "py-5",
						cursor: "shadow-none",
					}}
				>
					{items.map((item) => (
						<Tab
							key={item.href}
							href={item.href}
							title={
								<div className="flex items-center space-x-4">
									<item.icon size={20} />
									<span>{item.label}</span>
								</div>
							}
						/>
					))}
				</Tabs>
			</div>
			<div className="w-full lg:hidden p-4 bg-background-700 flex justify-start">
				<Tabs
					aria-label="Settings Navigation"
					variant="light"
					selectedKey={pathname}
					classNames={{
						base: "w-full overflow-x-auto",
						tabList: "gap-4",
						cursor: "shadow-none",
					}}
				>
					{items.map((item) => (
						<Tab
							key={item.href}
							href={item.href}
							title={
								<div className="flex items-center space-x-4">
									<item.icon size={16} />
									<span>{item.label}</span>
								</div>
							}
						/>
					))}
				</Tabs>
			</div>
		</>
	);
}

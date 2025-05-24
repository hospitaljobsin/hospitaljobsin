"use client";
import { Tab, Tabs } from "@heroui/react";
import { HomeIcon, UserIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import links from "@/lib/links";

export default function OrganizationTabs() {
	const pathnname = usePathname();
	const params = useParams<{ slug: string }>();
	return (
		<div className="flex w-full flex-col">
			<Tabs
				aria-label="Organization Detail Menu"
				color="default"
				variant="underlined"
				classNames={{
					tabList: "py-0",
					tab: "py-6",
				}}
				selectedKey={pathnname}
			>
				<Tab
					key={links.organizationDetail(params.slug)}
					href={links.organizationDetail(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<HomeIcon />
							<span>Overview</span>
						</div>
					}
				/>
				<Tab
					key={links.organizationDetailMembers(params.slug)}
					href={links.organizationDetailMembers(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<UserIcon />
							<span>Members</span>
						</div>
					}
				/>
			</Tabs>
		</div>
	);
}

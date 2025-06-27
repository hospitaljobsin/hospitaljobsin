"use client";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Tab, Tabs } from "@heroui/react";
import { HomeIcon, UserIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export default function OrganizationTabs() {
	const pathnname = usePathname();
	const params = useParams<{ slug: string }>();
	const router = useRouter();
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
				onSelectionChange={(key) => {
					if (typeof key === "string") {
						router.push(key);
					}
				}}
			>
				<Tab
					key={links.organizationDetail(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<HomeIcon />
							<span>Overview</span>
						</div>
					}
				/>
				<Tab
					key={links.organizationDetailMembers(params.slug)}
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

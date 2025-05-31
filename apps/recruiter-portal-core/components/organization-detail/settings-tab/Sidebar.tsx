"use client";

import { Tab, Tabs } from "@heroui/react";
import { Settings } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import links from "@/lib/links";

export default function SettingsSidebar() {
	const pathname = usePathname();
	const params = useParams<{ slug: string }>();
	return (
		<>
			<div className="w-64 p-4 bg-background-700 justify-start hidden md:flex md:sticky top-0 self-stretch max-h-screen">
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
					<Tab
						key={links.organizationDetailSettings(params.slug)}
						href={links.organizationDetailSettings(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<Settings size={20} />
								<span>General</span>
							</div>
						}
					/>
				</Tabs>
			</div>
			<div className="w-full md:hidden p-4 bg-background-700 flex justify-start">
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
					<Tab
						key={links.organizationDetailSettings(params.slug)}
						href={links.organizationDetailSettings(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<Settings size={16} />
								<span>General</span>
							</div>
						}
					/>
				</Tabs>
			</div>
		</>
	);
}

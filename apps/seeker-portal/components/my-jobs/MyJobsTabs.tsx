"use client";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Tab, Tabs } from "@heroui/react";
import { BookmarkIcon, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MyJobsTabs() {
	const pathnname = usePathname();
	const router = useRouter();
	return (
		<div className="flex w-full flex-col">
			<Tabs
				aria-label="My Jobs Detail Menu"
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
					key={links.savedJobs}
					title={
						<div className="flex items-center space-x-2">
							<BookmarkIcon />
							<span>Saved</span>
						</div>
					}
				/>
				<Tab
					key={links.appliedJobs}
					title={
						<div className="flex items-center space-x-2">
							<UserIcon />
							<span>Applied</span>
						</div>
					}
				/>
			</Tabs>
		</div>
	);
}

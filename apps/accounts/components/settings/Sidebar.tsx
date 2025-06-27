"use client";

import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Tab, Tabs } from "@heroui/react";
import { Cookie, Fingerprint, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SettingsSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	return (
		<>
			<div className="self-stretch h-[calc(100vh-4.2rem)] w-64 p-4 bg-background-700 justify-start hidden md:flex md:sticky md:top-16 ">
				<Tabs
					aria-label="Settings Navigation"
					isVertical
					variant="light"
					selectedKey={pathname}
					onSelectionChange={(key) => {
						if (typeof key === "string") {
							router.push(key);
						}
					}}
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
						key={links.settings}
						title={
							<div className="flex items-center space-x-4">
								<UserIcon size={20} />
								<span>Account</span>
							</div>
						}
					/>
					<Tab
						key={links.settingsPasskeys}
						title={
							<div className="flex items-center space-x-4">
								<Fingerprint size={20} />
								<span>Passkeys</span>
							</div>
						}
					/>
					<Tab
						key={links.settingsSessions}
						title={
							<div className="flex items-center space-x-4">
								<Cookie size={20} />
								<span>Sessions</span>
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
					onSelectionChange={(key) => {
						if (typeof key === "string") {
							router.push(key);
						}
					}}
					classNames={{
						base: "w-full overflow-x-auto",
						tabList: "gap-4",
						cursor: "shadow-none",
					}}
				>
					<Tab
						key={links.settings}
						title={
							<div className="flex items-center space-x-4">
								<UserIcon size={16} />
								<span>Account</span>
							</div>
						}
					/>
					<Tab
						key={links.settingsPasskeys}
						title={
							<div className="flex items-center space-x-4">
								<Fingerprint size={16} />
								<span>Passkeys</span>
							</div>
						}
					/>
					<Tab
						key={links.settingsSessions}
						title={
							<div className="flex items-center space-x-4">
								<Cookie size={16} />
								<span>Sessions</span>
							</div>
						}
					/>
				</Tabs>
			</div>
		</>
	);
}
